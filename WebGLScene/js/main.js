import SceneManager from './SceneManager.js';
import eventBus from './eventBus/EventBus.js';
import eventBusEvents from './eventBus/events.js';

initPlug();

const canvas = document.getElementById("canvas");

const sceneManager = SceneManager(canvas);

const socket = io();
    
socket.on( 'startRobot', event => eventBus.post(eventBusEvents.spawnRobot) )
socket.on( 'moveForward', duration => moveForward(duration) )
socket.on( 'turnRight', duration => turnRight(duration) )
socket.on( 'turnLeft', duration => turnLeft(duration) )
socket.on( 'alarm', duration => stopMoving() )
socket.on( 'stop', duration => stopMoving() )

eventBus.subscribe( eventBusEvents.sonarActivated, sonarId => socket.emit("sonarActivated", sonarId))
eventBus.subscribe( eventBusEvents.collision, objectName => { console.log(`collision with: ${objectName}`); socket.emit("collision"); stopMoving(); })

const W = 87
const A = 65
const S = 83
const D = 68
const R = 82
const F = 70
	
let moveForwardTimeoutId;
let moveBackwardsTimeoutId;

function moveForward(duration) {
	clearTimeout(moveForwardTimeoutId);
	onKeyDown( { keyCode: W } );
	if(duration >= 0) moveForwardTimeoutId = setTimeout( () => onKeyUp( { keyCode: W } ), duration );
}

function moveBackwards(duration) {
	clearTimeout(moveBackwardsTimeoutId);
	onKeyDown( { keyCode: S } );
	if(duration >= 0) moveBackwardsTimeoutId = setTimeout( () => onKeyUp( { keyCode: S } ), duration );
}

function turnRight(duration) {
	onKeyDown( { keyCode: R }, duration );
}

function turnLeft(duration) {
	onKeyDown( { keyCode: F }, duration );
}

function stopMoving() {
	onKeyUp( { keyCode: W } );
	onKeyUp( { keyCode: S } );
}

bindEventListeners();
render();

function bindEventListeners() {
	window.onresize = resizeCanvas;
	window.onkeydown = onKeyDown
	window.onkeyup = onKeyUp
	resizeCanvas();	
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height= '100%';
	
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
    
    sceneManager.onWindowResize();
}

function onKeyDown(event, duration) {
	sceneManager.onKeyDown(event.keyCode, duration)
}

function onKeyUp(event) {
	sceneManager.onKeyUp(event.keyCode)
}

function render(time) {
    requestAnimationFrame(render);
	sceneManager.update();
	TWEEN.update(time);
}

function initPlug() {
	const plugDiv = document.getElementById("plug");
	const icons = [
		document.getElementById("firetruck"),
		document.getElementById("forklift"),
		document.getElementById("lamp"),
		document.getElementById("internet-explorer"),
		document.getElementById("tower-fire"),
		document.getElementById("towing"),
		document.getElementById("tram"),
		document.getElementById("tractor"),
		document.getElementById("washing-machine"),
		document.getElementById("fork"),
		document.getElementById("shovel"),
		document.getElementById("highway"),
		document.getElementById("carrot"),
	]
	plugDiv.insertBefore(icons[getRandomInt(0, icons.length-1)], plugDiv.children[1]);
}