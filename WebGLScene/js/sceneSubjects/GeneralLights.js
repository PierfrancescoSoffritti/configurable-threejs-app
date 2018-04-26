import * as THREE from '../../node_modules/three/build/three.module.js'

export default scene => {
	const spotLight = new THREE.SpotLight( '#fff', 0.5 )
	spotLight.castShadow = true
	spotLight.shadow.mapSize.width = 1024
	spotLight.shadow.mapSize.height = 1024

	spotLight.position.set(-10, 40, 0)

	scene.add( spotLight )
	
	const ambientLight = new THREE.AmbientLight( 0x404040 )
	scene.add( ambientLight )
	
	function update(time) {
	}

	return {
		update
	}
}