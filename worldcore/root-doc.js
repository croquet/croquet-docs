/**
 An actor is a type of model that automatically instantiates a [pawn]{@link Pawn} in the view when it’s created. This actor/pawn pair has a private communication channel that allows them to talk directly with each other. The actor handles the simulation, and the pawn handles input and output. When the actor is destroyed, the pawn is destroyed as well.

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
     Set to true by the actor's [destroy()]{@link Actor#destroy} method. Use it at the start of a recurring tick to make sure it doesn't continue
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
    * Create an instance of an actor and automatically spawn its corresponding pawn. Create calls the user-defined [init()]{@link Actor#init} method and passes in options
    * to set the actor's initial properties.
    *
    * **Note:** When your actor is no longer needed, you must [destroy]{@link Actor#destroy} it. Otherwise it will be kept in the snapshot forever.
    *
    * **Warning:** Never create an actor instance using `new`, or override its constructor.
    * @public
    * @param {Object} [options] - An object containing the initial properties of the actor. Passed to the actor's [init()]{@link Actor#init}.
    * @example
    * const actor = MyActor.create({scale: 2})
    */
    static create(options) {}

    /**
    * This is called by [create()]{@link Actor.create} to initialize the actor. In your actor subclass, this is the place to
    * subscribe to or listen for events, or use a future message to start a recurring tick.
    *
    * Super.init() calls [set()]{@link Actor#set} to set the actor's initial properties from the options. It also automatically spawns the actor's pawn.
    * The properties are set before the pawn is created.
    * @param {Object} [options] - An object containing the initial properties of the actor.
    * @public
    * @example
    * class MyActor extends Actor {
    *     get scale() {return this._scale || 1};
    * }
    */
    init(options) {}

    /**
    * Deletes the actor and its associated pawn.
    *
    * **Note:** When your actor is no longer needed, you must destroy it. Otherwise it will be kept in the snapshot forever. You can check if an actor
    * has been destroyed with the [doomed]{@link Actor#doomed} flag.
    * @public
    * @fires [destroyActor]{@link Actor#destroyActor}
     */
    destroy() {}

    /**
     * Fired when an actor is destroyed.
     * @event
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"destroyActor"`
     */
    destroyActor() {}

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
    * Publishes an event with its scope set to the actor.id. Both the actor and the pawn can listen for events coming from the actor.
    * @public
    * @param {string} event - The name of the event.
    * @param {Object} [data] - An optional data object.
    * @example
    * this.say("serialNumber", 1234);
    * this.say("newColor", [0.5, 0.5, 0.5]);
    * this.say("updatePrice", {dollars: 2, cents:95});
    */
    say(event, data) {}

    /**
    Subscribes to an event with its scope set to the actor.id. The actor listens for an event sent by say(), the event will be routed
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

 class Pawn extends WorldcoreView {

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
    Publishes an event with its scope set to the actor.id. Both the actor and the pawn can listen for events coming from the pawn.
    *
    * **Note:** Events published by the pawn and subscribed to by the actor will be sent via the reflector to every client.
    * @public
    * @param {string} event - The name of the event.
    * @param {Object} [data] - An optional data object.
    * @example
    *this.say("serialNumber", 1234);
    *this.say("newColor", [0.5, 0.5, 0.5]);
    *this.say("updatePrice", {dollars: 2, cents:95});
    */
    say(event, data) {}

    /**
    Subscribes to an event with its scope set to the actor.id. The data object from the say method will be passed as an argument to the handler.
    @public
    @param {string} event - The name of the event.
    @param {function} handler - The event handler (must be a method of this).
    @example
    this.listen("priorityChanged", this.onNewPriority);
    */
    listen(event, handler) {}

    /**
    * Subscribes to an event with its scope set to the actor.id. The event handler will be called immediately when the event is published.
    * The data object from the say method will be passed as an argument to the handler.
    *
    * **Note:** With a normal [listen()]{@link Pawn#listen}, events coming from the actor are queued until all simulation has finished. However if a
    * pawn needs to override this default behavior, use listenImmediate() instead. This doesn't make things run any faster, but may be necessary in
    * rare cases where an event triggers listening to or ignoring other events.
    * @public
    * @param {string} event - The name of the event.
    * @param {function} handler - The event handler (must be a method of this).
    */
    listenImmediate(event, handler) {}

    /**
    Subscribes to an event with its scope limited to this actor/pawn pair. The event handler will be called when the event is published.
    The data object from the say method will be passed as an argument to the handler. In the case where multiple copies of the same event
    are sent from the actor to the pawn during the same frame update, listenOnce() will only respond to the final one.
    *
    * You should use listenOnce whenever a new event completely overrides a previous one. For example, when a snapshot loads, the model fast-forwards
    * through a sequence of cached events to bring itself in synch with the other clients. However, there's no need for the view to process all
    * these events; in most cases just acting on the final update is sufficient. Using listenOnce will greatly speed up the synch process.
    * @public
    * @param {string} event - The name of the event.
    * @param {function} handler - The event handler (must be a method of this).
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

 @public
 @hideconstructor
 @augments WorldcoreModel
 */
 class ModelRoot {

    /** Returns an array of [model services]{@link ModelService} that will be created when the session starts.
     * You should overload this in your model root to instantiate only the services you need.
     *
     * **Note:** Array entries can be either the name of a service, or an object containing
     * the name of the service plus options to be passed to it when it's instantiated.
     * @public
     * @returns {ModelService[]}
     * @example
     * static modelServices() {
        return [PlayerManager, {service: RapierPhysicsManager, options: {gravity: [0,-9.8, 0], timeStep: 15}}];
    }
     */
    static modelServices() {}

}

