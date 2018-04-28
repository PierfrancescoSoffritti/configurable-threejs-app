const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const sockets = {}
let socketCount = -1

function TCPServer(port, onMessage) {
    start(port)

    this.send = function(object) {
        for(key in sockets)
            sockets[key].emit(object.name, object.arg)
    }
    
    function start(port) {
        io.on('connection', socket => {
            // socketCount++
            // const key = socketCount
            // sockets[key] = socket
            
            const clientId = `${socket.remoteAddress}`
            console.log(clientId)
            connectedClients[clientId] = socket

            console.log(`\n[${ clientId }] connected`)

            socket.on( 'alarm', msg => onMessage( { name: 'alarm' } ) )

            socket.on( 'moveForward', msg => onMessage( { name: 'moveForward', arg: msg } ) );
            socket.on( 'moveBackward', msg => onMessage( { name: 'moveBackward', arg: msg } ) );
            socket.on( 'turnRight', msg => onMessage( { name: 'turnRight', arg: msg } ) );
            socket.on( 'turnLeft', msg => onMessage( { name: 'turnLeft', arg: msg } ) );

            //socket.on( 'disconnect', () => delete sockets[key] );
            socket.on( 'disconnect', () => delete sockets[clientId] );
        });
        
        http.listen(port);
    }
}

module.exports = Controller;