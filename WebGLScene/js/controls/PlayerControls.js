import * as THREE from '../../node_modules/three/build/three.module.js';

export default (mesh, camera, collisionManager) => {
	
	const W = 87
    const A = 65
    const S = 83
    const D = 68
    const R = 82
    const F = 70
	
    let forward = false
    let rotating = false

    const speed = 0.2

    setCameraPositionRelativeToMesh(camera, mesh);

    function setCameraPositionRelativeToMesh(camera, mesh) {
        camera.position.x = mesh.position.x;
        camera.position.z = mesh.position.z + 20;

        camera.lookAt(mesh.position);
    }
	
	function onKeyDown(keyCode, duration) {
        if(keyCode === W)
            forward = true
        
        else if(keyCode === R)
            rotate(-Math.PI/2, duration)
        else if(keyCode === F)
            rotate(Math.PI/2, duration);
    }

    function onKeyUp(keyCode) {
        if(keyCode === W)
            forward = false
    }

    function rotate(angle, duration = 300) {
        duration -= 50;
        if(rotating)
            return;

        const finalAngle = mesh.rotation.y + angle;

        rotating = true;
        new TWEEN.Tween(mesh.rotation)
            .to({ y: finalAngle }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete( () => rotating = false)
            .start()
    }    

    function update(time) {
        const matrix = new THREE.Matrix4();
        matrix.extractRotation( mesh.matrix );

        const directionVector = new THREE.Vector3( 0, 0, 1 );
        directionVector.applyMatrix4(matrix);
    
		if(forward) {         
            const stepVector = directionVector.multiplyScalar(speed);
            const tPosition = mesh.position.clone().add(stepVector);
            const collision = collisionManager.checkCollision(tPosition);
            if(!collision) {
                mesh.position.add(stepVector)
                camera.position.add(stepVector)
             }            
        }
	}
	
	return {
		onKeyDown,
		onKeyUp,
		update
	}
}