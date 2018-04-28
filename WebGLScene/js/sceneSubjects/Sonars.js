import * as THREE from '../../node_modules/three/build/three.module.js'

import eventBus from '../eventBus/EventBus.js'
import eventBusEvents from '../eventBus/events.js'

export default (scene, sonarsConfig) => {
    const sonars = []
	sonarsConfig.forEach( config => sonars.push(new Sonar(scene, config) ) )
	
	function update(time) {
        sonars.forEach( sonars => sonars.update(time) )
	}
    
    function checkCollision(position) {
        for(let i=0; i<sonars.length; i++) {
			const collisionCheck = sonars[i].checkCollision(position)
			
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

function Sonar(scene, config) {
    const size = 2

	const geometry = new THREE.BoxBufferGeometry( size, size, size )
    const material = new THREE.MeshStandardMaterial( {color: '#45B045', roughness: 0.5, metalness: 0.1} )
    material.redChannel = material.color.r
    const mesh = new THREE.Mesh( geometry, material )
    mesh.castShadow = true
    scene.add( mesh )

    let sensedX, sensedY = false
    const padding = 1.5
    
    let currentTime, prevTime;

	function update(time) {     
        currentTime = time;

        mesh.position.set( config.position.x, size/1.5, config.position.y )
        updateColor(sensedX || sensedY, mesh.material)
    }

	function checkCollision(position) {
        if(config.senseAxis.x) 
            sensedX = sense( { x: position.x, y: position.z }, { x: config.position.x, y: config.position.y }, padding, 'x', config.name )
        else
            sensedX = false

        if(config.senseAxis.y)
            sensedY = sense( { x: position.z, y: position.x }, { x: config.position.y, y: config.position.x }, padding, 'y', config.name )
        else
            sensedY = false
                    
        return { collision: false }
    }
    
    function sense(targetPosition, sonarPosition, padding, axis, sonarName) {
        if(targetPosition.y >= sonarPosition.y -padding && targetPosition.y <= sonarPosition.y +padding) {
            const distance = Math.trunc( sonarPosition.x - targetPosition.x )
            postEvent(sonarName, distance, axis)
            return true
        } else
            return false
    }

    function postEvent(sonarName, distance, axis) {
        const deltaTime = currentTime - prevTime;
        if(deltaTime < .8) return;
        else prevTime = currentTime;

        eventBus.post(eventBusEvents.sonarActivated, { sonarName, distance, axis })
    }

    function updateColor(sensed, material) {
        if( sensed && material.color.r < 3 )
            material.color.r += 0.2
        else if( material.color.r > material.redChannel )
            material.color.r -= 0.2
    }

	return {
		update,
		checkCollision
	}
}