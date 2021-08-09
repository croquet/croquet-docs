/**
 * When an [actor]{@link Actor} is instantiated, it automatically creates a corresponding pawn in the view. The pawn handles input and output, while the actor
 * handles simulation. Actors are synchronized across all clients, but pawns are not.
 *
 * @public
 */

class Pawn {

    /**
     * Returns the pawn's actor. You can read the actor's current state directly using this pointer. You should never write to it.
     *
     * @readonly
     * @public
     * @type {Actor}
     * @example
     * const currentTranslation = this.actor.translation;
     */
         get actor() {}

    /**
     * A pawn is automatically created whenever an actor is created or loaded from a snapshot. Pawns are also automatically destroyed
     * when their actor is destroyed. Use the pawn's constructor to initialize the pawn's state from the actor's state. You should also
     * create any subscriptions that the pawn will need.
     *
     * **Warning:** Never instantiate or destroy a pawn directly.
     *
     * **Note:** An actor's pawn is spawned immediately when its actor is instantiated. So any events published in the actors' [init()]{@link Actor#init} will be
     * received by the pawn as long as you subscribe to them in the pawn's constructor. However, when an actor is loaded from snapshot, its init() is not
     * called, and those messages will not be resent. When initializing a pawn, it's better to pull the information you need directly from the
     * actor itself using [this.actor]{@link Pawn#actor}, rather than relying on events.
     *
     * @public
     * @example
     * class MyPawn extends Pawn {
     *      constructor(actor) {
     *           super();
     *           this.color = this.actor.color;
     *           this.listen("changeColor", this.onChangeColor);
     *      }
     *
     *      changeColor(c) { this.color = c};
     * }
     */
    constructor() {}

    /**
     * Called automatically when the pawn's actor is destroyed. You should never call it directly.
     *
     * It cancels all of the pawn's subscriptions. You can overload it to do other teardown, like deallocating render objects or
     * releasing resources.
     *
     *
     * @public
     * @example
     * class MyPawn extends Pawn {
     *      destroy() {
     *           super.destroy();
     *           this.glBuffer.dispose();
     *      }
     * }
     */
    destroy() {}

    /**
     * Publishes an event with its scope limited to this actor/pawn pair. Both the actor and the pawn can listen for events coming from the pawn.
     *
     * **Note:** Events published by the pawn and subscribed to by the actor will be sent via the reflector to every client.
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
     * Subscribes to an event with its scope limited to this actor/pawn pair. The data object from the say method will be passed as an argument to the handler.
     *
     * @public
     * @param {string} event - The name of the event.
     * @param {function} handler - The event handler (must be a method of this).
     * @example
     * this.listen("priorityChanged", this.onNewPriority);
     */
    listen(event, handler) {}

    /**
     * Subscribes to an event with its scope limited to this actor/pawn pair. The event handler will be called immediately when the event is published.
     * The data object from the say method will be passed as an argument to the handler.
     *
     * **Note:** With a normal [listen()]{@link Pawn#listen}, events coming from the actor are queued until all simulation has finished. However if a
     * pawn needs to override this default behavior, use listenImmediate() instead. This doesn't make things run any faster, but may be necessary in
     * rare cases where an event triggers listening to or ignoring other events.
     *
     * @public
     * @param {string} event - The name of the event.
     * @param {function} handler - The event handler (must be a method of this).
     */
    listenImmediate(event, handler) {}

    /**
     * Subscribes to an event with its scope limited to this actor/pawn pair. The event handler will be called when the event is published.
     * The data object from the say method will be passed as an argument to the handler.
     *
     * In the case where multiple copies of the same event are sent from the actor to the pawn during the same frame update, listenOnce() will
     * only respond to the final one. You should use listenOnce whenever a new event comletely overrides a previous one.
     *
     * For example, when a snapshot loads, the model fast-forwards through a sequence of cached events to bring itself in
     * synch with the other clients. However, there's no need for the view to process all these events; in most cases just acting on the final
     * update is sufficient. Using listenOnce will greatly speed up the synch process.
     *
     * @public
     * @param {string} event - The name of the event.
     * @param {function} handler - The event handler (must be a method of this).
     */
         listenOnce(event, handler) {}

    /**
     * Removes an existing [listen()]{@link Pawn#listen} subscription.
     *
     * @public
     * @param {string} event - The name of the event.
     * @example
     * this.ignore("priorityChanged");
     */
    ignore(event) {}

}
