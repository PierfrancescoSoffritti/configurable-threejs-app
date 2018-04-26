function EventBus() {
    const eventCallbacksPairs = []
    
    function subscribe( eventType, callback ) {
        const eventCallbacksPair = findEventCallbacksPair(eventType)

        if(eventCallbacksPair)
            eventCallbacksPair.callbacks.push(callback)
        else
            eventCallbacksPairs.push( new EventCallbacksPair(eventType, callback) )
    }

    function post( eventType, args ) {
        const eventCallbacksPair = findEventCallbacksPair(eventType)
        
        if(!eventCallbacksPair) {
            console.error(`no subscribers for event ${eventType}`)
            return;
        }

        eventCallbacksPair.callbacks.forEach( callback => callback(args) )
    }

    function findEventCallbacksPair(eventType) {
        return eventCallbacksPairs.find( eventObject => eventObject.eventType === eventType )
    }

    function EventCallbacksPair( eventType, callback ) {
        this.eventType = eventType
        this.callbacks = [callback]
    }

    return {
        subscribe,
        post
    }
}

export default new EventBus()