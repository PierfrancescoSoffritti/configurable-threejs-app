const WebpageServer = require('./WebpageServer');

function onWebpageReady() {
    console.log("webpage ready")
}

function onSonarActivated(msg) {

}

function onCollision() {

}

const webpageCallbacks = {
    onWebpageReady,
    onSonarActivated,
    onCollision
}

const webpageServer = new WebpageServer(webpageCallbacks);
