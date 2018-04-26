const net = require('net');

const SEPARATOR = "__endofmessage__";
const connectedClients = {};

function TCPServer(port, onMessage) {
    
    start(port);

    this.send = function(object) {
        for(key in connectedClients)
            connectedClients[key].write( JSON.stringify(object) +SEPARATOR);
    }

    function start(port) {    
        const server = net.createServer( socket => {
            const clientId = `${socket.remoteAddress}`;

            console.log(`\n[${ clientId }] connected`);

            connectedClients[clientId] = socket;

            socket.on('data', message => {      
                String(message)
                    .split(SEPARATOR)
                    .filter( string => string.trim().length !== 0 )
                    .map( message => JSON.parse(message) )
                    .forEach( message => onMessage(message) )
            });

            socket.on('end', () => {
                console.log(`[${ clientId }] connection terminated`);
                delete connectedClients[clientId];
            });

            socket.on('error', () => {
                console.log(`[${ clientId }] connection error`);
                delete connectedClients[clientId];
            });

        })

        server.listen(port);
        
        console.log(`TCP server listening on port ${port}`);
    }
}

module.exports = TCPServer;