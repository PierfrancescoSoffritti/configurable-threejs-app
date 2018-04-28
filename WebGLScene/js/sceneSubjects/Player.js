import * as THREE from '../../node_modules/three/build/three.module.js'

export default (scene, playerConfiguration) => {
    const playerPosition = { x: playerConfiguration.position.x, y: 2, z: playerConfiguration.position.y }

    const group = new THREE.Group()    
    group.position.set(playerPosition.x, playerPosition.y, playerPosition.z)
    scene.add(group)

    loadPlayerMeshAsync()

    function loadPlayerMeshAsync() {
        const loader = new THREE.JSONLoader()
        loader.load('models/spaceship.json', function(playerGeometry, playerMaterials) {            
            for(let i=0; i<playerMaterials.length; i++) {
                playerMaterials[i].flatShading = true
                playerMaterials[i].shininess = 0 
                playerMaterials[i].metalness = 0 
                playerMaterials[i].roughness = 0.4
            }

            const playerMesh = new THREE.Mesh(playerGeometry, playerMaterials)
            playerMesh.rotation.y = -Math.PI/2
            playerMesh.castShadow = true

            group.add(playerMesh)
        })
    }

    function update(time) {
        const scale = (Math.sin(time)+4)/5
        const positionY = Math.sin(time)/4

        group.position.y = playerPosition.y + positionY
    }

    return {
        mesh: group,
        update
    }
}