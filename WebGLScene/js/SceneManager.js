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

import dat from '../node_modules/dat.gui/build/dat.gui.module.js';

export default canvas => {

    const clock = new THREE.Clock();
    
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const sceneConstants = parseConfig(sceneConfig);
    const datGui = new dat.GUI();

    mapObject(datGui, sceneConfig);

    function mapObject(datGui, object, folder) {
        for(let key in object) {  

            if(typeof object[key] === 'object') {

                let newFolder;
                if(folder)
                    newFolder = folder.addFolder(key);
                else
                    newFolder = datGui.addFolder(key);

                mapObject(datGui, object[key], newFolder);

            } else {
                let controller;

                const scale = ( ( key === 'x' || key === 'y' ) && folder.parent.name !== 'floor' ) ? 1 : 100;

                if(folder)
                    controller = folder.add( object, key, 0, 1 *scale );
                else
                    controller = datGui.add( object, key, 0, 1 *scale );

                controller.onChange( value => { 
                    updateSceneConstants(sceneConstants, parseConfig(sceneConfig));
                    controls.resetPosition(); 
                } );
            }

        }
    }

    function updateSceneConstants(sceneConstants, newSceneConstants) {
        const { floor, robot, sonars, movingObstacles, staticObstacles } = newSceneConstants;
    
        sceneConstants.floor.size.x = floor.size.x;
        sceneConstants.floor.size.y = floor.size.y;

        sceneConstants.robot.position.x = robot.position.x;
        sceneConstants.robot.position.y = robot.position.y;
        sceneConstants.robot.speed = robot.speed;
    
        for(let i=0; i<sceneConstants.sonars.length; i++) {
            sceneConstants.sonars[i].position.x = sonars[i].position.x;
            sceneConstants.sonars[i].position.y = sonars[i].position.y;

            sceneConstants.sonars[i].senseAxis.x = sonars[i].senseAxis.x;
            sceneConstants.sonars[i].senseAxis.y = sonars[i].senseAxis.y;
        }

        for(let i=0; i<sceneConstants.movingObstacles.length; i++) {
            sceneConstants.movingObstacles[i].position.x = movingObstacles[i].position.x;
            sceneConstants.movingObstacles[i].position.y = movingObstacles[i].position.y;

            sceneConstants.movingObstacles[i].directionAxis.x = movingObstacles[i].directionAxis.x;
            sceneConstants.movingObstacles[i].directionAxis.y = movingObstacles[i].directionAxis.y;
            sceneConstants.movingObstacles[i].speed = movingObstacles[i].speed;
            sceneConstants.movingObstacles[i].range = movingObstacles[i].range;
        }

        for(let i=0; i<sceneConstants.staticObstacles.length; i++) {
            sceneConstants.staticObstacles[i].centerPosition.x = staticObstacles[i].centerPosition.x;
            sceneConstants.staticObstacles[i].centerPosition.y = staticObstacles[i].centerPosition.y;

            sceneConstants.staticObstacles[i].size.x = staticObstacles[i].size.x;
            sceneConstants.staticObstacles[i].size.y = staticObstacles[i].size.y;
        }
    }

    function parseConfig(config) {
        const clone = JSON.parse(JSON.stringify(config));

        const { floor, robot, sonars, movingObstacles, staticObstacles } = clone;
    
        robot.position.x = ( robot.position.x - 0.5 ) * floor.size.x;
        robot.position.y = ( robot.position.y - 0.5 ) * floor.size.y;
    
        sonars.forEach( sonar => {
            sonar.position.x = ( sonar.position.x - 0.5 ) * floor.size.x;
            sonar.position.y = ( sonar.position.y - 0.5 ) * floor.size.y;
        });
    
        movingObstacles.forEach( obstacle => {
            obstacle.position.x = ( obstacle.position.x - 0.5 ) * floor.size.x;
            obstacle.position.y = ( obstacle.position.y - 0.5 ) * floor.size.y;
        });
    
        staticObstacles.forEach( obstacle => {
            obstacle.centerPosition.x = ( obstacle.centerPosition.x - 0.5 ) * floor.size.x;
            obstacle.centerPosition.y = ( obstacle.centerPosition.y - 0.5 ) * floor.size.y;
                    
            obstacle.size.x *= floor.size.x;
            obstacle.size.y *= floor.size.y;
        });
    
        return clone;
    }

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

    function buildCamera({ width, height }, {floor}) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 100; 
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.y = 20;

        return camera;
    }

    function createSceneSubjects(scene, sceneConstants, camera) {
        const floorConfig = sceneConstants.floor;
        const robotConfig = sceneConstants.robot;
        const staticObstaclesConfig = sceneConstants.staticObstacles;
        const movingObstaclesConfig = sceneConstants.movingObstacles;
        const sonarsConfig = sceneConstants.sonars;

        const floor = Floor(scene, floorConfig);
        const player = Player(scene, robotConfig);
        const staticObstacles = StaticObstacles(scene, staticObstaclesConfig);
        const movingObstacles = MovingObstacles(scene, movingObstaclesConfig);
        const sonars = Sonars(scene, sonarsConfig);

        const collisionManager = CollisionManager([floor, staticObstacles, movingObstacles, sonars]);
        
        const controls = PlayerControls(player.mesh, camera, robotConfig, collisionManager);

        const sceneSubjects = [
            GeneralLights(scene),
            floor,
            staticObstacles,
            movingObstacles,
            sonars,
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