const config = {
    ground: {
        size: { x: 40, y: 40 }
    },
    robot: {
        position: { x: 1, y: 0.1 }
    },
    sensors: [
        {
            name: "sensor-1",
            position: { x: 1, y: 1},
            senseAxis: { x: 1, y: 0 }
        }
    ],
    movingObstacles: [
        {
            name: "moving-obstacle-1",
            position: { x: 1, y: 1},
            directionAxis: { x: 1, y: 0}
        }
    ],
    staticObstacles: [
        {
            name: "static-obstacle-1",
            centerPosition: { x: 0.2, y: 0.5},
            size: { x: 0.5, y: 0.01}
        }
    ]
}

export default parseConfig(config)

function parseConfig(config) {
    const { ground, robot, sensors, movingObstacles, staticObstacles } = config;

    robot.position.x = ( robot.position.x - 0.5 ) * ground.size.x
    robot.position.y = ( robot.position.y - 0.5 ) * ground.size.y;

    sensors.forEach( sensor => {
        sensor.position.x = ( sensor.position.x - 0.5 ) * ground.size.x
        sensor.position.y = ( sensor.position.y - 0.5 ) * ground.size.y;
    });

    movingObstacles.forEach( obstacle => {
        obstacle.position.x = ( obstacle.position.x - 0.5 ) * ground.size.x
        obstacle.position.y = ( obstacle.position.y - 0.5 ) * ground.size.y;
    });

    staticObstacles.forEach( obstacle => {
        obstacle.centerPosition.x = ( obstacle.centerPosition.x - 0.5 ) * ground.size.x
        obstacle.centerPosition.y = ( obstacle.centerPosition.y - 0.5 ) * ground.size.y;
                
        obstacle.size.x *= ground.size.x;
        obstacle.size.y *= ground.size.y;
    });

    return {
        ground,
        robot,
        sensors,
        movingObstacles,
        staticObstacles
    }
}