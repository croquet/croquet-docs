/**
 An actor is a type of model that automatically instantiates a pawn in the view when it’s created. This actor/pawn pair has a private communication channel that allows them to talk directly with each other. The actor handles the simulation, and the pawn handles input and output. When the actor is destroyed, the pawn is destroyed as well.

 @public
 @hideconstructor
 @augments WorldcoreModel
 */

 class Actor {

    /**
    Returns the class type of the actor's corresponding pawn. Actors inheriting from this base class should overload this
    getter to specify their pawn type.
    @readonly
    @public
    @type Pawn
    @example
    class MyActor extends Actor {
	    get pawn() { return MyPawn }
    }
    */
    get pawn() {}

    /**
     Set to true by the actor's [destroy()]{@link Actor#destroy} method. Use it at the start of a reoccuring tick to make sure it doesn't continue
     as a zombie after the actor has been destroyed.
    @readonly
    @public
    @type Boolean
    @example
    tick() {
        if (this.doomed) return;
        future(50).tick();
    }
    */
    get doomed() {}

    /**
    Create an instance of an actor and automatically spawn its corresponding pawn. Create calls the user-defined [init()]{@link Actor#init} method and passes in options
    to set the actor's initial properties.

    **Note:** When your actor is no longer needed, you must [destroy]{@link Actor#destroy} it. Otherwise it will be kept in the snapshot forever.

    **Warning:** never create an actor instance using `new`, or override its constructor.
    @public
    @param {Object} [options] - An object containing the initial properties of the actor. Passed to the actor's [init()]{@link Actor#init}.
    @example
    const actor = MyActor.create({scale: 2})
    */
    static create(options) {}

    /**
    This is called by [create()]{@link Actor.create} to initialize the actor. In your actor subclass, this is the place to
    subscribe to or listen for events, or use a future message to start a reoccuring tick.

    Super.init() calls [set()]{@link Actor#set} to set the actor's initial properties from the options. It also automatically spawns the actor's pawn.
    The properties are set before the pawn is created.
    @param {Object} [options] - An object containing the initial properties of the actor.
    @public
    @example
    class MyActor extends Actor {
        get scale() {return this._scale || 1};
    }
    */
    init(options) {}

    /**
    Deletes the actor and its associated pawn. Publishes the event "destroyActor" with the scope of the actor's model ID.

    **Note:** When your actor is no longer needed, you must destroy it. Otherwise it will be kept in the snapshot forever. You can check if an actor
    has been destroyed with the [doomed]{@link Actor.doomed} flag.
    @public
    @example
    class MyActor extends Actor {
        get scale() {return this._scale || 1};
    }
     */
    destroy() {}

    /**
    Sets one or more internal properties. The internal name of each property will be the name of the option prefaced by "_". You should define corresponding getters
    to access these internal properties.

    *```
    class MyActor extends Actor {
        get scale() {return this._scale || 1};
    }

    const actor = MyActor.create();
    actor.set({scale: 2, translation: [0,0,1]});
    const scale = actor.scale;
    *```
    *Actors inheriting from this base class can overload set() to trigger actions when a property changes:
    *```
    class MyActor extends Actor {

        set(options = {}) {
            super.set(options);
            if ('scale' in options ) this.say("scaleChanged", this.scale);
        }

    }
    *```
    ***Note:** The reason to use set() with getters is to reduce snapshot size. Worldcore actors can have dozens of
    properties. Multiplied by hundreds of actors, the total number of properties stored in the snapshot can grow large. Using set() with
    getters prevents defaults from being stored in the snapshot.
    @param {Object} [options] - An object containing the properties to be changed and their new values.
    @public
    */
    set(options) {}

    /**
    Publishes an event with its scope limited to this actor/pawn pair. Both the actor and the pawn can listen for events coming from the actor.
    @public
    @param {string} event - The name of the event.
    @param {Object} [data] - An optional data object.
    @example
    this.say("serialNumber", 1234);
    this.say("newColor", [0.5, 0.5, 0.5]);
    this.say("updatePrice", {dollars: 2, cents:95});
    */
    say(event, data) {}

    /**
    Subscribes to an event with its scope limited to this actor/pawn pair. It the actor listens for an event said by the pawn, the event will be routed
    through the reflector. The data object from the say method will be passed as an argument to the handler.
    @public
    @param {string} event - The name of the event.
    @param {function} handler - The event handler (must be a method of this).
    @example
    this.listen("priorityChanged", this.onNewPriority);
    */
    listen(event, handler) {}

    /**
    Removes an existing [listen()]{@link Actor#listen} subscription.
    @public
    @param {string} event - The name of the event.
    @example
    this.ignore("priorityChanged");
    */
    ignore(event) {}

}


