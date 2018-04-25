import * as THREE from '../../node_modules/three/build/three.module.js';
import eventBus from '../eventBus/EventBus.js';

export default (scene, robotConfiguration) => {

    //const playerPosition = { x: robotConfiguration.position.x, y: 30, z: robotConfiguration.position.y };
    const playerPosition = { x: robotConfiguration.position.x, y: 2, z: robotConfiguration.position.y };

    const group = new THREE.Group();
    group.rotation.y = Math.PI;
    
    group.position.x = playerPosition.x;
    group.position.y = playerPosition.y;
    group.position.z = playerPosition.z;

    //const positionMarker = new PositionMarker(scene, robotConfiguration);

    scene.add(group);

    let playerMesh;
    loadPlayerMeshAsync();

    eventBus.subscribe( 'spawnRobot', () => {
        new TWEEN.Tween(playerPosition)
        .to({ y: 2 }, 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start() 
    });

    function loadPlayerMeshAsync() {
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

        //positionMarker.update(time);
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
    mesh.position.x = -robotConfiguration.position.x;
    mesh.position.y = positionY;
    mesh.position.z = -robotConfiguration.position.y;

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