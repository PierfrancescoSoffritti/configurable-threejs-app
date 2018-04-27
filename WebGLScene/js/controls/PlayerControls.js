import * as THREE from '../../node_modules/three/build/three.module.js'

export default (mesh, camera, config, collisionManager) => {
	
	const keycodes = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        R: 82,
        F: 70
    }
	
    let forward = false
    let backward = false
    let rotating = false

    setCameraPositionRelativeToMesh(camera, mesh)
	
	function onKeyDown(keyCode, duration) {
        if(keyCode === keycodes.W)
            forward = true
        else if(keyCode === keycodes.S)
            backward = true
        
        else if(keyCode === keycodes.R)
            rotate(-Math.PI/2, duration)
        else if(keyCode === keycodes.F)
            rotate(Math.PI/2, duration)
    }

    function onKeyUp(keyCode) {
        if(keyCode === keycodes.W)
            forward = false
        else if(keyCode === keycodes.S)
            backward = false;
    }

    function rotate(angle, duration = 300) {
        duration -= 50
        if(rotating)
            return

        const finalAngle = mesh.rotation.y + angle

        rotating = true
        new TWEEN.Tween(mesh.rotation)
            .to({ y: finalAngle }, duration)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete( () => rotating = false)
            .start()
    }    

    function update(time) {
        const matrix = new THREE.Matrix4()
        matrix.extractRotation( mesh.matrix )

        const directionVector = new THREE.Vector3( 0, 0, 1 )
        directionVector.applyMatrix4(matrix)
    
		if(forward || backward) {
            const direction = backward ? 1 : -1
            const stepVector = directionVector.multiplyScalar( config.speed * direction )
            const tPosition = mesh.position.clone().add(stepVector)
            
            const collision = collisionManager.checkCollision(tPosition)

            if(!collision) {
                mesh.position.add(stepVector)
                camera.position.add(stepVector)
             }            
        } else 
            collisionManager.checkCollision(mesh.position)
    }
    
    function resetPosition() {
        mesh.position.x = config.position.x
        mesh.position.z = config.position.y

        setCameraPositionRelativeToMesh(camera, mesh)
    }

    function setCameraPositionRelativeToMesh(camera, mesh) {
        camera.position.x = mesh.position.x
        camera.position.z = mesh.position.z + 20

        camera.lookAt(new THREE.Vector3(mesh.position.x, 0, mesh.position.z))
    }
	
	return {
        resetPosition,
		onKeyDown,
		onKeyUp,
		update
	}
}