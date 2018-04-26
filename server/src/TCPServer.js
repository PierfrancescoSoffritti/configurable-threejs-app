const net = require('net');

const SEPARATOR = "$$SEP$$";
const connectedClients = {};

function TCPServer() {
    this.start = function(port) {    
        const server = net.createServer( socket => {
            const clientId = `${socket.remoteAddress}:${socket.remotePort}`;

            console.log(`\n[${ clientId }] connected`);

            connectedClients[clientId] = socket;

            socket.on('data', message => {            
                String(message)
                    .split(SEPARATOR)
                    .filter(string => string.trim().length !== 0)
                    .map(message => JSON.parse(message))
                    .forEach( message => console.log(message) )
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