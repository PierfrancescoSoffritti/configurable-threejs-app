export function parseConfiguration(config) {
    const clone = JSON.parse(JSON.stringify(config))

    const { floor, player, sonars, movingObstacles, staticObstacles } = clone

    checkConfigValidity(clone)

    player.position.x = ( player.position.x - 0.5 ) * floor.size.x
    player.position.y = ( player.position.y - 0.5 ) * floor.size.y

    sonars.forEach( sonar => {
        sonar.position.x = ( sonar.position.x - 0.5 ) * floor.size.x
        sonar.position.y = ( sonar.position.y - 0.5 ) * floor.size.y
    })

    movingObstacles.forEach( obstacle => {
        obstacle.position.x = ( obstacle.position.x - 0.5 ) * floor.size.x
        obstacle.position.y = ( obstacle.position.y - 0.5 ) * floor.size.y
    })

    staticObstacles.forEach( obstacle => {
        obstacle.centerPosition.x = ( obstacle.centerPosition.x - 0.5 ) * floor.size.x
        obstacle.centerPosition.y = ( obstacle.centerPosition.y - 0.5 ) * floor.size.y
                
        obstacle.size.x *= floor.size.x
        obstacle.size.y *= floor.size.y
    })

    return clone
}

export function mapConfigurationToGUI(sceneConstants, sceneConfiguration, controls, datGui, object, folder) {
    for(let key in object) {
        if(typeof object[key] === 'object') {
            const newFolder = folder ? folder.addFolder(key) : datGui.addFolder(key)

            mapConfigurationToGUI(sceneConstants, sceneConfiguration, controls, datGui, object[key], newFolder)
        } else {
            const scale = ( ( key === 'x' || key === 'y' ) && folder.parent.name !== 'floor' ) ? 1 : 100
            const controller = folder ? folder.add( object, key, 0, 1 *scale ) : datGui.add( object, key, 0, 1 *scale )

            controller.onChange( value => { 
                updateSceneConstants(sceneConstants, parseConfiguration(sceneConfiguration))
                controls.resetPosition()
            })
        }
    }
}

function checkConfigValidity(config) {
    checkJsonStructure(config)
    const { floor, player, sonars, movingObstacles, staticObstacles } = config
    
    checkPositionIsInRange(player)

    sonars.forEach( checkPositionIsInRange )
    movingObstacles.forEach( checkPositionIsInRange )
    staticObstacles.forEach( checkStaticObstacle )

    function checkJsonStructure(config) {
        const { floor, player, sonars, movingObstacles, staticObstacles } = config
        if(!floor)
            throw new Error('Config file malformed: floor not defined')
        if(!player)
            throw new Error('Config file malformed: player not defined')
        if(!sonars)
            throw new Error('Config file malformed: sonars not defined')
        if(!movingObstacles)
            throw new Error('Config file malformed: movingObstacles not defined')
        if(!staticObstacles)
            throw new Error('Config file malformed: staticObstacles not defined')
    }

    function checkPositionIsInRange(obj) {
        if(obj.position.x < 0 || obj.position.x > 1)
            throw new Error('Config file malformed: position.x < 0 || position.x > 1')
        if(obj.position.y < 0 || obj.position.y > 1)
            throw new Error('Config file malformed: position.y < 0 || position.y > 1')
    }

    function checkStaticObstacle(staticObstacle) {
        if(staticObstacle.centerPosition.x < 0 || staticObstacle.centerPosition.x > 1)
            throw new Error('Config file malformed: staticObstacle.centerPosition.x < 0 || staticObstacle.centerPosition.x > 1')
        if(staticObstacle.centerPosition.y < 0 || staticObstacle.centerPosition.y > 1)
            throw new Error('Config file malformed: staticObstacle.centerPosition.y < 0 || staticObstacle.centerPosition.y > 1')

        if(staticObstacle.size.x < 0 || staticObstacle.size.x > 1)
            throw new Error('Config file malformed: staticObstacle.size.x < 0 || staticObstacle.size.x > 1')
        if(staticObstacle.size.y < 0 || staticObstacle.size.y > 1)
            throw new Error('Config file malformed: staticObstacle.size.y < 0 || staticObstacle.size.y > 1')
    }
}

function updateSceneConstants(sceneConstants, newSceneConstants) {
    const { floor, player, sonars, movingObstacles, staticObstacles } = newSceneConstants

    sceneConstants.floor.size.x = floor.size.x
    sceneConstants.floor.size.y = floor.size.y

    sceneConstants.player.position.x = player.position.x
    sceneConstants.player.position.y = player.position.y
    sceneConstants.player.speed = player.speed

    for(let i=0; i<sceneConstants.sonars.length; i++) {
        sceneConstants.sonars[i].position.x = sonars[i].position.x
        sceneConstants.sonars[i].position.y = sonars[i].position.y

        sceneConstants.sonars[i].senseAxis.x = sonars[i].senseAxis.x
        sceneConstants.sonars[i].senseAxis.y = sonars[i].senseAxis.y
    }

    for(let i=0; i<sceneConstants.movingObstacles.length; i++) {
        sceneConstants.movingObstacles[i].position.x = movingObstacles[i].position.x
        sceneConstants.movingObstacles[i].position.y = movingObstacles[i].position.y

        sceneConstants.movingObstacles[i].directionAxis.x = movingObstacles[i].directionAxis.x
        sceneConstants.movingObstacles[i].directionAxis.y = movingObstacles[i].directionAxis.y
        sceneConstants.movingObstacles[i].speed = movingObstacles[i].speed
        sceneConstants.movingObstacles[i].range = movingObstacles[i].range
    }

    for(let i=0; i<sceneConstants.staticObstacles.length; i++) {
        sceneConstants.staticObstacles[i].centerPosition.x = staticObstacles[i].centerPosition.x
        sceneConstants.staticObstacles[i].centerPosition.y = staticObstacles[i].centerPosition.y

        sceneConstants.staticObstacles[i].size.x = staticObstacles[i].size.x
        sceneConstants.staticObstacles[i].size.y = staticObstacles[i].size.y
    }
}