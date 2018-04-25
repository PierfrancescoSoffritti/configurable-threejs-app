import * as THREE from '../node_modules/three/build/three.module.js';

import GeneralLights from './sceneSubjects/GeneralLights.js';
import Floor from './sceneSubjects/Floor.js';
import StaticObstacles from './sceneSubjects/StaticObstacles.js';
import MovingObstacles from './sceneSubjects/MovingObstacles.js';
import Player from './sceneSubjects/Player.js';
import PlayerControls from './controls/PlayerControls.js';
import CollisionManager from './CollisionManager.js';
import Sonars from './sceneSubjects/Sonars.js';

import sceneConfig from '../sceneConfig.js';

export default canvas => {

    const clock = new THREE.Clock();
    
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
    // const sceneConstants = {
    //     floorSize: 50
    // }

    const sceneConstants = sceneConfig;

    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions, sceneConstants);
    const {sceneSubjects, controls} = createSceneSubjects(scene, sceneConstants, camera);

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true; 
        
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        return renderer;
    }

    function buildCamera({ width, height }, {ground}) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 100; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.y = 20;

        return camera;
    }

    function createSceneSubjects(scene, sceneConstants, camera) {
        const groundConfig = sceneConstants.ground;
        const robotConfig = sceneConstants.robot;
        const staticObstaclesConfig = sceneConstants.staticObstacles;

        const floor = Floor(scene, groundConfig);
        const player = Player(scene, robotConfig);
        const staticObstacles = StaticObstacles(scene, staticObstaclesConfig);
        //const movingObstacles = MovingObstacles(scene, ground.size.x);
        //const sensors = Sonars(scene, player.mesh.position, ground.size.x);

        //const collisionManager = CollisionManager([floor, staticObstacles, movingObstacles, sensors]);
        const collisionManager = CollisionManager([floor, staticObstacles]);
        const controls = PlayerControls(player.mesh, camera, collisionManager);

        const sceneSubjects = [
            GeneralLights(scene),
            floor,
            //staticObstacles,
            //movingObstacles,
            //sensors,
            player,
            controls
        ];

        return { sceneSubjects, controls };
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<sceneSubjects.length; i++)
        	sceneSubjects[i].update(elapsedTime);

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    function onKeyDown(keyCode, duration) {
        controls.onKeyDown(keyCode, duration)
    }

    function onKeyUp(keyCode) {
        controls.onKeyUp(keyCode)        
    }

    return {
        update,
        onWindowResize,
        onKeyDown,
        onKeyUp
      }
}