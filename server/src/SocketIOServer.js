const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const sockets = {}
let socketCount = -1

function SocketIOServer(port, onMessage) {
    start(port)

    this.send = function(object) {
        for(key in sockets)
            sockets[key].emit(object.name, object.arg)
    }
    
    function start(port) {
        io.on('connection', socket => {
            socketCount++
            const socketId = socketCount
            sockets[socketId] = socket

            console.log(`\n[${ socketId }] connected`)

            socket.on( 'alarm', msg => onMessage( { name: 'alarm' } ) )

            socket.on( 'moveForward', msg => onMessage( { name: 'moveForward', arg: msg } ) );
            socket.on( 'moveBackward', msg => onMessage( { name: 'moveBackward', arg: msg } ) );
            socket.on( 'turnRight', msg => onMessage( { name: 'turnRight', arg: msg } ) );
            socket.on( 'turnLeft', msg => onMessage( { name: 'turnLeft', arg: msg } ) );
            
            socket.on( 'disconnect', () => delete sockets[socketId] );
        });
        
        http.listen(port);
        console.log(`SocketIO server listening on port ${port}`)
    }
}

module.exports = SocketIOServer;