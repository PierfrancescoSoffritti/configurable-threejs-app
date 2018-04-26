const WebpageServer = require('./WebpageServer');
const TCPServer = require('./TCPServer');

const portNumber = readPortNumberFromArguments();

const webpageCallbacks = {
    onWebpageReady: () => tcpServer.send( { event: 'webpage-ready' } ),
    onSonarActivated: object => tcpServer.send( { event: 'sonarActivated', ...object } ),
    onCollision: objectName => tcpServer.send( { event: 'collision', objectName } )
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
