import SceneManager from './SceneManager.js';
import eventBus from './eventBus/EventBus.js';

const canvas = document.getElementById("canvas");

const sceneManager = SceneManager(canvas);

const socket = io();
    
socket.on( 'startRobot', event => eventBus.post('spawnRobot') )
socket.on( 'moveForward', duration => moveForward(duration) )
socket.on( 'turnRight', duration => turnRight(duration) )
socket.on( 'turnLeft', duration => turnLeft(duration) )
socket.on( 'alarm', duration => stopMovingForward() )
socket.on( 'stop', duration => stopMovingForward() )

eventBus.subscribe( 'sonarActivated', sonarId => socket.emit("sonarActivated", sonarId))
eventBus.subscribe( 'collision', () => { socket.emit("collision"); stopMovingForward() })

const W = 87
const A = 65
const S = 83
const D = 68
const R = 82
const F = 70
	
let timeoutId;

function moveForward(duration) {
	clearTimeout(timeoutId);
	onKeyDown( { keyCode: W } );
	if(duration >= 0) timeoutId = setTimeout( () => onKeyUp( { keyCode: W } ), duration );
}

function turnRight(duration) {
	onKeyDown( { keyCode: R }, duration );
}

function turnLeft(duration) {
	onKeyDown( { keyCode: F }, duration );
}

function stopMovingForward() {
	onKeyUp( { keyCode: W } );
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