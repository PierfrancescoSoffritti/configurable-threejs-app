import * as THREE from '../../node_modules/three/build/three.module.js'

export default (scene, movingObstaclesConfig) => {
    const obstacles = []
	movingObstaclesConfig.forEach( config => obstacles.push(new MovingObstacle(scene, config) ) )
    
	function update(time) {
        obstacles.forEach( obstacle => obstacle.update(time) )
	}

	function checkCollision(position) {
        for(let i=0; i<obstacles.length; i++) {
			const collisionCheck = obstacles[i].checkCollision(position)
			
			if(collisionCheck.collision)
				return collisionCheck
		}

		return { collision: false }
	}

	return {
		update,
		checkCollision
	}
}

function MovingObstacle(scene, config) {
	const obstacleRadius = 1
	const detail = 2

	const geometry = new THREE.IcosahedronBufferGeometry(obstacleRadius, detail)
	const material = new THREE.MeshStandardMaterial( {color: '#F44336', roughness: 0.1, metalness: 0.1} )
	const obstacle = new THREE.Mesh( geometry, material )
	obstacle.castShadow = true

	obstacle.position.y = 2

    scene.add( obstacle )
    
	function update(time) {
		const sin = Math.sin(time * config.speed )*config.range

		obstacle.position.x = config.position.x + ( config.directionAxis.x ? sin : 0 )
		obstacle.position.z = config.position.y + ( config.directionAxis.y ? sin : 0 )
	}

	function checkCollision(position) {
        if(position.distanceTo( obstacle.position) < obstacleRadius*3)
			return { collision: true, objectName: config.name }
		else
			return { collision: false }
	}

	return {
		update,
		checkCollision
	}
}