export function parseConfiguration(config) {
    const clone = JSON.parse(JSON.stringify(config));

    const { floor, robot, sonars, movingObstacles, staticObstacles } = clone;

    robot.position.x = ( robot.position.x - 0.5 ) * floor.size.x;
    robot.position.y = ( robot.position.y - 0.5 ) * floor.size.y;

    sonars.forEach( sonar => {
        sonar.position.x = ( sonar.position.x - 0.5 ) * floor.size.x;
        sonar.position.y = ( sonar.position.y - 0.5 ) * floor.size.y;
    });

    movingObstacles.forEach( obstacle => {
        obstacle.position.x = ( obstacle.position.x - 0.5 ) * floor.size.x;
        obstacle.position.y = ( obstacle.position.y - 0.5 ) * floor.size.y;
    });

    staticObstacles.forEach( obstacle => {
        obstacle.centerPosition.x = ( obstacle.centerPosition.x - 0.5 ) * floor.size.x;
        obstacle.centerPosition.y = ( obstacle.centerPosition.y - 0.5 ) * floor.size.y;
                
        obstacle.size.x *= floor.size.x;
        obstacle.size.y *= floor.size.y;
    });

    return clone;
}

export function mapConfigurationToGUI(sceneConstants, sceneConfiguration, controls, datGui, object, folder) {
    for(let key in object) {  

        if(typeof object[key] === 'object') {

            let newFolder;
            if(folder)
                newFolder = folder.addFolder(key);
            else
                newFolder = datGui.addFolder(key);

            mapConfigurationToGUI(sceneConstants, sceneConfiguration, controls, datGui, object[key], newFolder);

        } else {
            let controller;

            const scale = ( ( key === 'x' || key === 'y' ) && folder.parent.name !== 'floor' ) ? 1 : 100;

            if(folder)
                controller = folder.add( object, key, 0, 1 *scale );
            else
                controller = datGui.add( object, key, 0, 1 *scale );

            controller.onChange( value => { 
                updateSceneConstants(sceneConstants, parseConfiguration(sceneConfiguration));
                controls.resetPosition(); 
            } );
        }
    }
}

function updateSceneConstants(sceneConstants, newSceneConstants) {
    const { floor, robot, sonars, movingObstacles, staticObstacles } = newSceneConstants;

    sceneConstants.floor.size.x = floor.size.x;
    sceneConstants.floor.size.y = floor.size.y;

    sceneConstants.robot.position.x = robot.position.x;
    sceneConstants.robot.position.y = robot.position.y;
    sceneConstants.robot.speed = robot.speed;

    for(let i=0; i<sceneConstants.sonars.length; i++) {
        sceneConstants.sonars[i].position.x = sonars[i].position.x;
        sceneConstants.sonars[i].position.y = sonars[i].position.y;

        sceneConstants.sonars[i].senseAxis.x = sonars[i].senseAxis.x;
        sceneConstants.sonars[i].senseAxis.y = sonars[i].senseAxis.y;
    }

    for(let i=0; i<sceneConstants.movingObstacles.length; i++) {
        sceneConstants.movingObstacles[i].position.x = movingObstacles[i].position.x;
        sceneConstants.movingObstacles[i].position.y = movingObstacles[i].position.y;

        sceneConstants.movingObstacles[i].directionAxis.x = movingObstacles[i].directionAxis.x;
        sceneConstants.movingObstacles[i].directionAxis.y = movingObstacles[i].directionAxis.y;
        sceneConstants.movingObstacles[i].speed = movingObstacles[i].speed;
        sceneConstants.movingObstacles[i].range = movingObstacles[i].range;
    }

    for(let i=0; i<sceneConstants.staticObstacles.length; i++) {
        sceneConstants.staticObstacles[i].centerPosition.x = staticObstacles[i].centerPosition.x;
        sceneConstants.staticObstacles[i].centerPosition.y = staticObstacles[i].centerPosition.y;

        sceneConstants.staticObstacles[i].size.x = staticObstacles[i].size.x;
        sceneConstants.staticObstacles[i].size.y = staticObstacles[i].size.y;
    }
}