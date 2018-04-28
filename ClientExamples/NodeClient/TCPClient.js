const net = require('net');

const SEPARATOR = "__message__";

new Communicator({port: readPortNumberFromArguments(), ip: "localhost"})

function Communicator({ port, ip }) {
    const self = this;

    let clientSocket;
    const outQueue = [];

    connectTo(port, ip);
    
    function connectTo(port, ip) {
        const client = new net.Socket();
        clientSocket = client;

        client.connect({ port, ip }, () => console.log(`\tConnecting...`) );

        client.on('connect', () => {
            console.log(`\tConnected`);
            flushOutQueue();
        });

        client.on('data', message => {
            String(message)
                    .split(SEPARATOR)
                    .map( string => string.trim() )
                    .filter( string => string.length !== 0  )
                    .filter( string => string[0] === "{" )
                    .map( JSON.parse )
                    .forEach( console.log );
        });
        
        client.on('close', () =>  console.log(`\tConnection closed`) );

        client.on('error', () => console.log(`\tConnection error`) );
    }

    this.send = function(message) {
        if(!clientSocket.connecting)
            clientSocket.write(SEPARATOR +message +SEPARATOR);
        else {
            console.log(`\tSocket not created, message added to queue`);
            outQueue.push(message);
        }
    }

    this.finish = function() {
        if(clientSocket.connecting)
            clientSocket.on('connect', clientSocket.end );
        else
            clientSocket.end();
    }

    function flushOutQueue() {
        while(outQueue.length !== 0) {
            const data = outQueue.shift();
            self.send(data);
        }
    }

    const msg = `{ "name": "moveForward", "arg": 1000 }`;
    this.send( msg );
}

function readPortNumberFromArguments() {
    const port = Number(process.argv[2])
    if(!port || port < 0 || port >= 65536) {
        console.error("This script expects a valid port number (>= 0 and < 65536) as argument.")
        process.exit()
    }

    return port
}