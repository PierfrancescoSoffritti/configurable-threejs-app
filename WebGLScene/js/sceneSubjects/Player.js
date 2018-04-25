import * as THREE from '../../node_modules/three/build/three.module.js';
import eventBus from '../EventBus.js';

export default (scene, robot) => {

    //const playerPosition = { x: robot.position.x, y: 30, z: robot.position.y };
    const playerPosition = { x: robot.position.x, y: 3, z: robot.position.y };

    const group = new THREE.Group();
    group.rotation.y = Math.PI;
    
    group.position.x = playerPosition.x;
    group.position.y = playerPosition.y;
    group.position.z = playerPosition.z;

    scene.add(group);

    /*
    const geometry = new THREE.SphereGeometry( 1, 4, 2 );
	const material = new THREE.MeshStandardMaterial( {color: "#2196F3", roughness: 0.5, metalness: 0.1, flatShading: true} );
    const finalPositionMarker = new THREE.Mesh( geometry, material );
    const positionMarkerY = 6;
    finalPositionMarker.rotation.x = -Math.PI/2
    finalPositionMarker.position.z = group.position.z;
    finalPositionMarker.position.x = -floorSize/3;
    finalPositionMarker.position.y = positionMarkerY;
    finalPositionMarker.castShadow = true;
    scene.add(finalPositionMarker)
    */

    let playerMesh;

    eventBus.subscribe( 'spawnRobot', () => {
        new TWEEN.Tween(playerPosition)
        .to({ y: 2 }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start() 
    });

    loadPlayerMesh();

    function loadPlayerMesh() {
        const loader = new THREE.JSONLoader()
        loader.load('models/spaceship.json', function(playerGeometry, playerMaterials) {

            self.materials = playerMaterials;
            
            for(let i=0; i<playerMaterials.length; i++) {
                playerMaterials[i].flatShading = true
                playerMaterials[i].shininess = 0 
                playerMaterials[i].metalness = 0 
                playerMaterials[i].roughness = 0.4
            }

            playerMesh = new THREE.Mesh(playerGeometry, playerMaterials);
            playerMesh.rotation.y = Math.PI/2;
            playerMesh.castShadow = true;
            const scale = 1;
            playerMesh.scale.set(scale, scale, scale)
            group.add(playerMesh);

            self.mesh = playerMesh;
        })
    }

    function update(time) {
        const scale = (Math.sin(time)+4)/5;
        const positionY = Math.sin(time)/4;

        group.position.y = playerPosition.y + positionY;

        /*
        finalPositionMarker.position.y = positionMarkerY + positionY;
        finalPositionMarker.scale.set(scale, scale, scale);
        finalPositionMarker.rotation.z += .01;
        */
    }

    return {
        mesh: group,
        update
    }
}