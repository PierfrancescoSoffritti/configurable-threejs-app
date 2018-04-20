const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const id = "applicationSpecificLogic";
const sockets = {};
let count = 0;

function WebpageServer(callbacks) {
    app.use(express.static('./../../WebGLScene'))
    startServer(callbacks);

    this.spawn = function() {
        Object.keys(sockets).forEach( key => sockets[key].emit("spawnRobot") )
    }

    this.moveForward = function(duration) {
        Object.keys(sockets).forEach( key => sockets[key].emit("moveForward", duration) )
    }

    this.moveBackwards = function(duration) {
        Object.keys(sockets).forEach( key => sockets[key].emit("moveBackwards", duration) )
    }

    this.turnRight = function(duration) {
        Object.keys(sockets).forEach( key => sockets[key].emit("turnRight", duration) )
    }

    this.turnLeft = function(duration) {
        Object.keys(sockets).forEach( key => sockets[key].emit("turnLeft", duration) )
    }

    this.alarm = function() {
        Object.keys(sockets).forEach( key => sockets[key].emit("alarm") )
    }

    this.stop = function() {
        Object.keys(sockets).forEach( key => sockets[key].emit("stop") )
    }
}

function startServer(callbacks) {
    app.get('/', (req, res) => res.sendFile('index.html', { root: "./../../WebGLScene" }) );    

    io.on('connection', socket => {
        const key = count;
        sockets[key] = socket;
        count++;
        
        callbacks.onWebpageReady();

        socket.on( 'sonarActivated', msg => callbacks.onSonarActivated(msg) );
        socket.on( 'collision', () => callbacks.onCollision() );
    });
      
    http.listen(8080, () => console.log('listening on localhost:8080') );
}

function finish() {
    Object.keys(sockets).forEach( key => sockets[key].disconnect() )
    http.close();
}

module.exports = WebpageServer;