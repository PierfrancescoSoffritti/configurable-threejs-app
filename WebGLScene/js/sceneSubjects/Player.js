import * as THREE from '../../node_modules/three/build/three.module.js';

import eventBus from '../eventBus/EventBus.js';
import eventBusEvents from '../eventBus/events.js';


export default (scene, robotConfiguration) => {

    const playerPosition = { x: robotConfiguration.position.x, y: 2, z: robotConfiguration.position.y };

    const group = new THREE.Group();
    group.rotation.y = Math.PI;
    
    group.position.set(playerPosition.x, playerPosition.y, playerPosition.z);    

    scene.add(group);

    let playerMesh;
    loadPlayerMeshAsync();

    function loadPlayerMeshAsync() {
        const loader = new THREE.JSONLoader()
        loader.load('models/spaceship.json', function(playerGeometry, playerMaterials) {

            playerMaterials;
            
            for(let i=0; i<playerMaterials.length; i++) {
                playerMaterials[i].flatShading = true
                playerMaterials[i].shininess = 0 
                playerMaterials[i].metalness = 0 
                playerMaterials[i].roughness = 0.4
            }

            playerMesh = new THREE.Mesh(playerGeometry, playerMaterials);
            playerMesh.rotation.y = Math.PI/2;
            playerMesh.castShadow = true;

            group.add(playerMesh);
            self.mesh = playerMesh;
        })
    }

    function update(time) {
        const scale = (Math.sin(time)+4)/5;
        const positionY = Math.sin(time)/4;

        group.position.y = playerPosition.y + positionY;
    }

    return {
        mesh: group,
        update
    }
}

function PositionMarker(scene, robotConfiguration) {

    const geometry = new THREE.SphereGeometry( 1, 4, 2 );
	const material = new THREE.MeshStandardMaterial( {color: "#2196F3", roughness: 0.5, metalness: 0.1, flatShading: true} );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.rotation.x = -Math.PI/2

    const positionY = 6;
    mesh.position.set(-robotConfiguration.position.x, positionY, -robotConfiguration.position.y)

    scene.add(mesh);
    
    function update(time) {
        const scale = (Math.sin(time)+4)/5;

        mesh.position.y = positionY + Math.sin(time*0.5)/4;
        mesh.scale.set(scale, scale, scale);
        mesh.rotation.z += .01;
    }

    return {
        update
    }
}