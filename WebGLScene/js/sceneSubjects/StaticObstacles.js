import * as THREE from '../../node_modules/three/build/three.module.js';

export default (scene, staticObstaclesConfig) => {

	const obstacles = [];
	staticObstaclesConfig.forEach( config => obstacles.push(new StaticObstacle(scene, config) ) );
	
	function update(time) {
		obstacles.forEach( obstacle => obstacle.update(time) );
	}

	function checkCollision(position) {
		for(let i=0; i<obstacles.length; i++)
			if( obstacles[i].checkCollision(position) )
				return true;

		return false;
	}

	return {
		update,
		checkCollision
	}
}
function StaticObstacle(scene, config) {

	const geometry = new THREE.BoxBufferGeometry( config.size.x, 4, config.size.y);
	const material = new THREE.MeshStandardMaterial( {color: "#269C26", roughness: 0.5, metalness: 0.1} );
	const obstacle = new THREE.Mesh( geometry, material );
	obstacle.castShadow = true;
	
	obstacle.position.x = config.centerPosition.x;
	obstacle.position.y = 2;
	obstacle.position.z = -config.centerPosition.y;

	const padding = 2;
	const obstacleBoundaries = {
		minX: config.centerPosition.x - config.size.x/2 -padding,
		maxX: config.centerPosition.x + config.size.x/2 +padding,

		minY: config.centerPosition.y - config.size.y/2 -padding,
		maxY: config.centerPosition.y + config.size.y/2 +padding
	}

    scene.add( obstacle );
	
	function update(time) {
	}

	function checkCollision(position) {
		const positivePositionZ = -position.z;

		if( ( position.x >= obstacleBoundaries.minX && position.x <= obstacleBoundaries.maxX ) &&
			( positivePositionZ >= obstacleBoundaries.minY && positivePositionZ <= obstacleBoundaries.maxY ) )
			return true;
		else
			return false;
	}

	return {
		update,
		checkCollision
	}
}