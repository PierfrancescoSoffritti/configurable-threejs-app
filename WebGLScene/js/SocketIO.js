import eventBus from './eventBus/EventBus.js'
import eventBusEvents from './eventBus/events.js'

export default (onKeyUp, onKeyDown) => {
    const socket = io()
        
    socket.on( 'moveForward', duration => moveForward(duration) )
    socket.on( 'moveBackwards', duration => moveBackwards(duration) )
    socket.on( 'turnRight', duration => turnRight(duration) )
    socket.on( 'turnLeft', duration => turnLeft(duration) )
    socket.on( 'alarm', stopMoving )

    eventBus.subscribe( eventBusEvents.sonarActivated, sonarId => socket.emit('sonarActivated', sonarId))
    eventBus.subscribe( eventBusEvents.collision, objectName => { console.log(`collision: ${objectName}`); socket.emit('collision', objectName); stopMoving(); })

    const keycodes = {
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        R: 82,
        F: 70
    }
        
    let moveForwardTimeoutId
    let moveBackwardsTimeoutId

    function moveForward(duration) {
        clearTimeout(moveForwardTimeoutId)
        onKeyDown( { keyCode: keycodes.W } )
        if(duration >= 0) moveForwardTimeoutId = setTimeout( () => onKeyUp( { keyCode: keycodes.W } ), duration )
    }

    function moveBackwards(duration) {
        clearTimeout(moveBackwardsTimeoutId)
        onKeyDown( { keyCode: keycodes.S } )
        if(duration >= 0) moveBackwardsTimeoutId = setTimeout( () => onKeyUp( { keyCode: keycodes.S } ), duration )
    }

    function turnRight(duration) {
        onKeyDown( { keyCode: keycodes.R }, duration )
    }

    function turnLeft(duration) {
        onKeyDown( { keyCode: keycodes.F }, duration )
    }

    function stopMoving() {
        onKeyUp( { keyCode: keycodes.W } )
        onKeyUp( { keyCode: keycodes.S } )
    }
}