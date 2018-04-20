import * as THREE from '../../node_modules/three/build/three.module.js';
import eventBus from '../EventBus.js';

export default (scene, targetPosition, floorSize) => {

    const sensorSize = 2;

	const geometry = new THREE.BoxBufferGeometry( sensorSize, sensorSize, sensorSize);
	const material = new THREE.MeshStandardMaterial( {color: "#45B045", roughness: 0.5, metalness: 0.1} );
    const sonarBlueprint = new THREE.Mesh( geometry, material );
    sonarBlueprint.position.z = floorSize/3;
    sonarBlueprint.position.y = 1;
    sonarBlueprint.castShadow = true;

    const baseRed = material.color.r;
	
    const sonarStart = sonarBlueprint.clone();
    sonarStart.name = "sonarStart"
    sonarStart.material = new THREE.MeshStandardMaterial( {color: "#45B045", roughness: 0.5, metalness: 0.1} );
    sonarStart.position.x = floorSize/3;
    scene.add( sonarStart );

    const sonarEnd = sonarBlueprint.clone();
    sonarEnd.name = "sonarEnd"
    sonarEnd.position.x = -floorSize/3;
    sonarEnd.material = new THREE.MeshStandardMaterial( {color: "#45B045", roughness: 0.5, metalness: 0.1} );
    scene.add( sonarEnd );

    targetPosition.x = sonarStart.position.x;
    const sonars = [ sonarStart, sonarEnd ];
	
	function update(time) {
        for(let i=0; i<sonars.length; i++) {
            const sonar = sonars[i];
            
            if(targetPosition.x >= sonar.position.x-1 && targetPosition.x <= sonar.position.x+1) {
                const distance = Math.trunc( sonar.position.z - targetPosition.z );
                eventBus.post("sonarActivated", { sonarName: sonar.name, distance })
                if(sonar.material.color.r < 3)
                    sonar.material.color.r += 0.2;
            } else {
                if(sonar.material.color.r > baseRed)
                    sonar.material.color.r -= 0.2;
            }
        }
        
	}

	function checkCollision(position) {
        // for(let i=0; i<sonars.length; i++) {
        //     const sensor = sonars[i];

        //     if( ( position.x >= sensor.position.x-sensorSize*1.5 && position.x <= sensor.position.x+sensorSize*1.5 ) 
        //         && ( position.z >= sensor.position.z-sensorSize*1.5 && position.z <= sensor.position.z+sensorSize*1.5 ) )
        //         return true;
        // }
	
		return false;
	}

	return {
		update,
		checkCollision
	}
}