/**
When an [actor]{@link Actor} is instantiated, it automatically creates a corresponding pawn in the view. The pawn handles input and output, while the actor
handles simulation. Actors are synchronized across all clients, but pawns are not.
@public
@augments WorldcoreView
*/

 class Pawn {

    /**
    Returns the pawn's actor. You can read the actor's current state directly using this pointer. You should never write to it.
    @readonly
    @public
    @type {Actor}
    @example
    const currentTranslation = this.actor.translation;
    */
         get actor() {}

    /**
    A pawn is automatically created whenever an actor is instantiated or is loaded from a snapshot. Pawns are also automatically destroyed
    when their actor is destroyed. Use the pawn's constructor to initialize the pawn's state from the actor's state. You should also
    create any subscriptions that the pawn will need.

    **Warning:** Never instantiate or destroy a pawn directly.

    **Note:** An actor's pawn is spawned immediately when its actor is instantiated. So any events published in the actors' [init()]{@link Actor#init} will be
    received by the pawn as long as you subscribe to them in the pawn's constructor. However, when an actor is loaded from snapshot, its init() is not
    called, and those messages will not be resent. When initializing a pawn, it's better to pull the information you need directly from the
    actor itself using [this.actor]{@link Pawn#actor}, rather than relying on events.
    @public
    @example
    class MyPawn extends Pawn {
        constructor(actor) {
            super();
            this.color = this.actor.color;
            this.listen("changeColor", this.onChangeColor);
        }
        changeColor(c) { this.color = c};
    }
    */
    constructor() {}

    /**
    Called automatically when the pawn's actor is destroyed. You should never call it directly. It cancels all of the pawn's subscriptions. You can overload it to do other teardown, like deallocating render objects or
    releasing resources.
    @public
    @example
    class MyPawn extends Pawn {
        destroy() {
            super.destroy();
            this.glBuffer.dispose();
        }
    }
    */
    destroy() {}

    /**
    Publishes an event with its scope limited to this actor/pawn pair. Both the actor and the pawn can listen for events coming from the pawn.
    *
    ***Note:** Events published by the pawn and subscribed to by the actor will be sent via the reflector to every client.
    @public
    @param {string} event - The name of the event.
    @param {Object} [data] - An optional data object.
    @example
    *this.say("serialNumber", 1234);
    *this.say("newColor", [0.5, 0.5, 0.5]);
    *this.say("updatePrice", {dollars: 2, cents:95});
    */
    say(event, data) {}

    /**
    Subscribes to an event with its scope limited to this actor/pawn pair. The data object from the say method will be passed as an argument to the handler.
    @public
    @param {string} event - The name of the event.
    @param {function} handler - The event handler (must be a method of this).
    @example
    this.listen("priorityChanged", this.onNewPriority);
    */
    listen(event, handler) {}

    /**
    Subscribes to an event with its scope limited to this actor/pawn pair. The event handler will be called immediately when the event is published.
    The data object from the say method will be passed as an argument to the handler.

    **Note:** With a normal [listen()]{@link Pawn#listen}, events coming from the actor are queued until all simulation has finished. However if a
    pawn needs to override this default behavior, use listenImmediate() instead. This doesn't make things run any faster, but may be necessary in
    rare cases where an event triggers listening to or ignoring other events.
    @public
    @param {string} event - The name of the event.
    @param {function} handler - The event handler (must be a method of this).
    */
    listenImmediate(event, handler) {}

    /**
    Subscribes to an event with its scope limited to this actor/pawn pair. The event handler will be called when the event is published.
    The data object from the say method will be passed as an argument to the handler. In the case where multiple copies of the same event
    are sent from the actor to the pawn during the same frame update, listenOnce() will only respond to the final one.
    *
    * You should use listenOnce whenever a new event completely overrides a previous one. For example, when a snapshot loads, the model fast-forwards
    through a sequence of cached events to bring itself in synch with the other clients. However, there's no need for the view to process all
    these events; in most cases just acting on the final update is sufficient. Using listenOnce will greatly speed up the synch process.
    @public
    @param {string} event - The name of the event.
    @param {function} handler - The event handler (must be a method of this).
    */
    listenOnce(event, handler) {}

    /**
    Removes an existing [listen()]{@link Pawn#listen} subscription.

    @public
    @param {string} event - The name of the event.
    @example
    this.ignore("priorityChanged");
    */
    ignore(event) {}
}

