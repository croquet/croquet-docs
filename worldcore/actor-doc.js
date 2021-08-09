/**
 An actor is a type of model that automatically instantiates a pawn in the view when it’s created. This actor/pawn pair has a private communication channel that allows them to talk directly with each other. The actor handles the simulation, and the pawn handles input and output. When the actor is destroyed, the pawn is destroyed as well.

 @public
 @hideconstructor
 */

class Actor {

    /**
     * Returns the class type of the actor's corresponding pawn. Actors inheriting from this base class should overload this
     * getter to specify their pawn type.
     *
     * @readonly
     * @public
     * @type Pawn
     * @example
     * class MyActor extends Actor {
	  *      get pawn() { return MyPawn }
     * }
     */
    get pawn() {}

    /**
     * Set to true by the actor's [destroy()]{@link Actor#destroy} method. Use it at the start of a reoccuring tick to make sure it doesn't continue
     * as a zombie after the actor has been destroyed.
     *
     * @readonly
     * @public
     * @type Boolean
     * @example
     * tick() {
	 *      if (this.doomed) return;
     *      future(50).tick();
     * }
     */
         get doomed() {}

    /**
     * Create an instance of an actor and automatically spawn its corresponding pawn. Create calls the user-defined [init()]{@link Actor#init} method and passes in options
     * to set the actor's initial properties.
     *
     * **Note:** When your actor is no longer needed, you must [destroy]{@link Actor#destroy} it. Otherwise it will be kept in the snapshot forever.
     *
     * **Warning:** never create an actor instance using `new`, or override its constructor.
     *
     * @public
     * @param {Object} [options] - An object containing the initial properties of the actor. Passed to the actor's [init()]{@link Actor#init}.
     * @example
     * const a = MyActor.create({scale: 2})
    */
    static create(options) {}

    /**
     * This is called by [create()]{@link Actor.create} to initialize the actor. In your actor subclass, this is the place to
     * subscribe to or listen for events, or use a future message to start a reoccuring tick.
     *
     * Super.init() calls [set()]{@link Actor#set} to set the actor's initial properties from the options. It also automatically spawns the actor's pawn.
     * The properties are set before the pawn is created.
     *
     * @param {Object} [options] - An object containing the initial properties of the actor.
     * @public
     * @example
     * class MyActor extends Actor {
     *      get scale() {return this._scale || 1};
     * }
     */
    init(options) {}

    /**
     * Deletes the actor and its associated pawn. Publishes the event "destroyActor" with the scope of the actor's model ID.
     *
     * **Note:** When your actor is no longer needed, you must destroy it. Otherwise it will be kept in the snapshot forever. You can check if an actor
     * has been destroyed with the [doomed]{@link Actor.doomed} flag.
     *
     * @public
     * @example
     * class MyActor extends Actor {
     *      get scale() {return this._scale || 1};
     * }
     */
    destroy() {}

    /**
     * Sets one or more internal properties. The name of each property is the name of the option prefaced by "_". You should define corresponding getters
     * to access these internal properties.
     *
     * ```
     * class MyActor extends Actor {
     *      get scale() {return this._scale || 1};
     * }
     *
     * myActor.set({scale: 2, translation: [0,0,1]});
     * const scale = myActor.scale;
     * ```
     * Actors inheriting from this base class can overload set() to automatically trigger actions when a property changes:
     * ```
     * class MyActor extends Actor {
     *      set(options ={}) {
     *           super.set(options);
     *           if ('scale' in options ) this.say("scaleChanged", this.scale);
     *      }
     * }
     * ```
     * **Note:** The reason to use set() with getters is to reduce snapshot size. Worldcore actors can be quite complicated with dozens of
     * properties. Multiplied by hundreds of actors, the total number of properties stored in the snapshot can grow quite large. Using set() with
     * getters prevents defaults from being stored.
     *
     * You can also use normal class properties, and ignore set().
     *
     * @param {Object} [options] - An object containing the properties to be changing and their new values.
     * @public
     */
    set(options) {}

    /**
     * Publishes an event with its scope limited to this actor/pawn pair. Both the actor and the pawn can listen for events coming from the actor.
     *
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
     * Subscribes to an event with its scope limited to this actor/pawn pair. It the actor listens for an event said by the pawn, the event will be routed
     * through the reflector. The data object from the say method will be passed as an argument to the handler.
     *
     * @public
     * @param {string} event - The name of the event.
     * @param {function} handler - The event handler (must be a method of this).
     * @example
     * this.listen("priorityChanged", this.onNewPriority);
     */
    listen(event, handler) {}

    /**
     * Removes an existing [listen()]{@link Actor#listen} subscription.
     *
     * @public
     * @param {string} event - The name of the event.
     * @example
     * this.ignore("priorityChanged");
     */
    ignore(event) {}

}
