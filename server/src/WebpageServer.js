const app = require('express')();
const express = require('express');
const http = require('http').Server(app);
const socketIO = require('socket.io')(http);

const sockets = {};
let socketCount = -1;

function WebpageServer(callbacks) {
    startServer(callbacks);

    this.moveForward = duration => Object.keys(sockets).forEach( key => sockets[key].emit('moveForward', duration) );
    this.moveBackwards = duration => Object.keys(sockets).forEach( key => sockets[key].emit('moveBackwards', duration) );
    this.turnRight = duration => Object.keys(sockets).forEach( key => sockets[key].emit('turnRight', duration) );
    this.turnLeft = duration => Object.keys(sockets).forEach( key => sockets[key].emit('turnLeft', duration) );
    this.alarm = () => Object.keys(sockets).forEach( key => sockets[key].emit('alarm') );
    this.stop = () => Object.keys(sockets).forEach( key => sockets[key].emit('stop') );
}

function startServer(callbacks) {
    startHttpServer();
    initSocketIOServer(callbacks);
}

function startHttpServer() {
    app.use(express.static('./../../WebGLScene'));
    app.get('/', (req, res) => res.sendFile('index.html', { root: './../../WebGLScene' }) ); 

    http.listen(8080);
}

function initSocketIOServer(callbacks) {
    socketIO.on('connection', socket => {
        console.log("webpage in")
        socketCount++;
        const key = socketCount;
        sockets[key] = socket;
        
        callbacks.onWebpageReady();

        socket.on( 'sonarActivated', callbacks.onSonarActivated );
        socket.on( 'collision', callbacks.onCollision );

        socket.on('disconnect', () => delete sockets[key] );
    });
}

function finish() {
    Object.keys(sockets).forEach( key => sockets[key].disconnect() )
    http.close();
}

module.exports = WebpageServer;