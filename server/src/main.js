const WebpageServer = require('./WebpageServer');
const TCPServer = require('./TCPServer');

const server = new TCPServer();
server.start(8900);

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
