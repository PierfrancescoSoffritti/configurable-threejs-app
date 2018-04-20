const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const id = "applicationSpecificLogic";
const sockets = {};
let count = 0;

function WebpageServer() {
    app.use(express.static('./../../WebGLScene'))
    startServer();

    this.start = function() {
        Object.keys(sockets).forEach( key => sockets[key].emit("startRobot") )
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

function startServer() {
    app.get('/', (req, res) => res.sendFile('index.html', { root: "./../../WebGLScene" }) );    

    io.on('connection', socket => {
        const key = count;
        sockets[key] = socket;
        count++;
        
        // eventBus.post("webpage-connected");

        // socket.on( 'sonarActivated', msg => eventBus.post("sonarActivated", msg ) );
        // socket.on( 'collision', () => eventBus.post("collision") );
    });
      
    http.listen(8080, () => console.log('listening on localhost:8080') );
}

function onFinish() {
    Object.keys(sockets).forEach( key => sockets[key].disconnect() )
    http.close();
}

module.exports = WebpageServer;