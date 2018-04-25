import * as THREE from '../../node_modules/three/build/three.module.js';
import eventBus from '../EventBus.js';

export default (scene, sonarsConfig) => {

    const sonars = [];
	sonarsConfig.forEach( config => sonars.push(new Sonar(scene, config) ) );
	
	function update(time) {
        sonars.forEach( sonars => sonars.update(time) );
	}

	function checkCollision(position) {
        for(let i=0; i<sonars.length; i++)
			if( sonars[i].checkCollision(position) )
				return true;

		return false;
	}

	return {
		update,
		checkCollision
	}
}

function Sonar(scene, sonarsConfig) {
    const size = 2;

	const geometry = new THREE.BoxBufferGeometry( size, size, size );
    const material = new THREE.MeshStandardMaterial( {color: "#45B045", roughness: 0.5, metalness: 0.1} );
    material.redChannel = material.color.r;
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;

    mesh.position.set( sonarsConfig.position.x, size/1.5, sonarsConfig.position.y );

    scene.add( mesh );

    let sensed = false;
    const padding = 1.5;
	
	function update(time) {       
        updateColor(sensed, mesh.material); 
    }

	function checkCollision(position) {
    
        if(sonarsConfig.senseAxis.x) 
            sensed = sense( { x: position.x, y: position.z }, { x: sonarsConfig.position.x, y: sonarsConfig.position.y }, padding, "x", sonarsConfig.name )

        if(sonarsConfig.senseAxis.y)
            sensed = 
                sense( { x: position.z, y: position.x }, { x: sonarsConfig.position.y, y: sonarsConfig.position.x }, padding, "y", sonarsConfig.name )
                    ? true : sensed;

        return false;
    }
    
    function sense(targetPosition, sonarPosition, padding, axis, sonarName) {
        if(targetPosition.y >= sonarPosition.y -padding && targetPosition.y <= sonarPosition.y +padding) {
            
            const distance = Math.trunc( sonarPosition.x - targetPosition.x );
            eventBus.post("sonarActivated", { sonarName, distance, axis })

            return true;
        } else
            return false;
    }

    function updateColor(sensed, material) {
        if( sensed && material.color.r < 3 )
            material.color.r += 0.2;
        else if( material.color.r > material.redChannel )
            material.color.r -= 0.2;
    }

	return {
		update,
		checkCollision
	}
}