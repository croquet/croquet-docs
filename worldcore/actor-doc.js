/**
 An actor is a type of model that automatically instantiates a pawn in the view when it’s created. This actor/pawn pair has a private communication channel that allows them to talk directly with each other. The actor handles the simulation, and the pawn handles input and output. When the actor is destroyed, the pawn is destroyed.


 @example
 * this.createElement("div");
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
     * Create an instance of an actor and automatically spawn its corresponding pawn. Create calls the user-defined [init()]{@link Actor#init} method and passes in the options.
     *
     * **Note:** When your actor is no longer needed, you must [destroy]{@link Actor#destroy} it. Otherwise it will be kept in the snapshot forever.
     *
     * **Warning**: never create an actor instance using `new`, or override its constructor.
     *
     * @public
     * @param {Object} [options] - An initialization object that's passed to the actor's [init()]{@link Actor#init}. Init automatically generates internal properties with the name of each option prefaced by "_".
     * @example
     * const a = MyActor.create({scale: 2})
    */
    static create(options) {}

    /**
     * This is called by [create()]{@link Actor.create} to initialize the actor. In your actor subclass, this is the place to
     * subscribe to or listen for events, or to start a future message for a reoccuring tick.
     *
     * Super.init() automatically
     * generates internal properties with the name of each initialization option prefaced by "_". You should define corresponding
     * getters to access these internal properties, along with their default values.
     *
     * **Note:** The reason to use getters to reduce snapshot size. Worldcore actors can be quite complicated with dozens of
     * properties. Multiplied by dozens of actors, the total number of properties stored in the snapshot grow quite large. Using
     * getters prevents defaults from being stored.
     *
     * @param {Object} [options] - An initialization object. super.init() automatically generates internal properties with the name of each option prefaced by "_".
     * @public
     * @example
     * class MyActor extends Actor {
     *      get scale() {return this._scale || 1};
     * }
     */
    init(options) {}



}
