import * as THREE from '../../node_modules/three/build/three.module.js';

export default (scene, floorSize) => {

    const obstacleRadius = 1;

	const geometry = new THREE.IcosahedronBufferGeometry(obstacleRadius, 2);
	const material = new THREE.MeshStandardMaterial( {color: "#F44336", roughness: 0.1, metalness: 0.1} );
    const movingObstacleBlueprint = new THREE.Mesh( geometry, material );
    movingObstacleBlueprint.position.y = 2;	
	
    const obstacle1 = movingObstacleBlueprint.clone();
    obstacle1.castShadow = true;
    obstacle1.position.x = -6;
    scene.add( obstacle1 );
    
	function update(time) {
        obstacle1.position.z = Math.sin(time)*4;
	}

	function checkCollision(position) {
        if(position.distanceTo( obstacle1.position) < obstacleRadius*3)
			return true;

		return false;
	}

	return {
		update,
		checkCollision
	}
}