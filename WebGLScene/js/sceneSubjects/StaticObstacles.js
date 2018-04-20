import * as THREE from '../../node_modules/three/build/three.module.js';

export default (scene, floorSize) => {
	
	const obstacleLength = floorSize/2.5;
	const obstacleWidth = 1;

	const geometry = new THREE.BoxBufferGeometry( obstacleWidth, obstacleLength, 4);
	const material = new THREE.MeshStandardMaterial( {color: "#269C26", roughness: 0.5, metalness: 0.1} );
	const staticObstacleBlueprint = new THREE.Mesh( geometry, material );
	staticObstacleBlueprint.castShadow = true;
    staticObstacleBlueprint.position.y = 1.9;
	staticObstacleBlueprint.rotation.x = Math.PI/2;
	
	const obstacle1 = staticObstacleBlueprint.clone();
	obstacle1.position.z = (floorSize/2)-obstacleLength/2;
    scene.add( obstacle1 );
    
	const obstacle2 = staticObstacleBlueprint.clone();
    obstacle2.position.z = -(floorSize/2)+obstacleLength/2;
    scene.add( obstacle2 );
	
	function update(time) {
		//const scale = Math.sin(time)+2;
		//mesh.scale.set(scale, scale, scale);
	}

	function checkCollision(position) {
		if( ( Math.abs(position.x) <= obstacle1.position.x+obstacleWidth*2 || Math.abs(position.x) <= obstacle2.position.x+obstacleWidth*2 ) &&
			Math.abs(position.z) >= obstacle1.position.z-obstacleLength/2 )
			return true;
		else
			return false;
	}

	return {
		update,
		checkCollision
	}
}