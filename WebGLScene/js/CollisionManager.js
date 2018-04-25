import eventBus from './eventBus/EventBus.js';
import eventBusEvents from './eventBus/events.js';

export default colliders => {

    function checkCollision(position) {
        for(let i=0; i<colliders.length; i++) {
            const collision = colliders[i].checkCollision(position);
            
            if(collision) {
                eventBus.post(eventBusEvents.collision);
                return true;
            }
        }

        return false;
    }

	return {
        checkCollision
	}
}