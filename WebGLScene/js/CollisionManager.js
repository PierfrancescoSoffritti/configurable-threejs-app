import eventBus from './EventBus.js';

export default colliders => {

    function checkCollision(position) {
        for(let i=0; i<colliders.length; i++) {
            const collision = colliders[i].checkCollision(position);
            
            if(collision) {
                eventBus.post("collision");
                return true;
            }
        }

        return false;
    }

	return {
        checkCollision
	}
}