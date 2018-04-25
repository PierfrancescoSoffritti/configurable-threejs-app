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

// {
// 	name: "static-obstacle-1",
// 	centerPosition: { x: 1, y: 1},
// 	size: { x: 1, y: 1}
// }

function StaticObstacle(scene, config) {

	const geometry = new THREE.BoxBufferGeometry( config.size.x, 4, config.size.y);
	const material = new THREE.MeshStandardMaterial( {color: "#269C26", roughness: 0.5, metalness: 0.1} );
	const obstacle = new THREE.Mesh( geometry, material );
	obstacle.castShadow = true;
	
	obstacle.position.x = config.centerPosition.x;
	obstacle.position.y = 2;
	obstacle.position.z = -config.centerPosition.y;

    scene.add( obstacle );
	
	function update(time) {
	}

	function checkCollision(position) {
		//if( Math.abs(position.x) <= obstacle1.position.x+obstacleWidth*2  && Math.abs(position.z) >= obstacle1.position.z-obstacleLength/2 )
			//return true;
		//else
			return false;
	}

	return {
		update,
		checkCollision
	}
}