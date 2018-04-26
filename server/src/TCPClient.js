const net = require('net');

const SEPARATOR = "__endofmessage__";

new Communicator({port: 8900, ip: "localhost"})

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
                .filter(string => string.trim().length !== 0)
                .map( message => JSON.parse(message) )
                .forEach( message => console.log(message) );
        });
        
        client.on('close', () =>  console.log(`\tConnection closed`) );

        client.on('error', () => console.log(`\tConnection error`) );
    }

    this.send = function(message) {
        if(!clientSocket.connecting)
            clientSocket.write( message +SEPARATOR);
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
    this.send(msg);
}