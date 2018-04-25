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

// {
//     name: "sonar-1",
//     position: { x: 1, y: 1 },
//     senseAxis: { x: true, y: false }
// }

function Sonar(scene, sonarsConfig) {
    const size = 2;

	const geometry = new THREE.BoxBufferGeometry( size, size, size );
    const material = new THREE.MeshStandardMaterial( {color: "#45B045", roughness: 0.5, metalness: 0.1} );
    material.redChannel = material.color.r;
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;

    mesh.position.set( sonarsConfig.position.x, size/1.5, sonarsConfig.position.y );

    scene.add( mesh );
	
	function update(time) {        
        
	}

	function checkCollision(position) {
        if(position.x >= mesh.position.x-1 && position.x <= mesh.position.x+1) {
            const distance = Math.trunc( mesh.position.z - position.z );
            eventBus.post("sonarActivated", { sonarName: sonarsConfig.name, distance })
            if(mesh.material.color.r < 3)
            mesh.material.color.r += 0.2;
        } else {
            if(mesh.material.color.r > material.redChannel)
                mesh.material.color.r -= 0.2;
        }

        return false;
	}

	return {
		update,
		checkCollision
	}
}