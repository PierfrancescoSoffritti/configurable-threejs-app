import * as THREE from '../../node_modules/three/build/three.module.js';

export default (scene, movingObstaclesConfig) => {

    const obstacles = [];
	movingObstaclesConfig.forEach( config => obstacles.push(new MovingObstacle(scene, config) ) );
    
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
// 	name: "moving-obstacle-1",
// 	position: { x: 1, y: 1},
// 	directionAxis: { x: 1, y: 0}
// }

function MovingObstacle(scene, config) {
	const obstacleRadius = 1;
	const detail = 2;

	const geometry = new THREE.IcosahedronBufferGeometry(obstacleRadius, detail);
	const material = new THREE.MeshStandardMaterial( {color: "#F44336", roughness: 0.1, metalness: 0.1} );
	const obstacle = new THREE.Mesh( geometry, material );
	obstacle.castShadow = true;

	obstacle.position.x = config.position.x;
	obstacle.position.y = 2;
	obstacle.position.z = config.position.y;

    scene.add( obstacle );
    
	function update(time) {
		const sin = Math.sin(time * config.speed )*4;
		if(config.directionAxis.x)
			obstacle.position.x = config.position.x + sin;
		if(config.directionAxis.y)
			obstacle.position.z = config.position.y + sin;
	}

	function checkCollision(position) {
        // if(position.distanceTo( obstacle.position) < obstacleRadius*3)
		// 	return true;

		return false;
	}

	return {
		update,
		checkCollision
	}
}