/**
 The view root is created when your Worldcore session starts. It owns all pawns and all view-side services.  You can access the view root from
 anywhere in the view with the global pointer viewRoot.

 @public
 @hideconstructor
 @augments WorldcoreView
 */
 class ViewRoot {

    /** Returns an array of [view services]{@link ViewService} that will be created when the session starts.
     * You should overload this in your view root to instantiate only the services you need.
     *
     * **Note:** Array entries can be either the name of a service, or an object containing
     * the name or the service plus options to be passed to it when it's instantiated.
     * @public
     * @returns {ViewService[]}
     * @example
     * static viewServices() {
        return [InputManager, RenderManager, UIManager];
    }
     */
    static viewServices() {}
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
    ***Warning:** Never create a service directly. Always use [modelServices()]{@link ModelRoot.modelServices} in the model root.
    @public
    @param {string} name - The public name of the service. Use super.init() in your service to set its name.
    @param {Object} [options] - An options object that is supplied to when the service is added.
    @example
    class MyModelService extends ModelService {
        init(options = {}) {
            super.init("MyModelServiceName");
            // Apply options and perform other initialization.
        }
    }
    */
    init(name, options) {}

    /**
     * This method is called before the Croquet session starts. If you're writing a custom service that requires some
     * sort of installation or initization *before* Croquet runs `Session.join` that code should go here.
     * @public
     * @example
    class MyModelService extends ModelService {
        static async asyncStart() {
            RAPIER = await import("@dimforge/rapier3d"); // Installs Rapier physics package
        }
    }
     */
    static async asyncStart() {}
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
    ***Warning:** Never instantiate a service directly. Always use [viewServices()]{@link ViewRoot.viewServices} in the view root.
    @public
    @param {string} name - The public name of the service. Use super() in your service's constructor to set its name.
    @param {Object} [options] - An options object that is supplied to when the service is added.
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
     * This method is called before the Croquet session starts. If you're writing a custom service that requires some
     * sort of installation or initization *before* Croquet runs `Session.join` that code should go here.
     * @public
     */
    static async asyncStart() {}

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
    Returns a pointer to the named model service.
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
    Returns the system time in milliseconds at the last frame update.
    @readonly
    @public
    @type number
    */
    get time() {}

    /**
    Returns the time in milliseconds between the last frame update and the previous one.
    @readonly
    @public
    @type number
    */
    get delta() {}

    /**
    Returns a pointer to the named view service.
    @param {string} name - The public name of the view service.
    @returns {ViewService}
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

/**
 * This function should be used to start a Worldcore session instead of the normal Croquet `Session.join`. The
 * reason for this is that some Worldcore services may require installaton or initialization before Croquet
 * starts, and StartWorldcore handles that automatically.
 * @public
 * @param {Object} options - The options object to be passed to `Session.join`
 * @example
 * StartWorldcore({
    appId: 'io.croquet.example',
    apiKey: <insert api key>,
    password: 'password',
    name: 'example',
    model: MyModelRoot,
    view: MyViewRoot
})
 */
export async function StartWorldcore(options) {
}

/**
 * Given the name of a model service, returns a pointer to it.
 *
 * @public
 * @param {string} name - The name of a model service.
 * @returns {ModelService}
 */
export function GetModelService(name) { }

/**
 * Given the name of a view service, returns a pointer to it.
 *
 * ***Warning:*** This should not be called inside model code.
 *
 * @public
 * @param {string} name - The name of a view service.
 * @returns {ViewService}
 */
 export function GetViewService(name) { }
