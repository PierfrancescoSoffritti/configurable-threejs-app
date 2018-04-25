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
            centerPosition: { x: 1, y: 1},
            size: { x: 1, y: 1}
        }
    ]
}

export default parseConfig(config)

function parseConfig(config) {
    const { ground, robot, sensors, movingObstacles, staticObstacles } = config;

    // robot.position.x *= ground.size.x;
    // robot.position.y *= ground.size.y;

    robot.position.x -= 0.5;
    robot.position.x *= ground.size.x;

    robot.position.y -= 0.5;
    robot.position.y *= ground.size.y;

    sensors.forEach( sensor => {
        sensor.position.x *= ground.size.x;
        sensor.position.y *= ground.size.y;
    });

    movingObstacles.forEach( obstacle => {
        obstacle.position.x *= ground.size.x;
        obstacle.position.y *= ground.size.y;
    });

    staticObstacles.forEach( obstacle => {
        obstacle.centerPosition.x *= ground.size.x;
        obstacle.centerPosition.y *= ground.size.y;
        
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