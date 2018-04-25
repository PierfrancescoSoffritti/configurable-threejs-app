const config = {
    floor: {
        size: { x: 40, y: 40 }
    },
    robot: {
        position: { x: 0.5, y: 0.8 },
        speed: 0.2
    },
    sonars: [
        {
            name: "sonar-1",
            position: { x: 0.8, y: 0.8 },
            senseAxis: { x: true, y: false }
        }, 
        {
            name: "sonar-2",
            position: { x: 0.2, y: 0.2 },
            senseAxis: { x: false, y: true }
        }
    ],
    movingObstacles: [
        {
            name: "moving-obstacle-1",
            position: { x: .5, y: .5 },
            directionAxis: { x: true, y: false },
            speed: 1,
            range: 4
        },
        {
            name: "moving-obstacle-2",
            position: { x: 0, y: 0 },
            directionAxis: { x: false, y: true },
            speed: 2,
            range: 4
        }
    ],
    staticObstacles: [
        {
            name: "static-obstacle-1",
            centerPosition: { x: 0.2, y: 0.5},
            size: { x: 0.5, y: 0.01}
        },
        {
            name: "static-obstacle-2",
            centerPosition: { x: 0.1, y: 0.1},
            size: { x: 0.01, y: 0.5}
        }
    ]
}

export default config;