/**
 The model root is created when your Worldcore session starts. It owns all actors and all model-side services.
 You can only register one ModelRoot in your applicaton.

 @public
 @hideconstructor
 @augments WorldcoreModel
 */
 class ModelRoot {

    /**
    Returns the class type of the application's view root. Your model root should overload this.
    @readonly
    @public
    @type ViewRoot
    @example
    class MyModelRoot extends ModelRoot {
        get viewRoot() { return MyViewRoot }
    }
    MyModelRoot.register("MyModelRoot");
    */
    get viewRoot() {}

    /**
    Called at start-up to create all the model services used by your app. You should override this in your model root to instantiate only
    the services you need.
    @public
    @example
    class MyModelRoot extends ModelRoot {
        createServices() {
            this.addService(MyModelService);
        }
    }
    */
    createServices() {}

    /**
    Adds a new model service to your app. Pass in the class type of the service, and any start-up options. Returns a pointer to the new service.
    @public
    @param {ModelService} service - The class type of the service.
    @param {Object} [options] - An options object that will be passed on to the service's [create()]{@link ModelService.create}.
    @returns {ModelService}
    */
    addService(service) {}
}

/**
 The view root is created when your Worldcore session starts. It owns all pawns and all view-side services.  You can access the view root from
 anywhere in the view with the global pointer viewRoot.

 @public
 @hideconstructor
 @augments WorldcoreView
 */
 class ViewRoot {

    /**
    Called at start-up to create all the view services used by your app. You should override this in your view root to instantiate only
    the services you need.
    @public
    @example
    class MyViewRoot extends ViewRoot {
        createServices() {
            this.addService(InputManager);
            this.addService(UIManager);
        }
    }
    */
    createServices() {}

    /**
    Adds a new view service to your app. Pass in the class type of the service, and any start-up options. Returns a pointer to the new service.
    @public
    @param {ViewService} service - The class type of the service.
    @param {Object} [options] - An options object that will be passed on to the service's constructor.
    @returns {ViewService}
    */
    addService(service) {}
}

/**
A singleton with a well-known name that provides a model-side global service. You can define your own services and add them in your model root.
 @public
 @hideconstructor
 @augments WorldcoreModel
 */
 class ModelService {

    /**
    Called when the new service is instantiated. An options object may be supplied by the model root. You should overload this when you create
    your own service and name the service using super.init(). If the service needs to regularly update itself, start a tick here using this.future().
    *
    ***Warning:** Never create a service directly. Always use addService() in the model root.
    @public
    @param {string} name - The public name of the service. Use super.init() in your service to set its name.
    @param {Object} [options] - An options object that is supplied to when the service is [added]{@link ModelRoot#addService}.
    @example
    class MyModelService extends ModelService {
        init(options = {}) {
            super.init("MyModelServiceName");
            // Apply options and perform other initialization.
        }
    }
    */
    init(name, options) {

    }
}

/**
A singleton with a well-known name that provides a view-side global service.
@public
@augments WorldcoreView
*/
class ViewService {
    /**
    Called when the new service is instantiated. An options object may be supplied by the view root. You should overload this when you create
    your own service, and name the service using super().
    *
    ***Warning:** Never instantiate a service directly. Always use addService() in the view root.
    @public
    @param {string} name - The public name of the service. Use super() in your service's constructor to set its name.
    @param {Object} [options] - An options object that is supplied to when the service is [added]{@link ViewRoot#addService}.
    @example
    class MyViewService extends ViewService {
        constructor(options = {}) {
            super.init("MyViewServiceName");
            // Apply options and perform other initialization.
        }
    }
    */
    constructor(name, options) {}

    /**
    Any ViewService with an update method will have it called on every frame. Classes that inherit from this base class
    should overload update if they need to refresh every frame.
    @public
    @param {number} time - The system time in milliseconds at the last frame.
    @param {number} delta - The elapsed time in milliseconds since the last frame.
    @example
    class MyViewService extends ViewService {
        update(time, delta) {
            console.log(delta + " ms have elapsed since previous frame");
        }
    }
    */
    update(time, delta) {}
}

/**
 Extends the basic Croquet Model with Worldcore-specific methods.
 @public
 @hideconstructor
 */

 class WorldcoreModel {

    /**
    Returns a pointer to the named ModelService.
    @param {string} name - The public name of the model service.
    @returns {ModelService}
    @public
    */
    service(name) {}
}

/**
 Extends the basic Croquet View with Worldcore-specific methods.
 @public
 */

 class WorldcoreView {

    /**
    Returns the system time in millisconds at the last frame update.
    @readonly
    @public
    @type number
    */
    get time() {}

    /**
    Returns the time in millisconds between the last frame update and the previous one.
    @readonly
    @public
    @type number
    */
    get delta() {}

    /**
    Returns a pointer to the named view service.
    @param {string} name - The public name of the view service.
    @returns {ModelService}
    @public
    */
    service(name) {}

    /**
    Returns a pointer to the named model service.
    *
    ***Note:** The view should only read from the model service. Do not write to it, or call methods that modify it.
    @param {string} name - The public name of the model service.
    @returns {ModelService}
    @public
    */
    modelService(name) {}
}
