import * as THREE from '../../node_modules/three/build/three.module.js';

export default (scene, ground) => {
	
	const floorSize = ground.size;

	const geometry = new THREE.BoxBufferGeometry( floorSize.x, 1, floorSize.y);
	const material = new THREE.MeshStandardMaterial( {color: "#91B82D", roughness: 0.5, metalness: 0.1} );
	const cube = new THREE.Mesh( geometry, material );

	cube.receiveShadow = true;
	
	scene.add( cube );
	
	function update(time) {
		//const scale = Math.sin(time)+2;
		//mesh.scale.set(scale, scale, scale);
	}

	function checkCollision(position) {
		if(Math.abs(position.x) >= floorSize.x/2 || Math.abs(position.z) >= floorSize.y/2 )
			return true;
		else
			return false;
	}

	return {
		update, 
		checkCollision
	}
}