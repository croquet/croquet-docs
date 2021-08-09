/**
 * When an [actor]{@link Actor} is instantiated, it automatically creates a corresponding pawn in the view. The pawn handles input and output, while the actor
 * handles simulation. Actors are synchronized across all clients, but pawns are not.
 *
 * @public
 */

class Mixin {

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

}
