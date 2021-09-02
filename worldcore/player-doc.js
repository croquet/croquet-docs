/**
 * The player manager is a model-side service that automatically spawns an actor whenever a new player joins.
 * When that player exits, it automatically destroys the actor. (it listens for the view-join and view-exit events
 * from the base Croquet library. This allows you to automatically spawn an avatar for a player when they
 * enter a session.
 *
 * 1. Create your own player manager class that inherits from this base class.
 * 2. Override the createPlayer() method to create your player avatar.
 * 3. Add your player manager as a service to the root model.
 * ```
 * class MyPlayerManager extends PlayerManager {
 *
 *      createPlayer(options) {
 *          options.extra = "an extra option";
 *          return MyPlayerAvatar.create(options);
 *      }
 * }
 *
 * class MyModelRoot extends ModelRoot {
 *      createServices() {
 *          this.addService(MyPlayerManager);
 *  }
 * ```
 * Each player has a unqiue playerId that can be used to retrieve it from the player manager's player list.
 * @public
 * @augments ModelService
 * @hideconstructor
 */
 class PlayerManager {
    /**
     * Spawns a player actor. Called automatically when a new player joins. You should override this method so that
     * it returns your player avatar. Pass the options object to the create method of your avatar class. You can add
     * other custom options to the options object before passing it. (For example, if you wanted to randomly pick a
     * spawn point for the avatar.)
     *
     * **Note:** Your player avatar should be extended with the [AM_Player]{@link AM_Player} mixin.
     * @public
     * @param {Object} options An options object that should be passed to the actor when its created.
     * @returns {Actor}
     * @example
     * class MyPlayerManager extends PlayerManager {
    *
    *      createPlayer(options) {
    *          options.translation = [0,0,0]; // The default spawn point
    *          return MyPlayerAvatar.create(options);
    *      }
    * }
    *
    * class MyPlayerAvatar extends mix(Actor).with(AM_Player) {}
     */
    createPlayer(options){}

    /**
     * The number of players in the session.
     * @public
     * @type {number}
     */
    get count() {}

    /**
     * Given a playerId, returns a pointer to the avatar associated with the player.
     * @public
     * @param {string} playerId A unique identifier assigned when the player joins.
     * @returns {Actor}
     */
    player(viewId) {}

}

/**
 * Add to an [actor]{@link Actor} to allow it to be used as a player avatar by the player manager.
 *
 * **Note** - AM_Player should be paired with {@link PM_Player} in the pawn.
 *
 * @public
 * @worldcoremixin
 * @example
 * class AvatarActor extends mix(Actor).with(AM_Player) {}
 */
 class AM_Player  {

    /**
     * The unique identifier assigned to the player when it is created by the player manager.
     * @public
     * @type {string}
     */
   get playerId() {}

}

/**
 * Add to an [pawn]{@link Pawn} to allow it to be used as a player avatar by the player manager.
 *
 * **Note** - PM_Player should be paired with {@link AM_Player} in the actor.
 *
 * @public
 * @worldcoremixin
 * @example
 * class AvatarPawn extends mix(Pawn).with(PM_Player) {}
 */
 class PM_Player  {

    /**
     * Returns true if the pawn is the avatar of the local user. You can use this to create subscriptions so you
     * can route control inputs to the proper actor. A pawn will listen for inputs only if belongs to the local
     * user. Pawns that belong to other users won't subscribe to control inputs. You can also do things
     * like rendering a different model if the pawn belongs to the local user.
     *
     * **Note:** `isMyPlayerPawn()` checks the entire scene graph of the pawn. So a child of a player pawn
     * will be reported as a player pawn as well.
     * @public
     * @type {boolean}
     * @example
     * class AvatarPawn extends mix(Pawn).with(PM_Player) {
     *      constructor(options) {
     *          super(options);
     *          if (this.isMyPlayerPawn) {
     *              this.subscribe("input", "wDown", () => this.say("forward"); // If the w key is pressed, tell my avatar to move forward.
     *          }
     *      }
     * }
     */
   get isMyPlayerPawn() {}

}
