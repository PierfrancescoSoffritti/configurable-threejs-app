import * as THREE from '../../node_modules/three/build/three.module.js'

export default (scene, staticObstaclesConfig) => {
	const obstacles = []
	staticObstaclesConfig.forEach( config => obstacles.push(new StaticObstacle(scene, config)) )
	
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

function StaticObstacle(scene, config) {
	const geometry = new THREE.BoxBufferGeometry( 1, 4, 1)
	const material = new THREE.MeshStandardMaterial( {color: '#269C26', roughness: 0.5, metalness: 0.1} )
	const mesh = new THREE.Mesh( geometry, material )
	mesh.castShadow = true
	scene.add(mesh)

	const padding = 2
	
	const obstacleBoundaries = {
		minX: -1,
		maxX: -1,

		minY: -1,
		maxY: -1
	}
	
	function update(time) {
		mesh.scale.set( config.size.x, 1, config.size.y )
		mesh.position.set( config.centerPosition.x, 2, -config.centerPosition.y )

		obstacleBoundaries.minX = config.centerPosition.x - config.size.x/2 -padding
		obstacleBoundaries.maxX = config.centerPosition.x + config.size.x/2 +padding
		obstacleBoundaries.minY = config.centerPosition.y - config.size.y/2 -padding
		obstacleBoundaries.maxY = config.centerPosition.y + config.size.y/2 +padding
	}

	function checkCollision(position) {
		const positivePositionZ = -position.z

		if( ( position.x >= obstacleBoundaries.minX && position.x <= obstacleBoundaries.maxX ) &&
			( positivePositionZ >= obstacleBoundaries.minY && positivePositionZ <= obstacleBoundaries.maxY ) )
			return { collision: true, objectName: config.name }
		else
			return { collision: false }
	}

	return {
		update,
		checkCollision
	}
}