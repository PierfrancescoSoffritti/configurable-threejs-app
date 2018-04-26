const WebpageServer = require('./WebpageServer');
const TCPServer = require('./TCPServer');

const port = Number(process.argv[2]);
if(!port || port < 0 || port >= 65536) {
    console.error("This script expects a valid port number (>= 0 and < 65536) as argument.");
    process.exit();
}


const server = new TCPServer();
server.start(port);

function onWebpageReady() {
    console.log("webpage ready");
}

function onSonarActivated(msg) {
    console.log(msg);
}

function onCollision(objectName) {
    console.log(objectName);
}

const webpageCallbacks = {
    onWebpageReady,
    onSonarActivated,
    onCollision
}

const webpageServer = new WebpageServer(webpageCallbacks);
