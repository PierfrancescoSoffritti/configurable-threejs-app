import eventBus from '../eventBus/EventBus.js'
import eventBusEvents from '../eventBus/events.js'

export default colliders => {
    function checkCollision(position) {
        for(let i=0; i<colliders.length; i++) {
            const collisionCheck = colliders[i].checkCollision(position)
            
            if(collisionCheck.collision) {
                eventBus.post(eventBusEvents.collision, collisionCheck.objectName)
                return true
            }
        }

        return false
    }

	return {
        checkCollision
	}
}