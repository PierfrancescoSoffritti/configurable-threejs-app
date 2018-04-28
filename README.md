# ConfigurableThreejsApp

This project is a 3D web-based application built with Three.js. The webpage is served by an internal server.

## How to start

### Install

To use this project you need to download all the required node modules from npm, to do that run this commands from the root folder of the project

```
cd server
npm install
```

```
cd WebGLScene
npm install
```

Or, if you are on Windows, just double click the `install.bat` file.

### Launch the server

To start the server run this command, from the root folder of the project

```
cd server
cd src
node main portNumber
```

Or, if you are on Windows, just double click the `startServer.bat` file, the server will automatically start on port 8999.

The webpage will be available at `http://localhost:8080/`

## The scene

![scene description](https://raw.githubusercontent.com/PierfrancescoSoffritti/ConfigurableThreejsApp/master/pictures/scene_description.jpg)

As mentioned before the scene is built with Three.js (WebGL) and runs into your browser.

### Scene components

* **Player object**: an object controlled by the user that can move in the scene. It can be controlled via keyboard (**w**: move forward, **s**: move backward, **r**: turn right, **f**: turn left) or with a remote client (more on that later).

* **Platform (or floor)**: area on which the player can move and objects can be placed.

* **Static obstacle**: non-moving obstacle the player can't go through.

* **Moving obstacle**: obstacle moving with a periodic movement that the player can't travers.

* **Sonar**: simple sensor that can detect when the player is on its trajectory.

### Scene configuration

In order to adapt the scene for different use cases, users don't need any knowledge of Javascript or Three.js, instead they can edit a simple configuration file that is used to set up the scene.

The configuration file can be found here `.\WebGLScene\sceneConfig.js`. It is a node module, but that's not important, it contains a Javascript object saved into a variable. This Javascript object contains all the information needed to create the scene.

In particulare: it contains one object for every scene componenet.

#### Floor
The floor object has only one property: a size object.

- The size defines the dimension of the floor on the x and y axes.

```
floor: {
    size: { x: 40, y: 40 }
}
```

This floor is a square of size 40 in the x axes and 40 in the y axes.

#### Player
The player object has two properties: position and speed.

- The position can only be expressed with values between 0 and 1 and is relative to the floor. (0,0) is the top left corner of the floor, (1, 1) is the bottom right corner.
- The speed determines how fast the player object moves on the floor, it's not bounded (I suggest keeping it between 0 and 1 though).

```
player: {
    position: { x: 0.5, y: 0.8 },
    speed: 0.2
}
```

#### Sonar
Sonars is an array, each element in the array is a sonar.
Each sonar has three properties: name, position and senseAxis.

- The name is a string.
- The position can only be expressed with values between 0 and 1 and is relative to the floor. (0,0) is the top left corner of the floor, (1, 1) is the bottom right corner.
- senseAxis determines in which direction this sonar will sense the player. It can be only x, y, or both.

```
sonars: [
    {
        name: "sonar-1",
        position: { x: 0.8, y: 0.8 },
        senseAxis: { x: true, y: false }
    }
]
```

#### Moving obstacle
MovingObstacles is an array, each element in the array is a moving obstacle.
Each moving obstacle has five properties: name, position, directionAxis, speed and range.

- The name is a string.
- The position can only be expressed with values between 0 and 1 and is relative to the floor. (0,0) is the top left corner of the floor, (1, 1) is the bottom right corner.
- directionAxis determines the direction of the periodic movement of the obstacle. It can be only x, y, or both.
- speed determines how fast the obstacle moves.
- range determines the range of the periodic movement.

```
movingObstacles: [
    {
        name: "moving-obstacle-1",
        position: { x: .5, y: .4 },
        directionAxis: { x: true, y: false },
        speed: 1,
        range: 4
    }
]
```

#### Static obstacle
StaticObstacles is an array, each element in the array is a static obstacle.
Each static obstacle has three properties: name, centerPosition and size.

- The name is a string.
- The centerPosition can only be expressed with values between 0 and 1 and is relative to the floor. (0,0) is the top left corner of the floor, (1, 1) is the bottom right corner.
- The size can only be expressed with values between 0 and 1 and is relative to the floor. x = 1 means that the static obstacle will have the same x dimension of the floor. If the object has x = 0.4, it's center will be at x = 0.2, relative to the object.

```
staticObstacles: [
    {
        name: "static-obstacle-1",
        centerPosition: { x: 0.2, y: 0.5},
        size: { x: 0.4, y: 0.01}
    }
]
```

#### Complete configuration object

```
const config = {
    floor: {
        size: { x: 40, y: 40 }
    },
    player: {
        position: { x: 0.5, y: 0.8 },
        speed: 0.2
    },
    sonars: [
        {
            name: "sonar-1",
            position: { x: 0.8, y: 0.8 },
            senseAxis: { x: true, y: false }
        }
    ],
    movingObstacles: [
        {
            name: "moving-obstacle-1",
            position: { x: .5, y: .4 },
            directionAxis: { x: true, y: false },
            speed: 1,
            range: 4
        }
    ],
    staticObstacles: [
        {
            name: "static-obstacle-1",
            centerPosition: { x: 0.2, y: 0.5},
            size: { x: 0.4, y: 0.01}
        }
    ]
}
```

## Receive input from outside
### IO interface