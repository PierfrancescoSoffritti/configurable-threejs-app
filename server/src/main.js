const WebpageServer = require('./WebpageServer');
const TCPServer = require('./TCPServer');

const portNumber = readPortNumberFromArguments();

function onWebpageReady() {
    const event = { event: 'webpage-ready' };
    console.log( event );
    tcpServer.send(event);
}

function onSonarActivated(msg) {
    const event = { event: 'sonarActivated', ...msg };
    console.log(event);
    tcpServer.send(event);
}

function onCollision(objectName) {
    const event = { event: 'collision', objectName };
    console.log(event);
    tcpServer.send(event);
}

const webpageCallbacks = {
    onWebpageReady,
    onSonarActivated,
    onCollision
}

const webpageServer = new WebpageServer(webpageCallbacks);
const tcpServer = new TCPServer( portNumber, command => webpageServer[command.name](command.arg) );

function readPortNumberFromArguments() {
    const port = Number(process.argv[2]);
    if(!port || port < 0 || port >= 65536) {
        console.error("This script expects a valid port number (>= 0 and < 65536) as argument.");
        process.exit();
    }

    return port;
}
