# ConfigurableThreejsApp

This project is a 3D web-based application built with Three.js. The webpage is served by an internal server.

## How to start

If you have cloned this repo you need to install all the required node modules, to do that execute this commands from the root folder of the project

```
cd server
npm install

cd WebGLScene
npm install

```

Execute this command to start the server, from the root folder of the project

```
cd server
cd src
node main portNumber
```

The web app will be available at `http://localhost:8080/`

## The scene

### Scene components

#### Player object
an object that can the user can control and move in the scene. It can be controlled via keyboard (w: move forward, s: move backward, r: turn righ, f: turn left) or by sending messages to the server (more on that later)

#### Platform (or floor)
Area on which the player can move

#### Static obstacles
non-moving obstacles the player can't go through

#### Moving obstacles
obstacles moving with a periodic movement that the player can't travers

####
Sonars, simple sensors that can detect when the player is on their trajectory

### Scene configuration

In order to adapt the scene for different use cases, users don't need any knowledge of Javascript or Three.js, instead they can edit a simple configuration file that is used to set up the scene.
