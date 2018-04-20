import * as THREE from '../../node_modules/three/build/three.module.js';

export default scene => {
	
	/*
	const pointLight = new THREE.PointLight("#fff", .8);
	pointLight.castShadow = true;
	pointLight.shadowDarkness = 0.5;
	pointLight.position.y = 20;
	scene.add(pointLight);
	*/

	// White directional light at half intensity shining from the top.
	const spotLight = new THREE.SpotLight( 0xffffff, 0.5 );
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.position.y = 40;
	spotLight.position.x = -10;
	scene.add( spotLight );
	
	const ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );
	
	function update(time) {
	}

	return {
		update
	}
}