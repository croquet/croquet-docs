
/**
 * Mixins are functions that can be used to modularly extend actor and pawns. The "mix" and "with"
 * operators are semantic sugar to make the construction of the composite class look nice.
 *
 * It's Worldcore convention to prefix actor mixins with "AM_" and pawn mixins with "PM_". In some
 * cases, actor and pawn mixins are designed to work together. For example:
 *
 * ```
 * class SpatialActor extends mix(Actor).with(AM_Spatial) {
 *    get pawn() {return SpatialPawn}
 * }
 * SpatialActor.register("SpatialActor");
 *
 *
 * class SpatialPawn extends mix(Pawn).with(PM_Spatial) {
 * }
 *```
 * The spatial mixins give the actor and the pawn the ability to occupy a position in 3d space. We use them together
 * because the mixins also contain code to make sure the position of the pawn tracks the position of
 * the actor.
 *
 * Worldcore comes with a standard set of built-in mixins. Some are actor/pawn pairs, while others
 * are used with actors or pawns independently. You can also define your own mixins.
 *
 * ***Actor Mixins***
 * contain methods that extend the actor class they're added to. They can have an `init()`
 * method that overrides the actor's base init. For example:
 * ```
 * const AM_Color = superclass extends superclass {
 *    init(...args) {
 *      super.init(...args);
 *      this.red = 1;
 *      this.blue = 1;
 *      this.green = 1;
 *    }
 *
 *    get rgb() { return [this.red, this.blue, this.green]}
 * };
 RegisterMixin(AM_Color);
 * ```
 * This defines a mixin that adds color properties to an actor.
 * Note that `init()` passes all arguments straight through to `super.init()`. Also, the mixin is
 * registered after it is defined. (This ensures that changing the mixin won't cause divergence in the model.)
 *
 * ***Pawn Mixins***
 * are similar to actor mixins, but they have constructors instead of `init()`, and they don't
 * need to be registered:
 *
 * ```
 * const PM_Shape = superclass extends superclass {
 *    constructor(...args) {
 *      super(...args);
 *      this.shape = "sphere"
 *    }
 *
 *    makeCube() { this.shape = "cube"}
 * };
 * ```
 * ***Inheritance***
 * Mixins can inherit from other mixins, just like classes can inherit from other classes:
 * ```
 * const AM_TransparentColor = superclass extends AM_color(superclass) {
 *    init(...args) {
 *      super.init(...args);
 *      this.opacity = 1;
 *    }
 *
 *    show() {this.opacity = 1}
 *    hide() {this.opacity = 0}
 * };
 RegisterMixin(AM_TransparentColor);
 * ```
 * This extends the `AM_Color` mixin to have an opacity property. If you add a child mixin to an actor or a pawn
 * you get all the properties and methods of the parent as well. You don't need to explicitly add both the parent and the child.
 * @public
 * @worldcoremixin
 */
class Overview {

}

/**
 * Dynamic pawns have an update method that is called every frame by {@link ViewRoot}. Make
 * a pawn dynamic if it needs to do something every frame. (for example, interpolate its position.)
 *
 * @public
 * @class
 * @worldcoremixin
 * @example
 * class DynamicPawn extends mix(Pawn).with(PM_Dynamic) {}
 */
 class PM_Dynamic {

    /**
     * Called every frame by {@link ViewRoot}. Overload this to create your pawn's custom update.
     * @public
     * @param {number} time - The view time in milliseconds of the current frame.
     * @param {number} delta - The elapsed time in milliseconds since the previous frame.
     * @type {Pawn}
     */
     update(time, delta) {}

    /**
     * Called every frame by {@link ViewRoot} right before [update()]{@link DynamicPawn#update}. Use this
     * only for operations that **must** occur before everything else.
     * @public
     * @param {number} time - The view time in milliseconds of the current frame.
     * @param {number} delta - The elapsed time in milliseconds since the previous frame.
     * @type {Pawn}
     */
    preUpdate(time, delta) {}

    /**
     * Called every frame by {@link ViewRoot} right after [update()]{@link DynamicPawn#update}. Use this
     * only for operations that **must** occur after everything else.
     * @public
     * @param {number} time - The view time in milliseconds of the current frame.
     * @param {number} delta - The elapsed time in milliseconds since the previous frame.
     * @type {Pawn}
     */
         postUpdate(time, delta) {}

}

/**
 * The abstract base class for mixins that organize [actors]{@link Actor} into hierarchical trees.
 * (For example, a scene graph.)
 *
 * **Note** - AM_Tree must be paired with {@link PM_Tree} in the pawn.
 * @public
 * @worldcoremixin
 * @example
 * class TreeActor extends mix(Actor).with(AM_Tree) {}
 */
class AM_Tree {

    /**
     * The parent of the actor in the hierarchical tree.
     * @public
     * @type {Actor}
     * @example
     * const treeActor = TreeActor.create({parent: parentActor});
     */
     get parent() {}

}

/**
 * The abstract base class for mixins that organize [pawns]{@link Pawn} into hierarchical trees.
 * (For example, a scene graph.) The pawn automatically updates its parent to
 * be the pawn associated with its actor's parent.
 *
 * **Note** - PM_Tree must be paired with {@link AM_Tree} in the actor.
 * @public
 * @worldcoremixin
 * @example
 * class TreePawn extends mix(Pawn).with(PM_Tree) {}
 */
 class PM_Tree {

    /**
     * The parent of the pawn in the hierarchical tree. This is the pawn associated with the parent of this pawn's actor.
     * This property is updated automatically, when the actor's parent changes.
     * @public
     * @type {Pawn}
     * @example
     * if (treePawn.parent.actor === treePawn.actor.parent ) {console.log("Always true!")};
     */
     get parent() {}

}

/**
 * Gives [actors]{@link Actor} a spatial position with translation, rotation and scale. Spatial actors are arranged in a scene graph
 * hierarchy, with child actors applying their transforms on top of the transforms of their parents. Only use AM_Spatial for actors
 * that are relatively stationary -- it doesn't apply any view-side interpolation to smooth out irregular movement. For moving
 * actors, use {@link AM_Smoothed} instead.
 *
 *
 * **Note** - AM_Spatial must be paired with {@link PM_Spatial} in the pawn.
 * @public
 * @worldcoremixin
 * @augments AM_Tree
 * @example
 * class SpatialActor extends mix(Actor).with(AM_Spatial) {}
 */
 class AM_Spatial extends AM_Tree {

    /**
     * The local translation of the actor relative to its parent. The value is a 3D vector.
     * @public
     * @default [0,0,0]
     * @fires [translationChanged]{@link AM_Spatial#translationChanged}
     * @fires [localChanged]{@link AM_Spatial#localChanged}
     * @fires [globalChanged]{@link AM_Spatial#globalChanged}
     * @type {number[]}
     * @example
     * spatialActor.set({translation: [1,0,0]}); // Translate this actor one unit in the X direction from its parent.
     */
    get translation() {}

    /**
     * The local rotation of the actor relative to its parent. The value is a quaternion.
     * @public
     * @default [0,0,0,1]
     * @fires [rotationChanged]{@link AM_Spatial#rotationChanged}
     * @fires [localChanged]{@link AM_Spatial#localChanged}
     * @fires [globalChanged]{@link AM_Spatial#globalChanged}
     * @type {number[]}
     * @example
     * spatialActor.set({rotation: q_axisAngle([1,0,0], toRad(90))}); // Rotate this actor 90 degrees around the X axis relative to its parent.
     */
    get rotation() {}

    /**
     * The local scale of the actor relative to its parent. The value is a 3D vector.
     *
     * **Warning** - Do not set the scale to 0!
     * @public
     * @default [1,1,1]
     * @fires [scaleChanged]{@link AM_Spatial#scaleChanged}
     * @fires [localChanged]{@link AM_Spatial#localChanged}
     * @fires [globalChanged]{@link AM_Spatial#globalChanged}
     * @type {number[]}
     * @example
     * spatialActor.set({scale: [2,2,2])}); // Double the size of this actor relative to its parent.
     */
    get scale() {}

    /**
     * The local 4x4 transformation matrix. This is the actor's transform relative to its parent.
     *
     * **Warning** - Do NOT set this matrix directly. Set the independent translation, rotation, and scale components
     * and let the actor combine them to get the local matrix.
     * @public
     * @type {number[]}
     */
    get local() {}

    /**
     * The global 4x4 transformation matrix. This is the actor's transform relative to world space,
     * taking into account its local transform and the local transforms of all of its parents.
     *
     * **Warning** - Do NOT set this matrix directly. Set the independent translation, rotation, and scale components
     * and let the actor combine them to get the global matrix.
     * @public
     * @type {number[]}
     */
    get global() {}

    /**
     * Fired when a spatial actor's translation changes.
     * @name translationChanged
     * @event AM_Spatial#translationChanged
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"translationChanged"`
     * @property {number[]} translation - 3-vector
     */
    translationChanged() {}

    /**
     * Fired when a spatial actor's rotation changes.
     * @event AM_Spatial#rotationChanged
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"rotationChanged"`
     * @property {number[]} rotation - quaternion
     */
    rotationChanged() {}

     /**
     * Fired when a spatial actor's scale changes.
     * @event AM_Spatial#scaleChanged
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"scaleChanged"`
     * @property {number[]} scale - 3-vector
     */
    scaleChanged() {}

    /**
     * Fired when a spatial actor's local transform matrix changes.
     * @event AM_Spatial#localChanged
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"localChanged"`
     * @property {number[]} transform - 4x4 transform matrix
     */
    localChanged() {}

    /**
     * Fired when a spatial actor's global transform matrix changes.
     * @event AM_Spatial#globalChanged
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"globalChanged"`
     * @property {number[]} transform - 4x4 transform matrix
     */
    globalChanged() {}

}

/**
 * Gives [pawns]{@link Pawn} a spatial position with translation, rotation and scale. Updates the pawn's spatial position
 * automatically when the actor changes position. Spatial pawns are arranged in a scene graph
 * hierarchy, with child pawns applying their transforms on top of the transforms of their parents. Only use PM_Spatial for pawns
 * that are relatively stationary -- it doesn't apply any view-side interpolation to smooth out irregular movement. For moving
 * pawns, use {@link PM_Smoothed} instead.
 *
 * **Note** - PM_Spatial must be paired with {@link AM_Spatial} in the actor.
 * @public
 * @worldcoremixin
 * @augments PM_Tree
 * @example
 * class SpatialPawn extends mix(Pawn).with(PM_Spatial) {}
 */
 class PM_Spatial extends PM_Tree {

    /**
     * The local translation of the pawn relative to its parent. The value is a 3D vector. This value is read directly from the
     * spatial pawn's actor.
     * @public
     * @type {number[]}
     */
    get translation() {}

    /**
     * The local rotation of the pawn relative to its parent. The value is a quaternion. This value is read directly from the
     * spatial pawn's actor.
     * @public
     * @type {number[]}
     */
    get rotation() {}

    /**
     * The local scale of the pawn relative to its parent. The value is a 3D vector. This value is read directly from the
     * spatial pawn's actor.
     *
     * @public
     * @type {number[]}
     */
    get scale() {}

    /**
     * The local 4x4 transformation matrix. This is the pawn's transform relative to its parent, and is derived from its translation,
     * rotation, and scale. This value is read directly from the spatial pawn's actor.
     *
     * @public
     * @type {number[]}
     */
    get local() {}

    /**
     * The global 4x4 transformation matrix. This is the pawn's transform relative to world space,
     * taking into account its local transform and the local transforms of all of its parents.
     *
     * @public
     * @type {number[]}
     */
    get global() {}

   /**
     * By default, this is the same as [global]{@link AM_Spatial#global}. However you can override it if you want to add an additional transform
     * for a camera attached to the pawn. (For example, first-person avatars should override lookGlobal to let the user
     * look up and down without changing the pawn's facing.)
     * @public
     * @type {number[]}
     */
   get lookGlobal() {}

    /**
     * Fired when a spatial pawn's global transform matrix changes.
     * This is a separate event from [globalChanged]{@link event:globalChanged} because a pawn can update its global transform every frame
     * even if its actor updates less frequently. Use this event to drive things like updating the transform matrix of a render model.
     * @event PM_Spatial#viewGlobalChanged
     * @public
     * @global
     * @property {String} scope - actor.id
     * @property {String} event - `"viewGlobalChanged"`
     * @property {number[]} transform - 4x4 transform matrix
     * @example
     * this.listen("viewGlobalChanged", m => {console.log(m)}) // Prints the new matrix when it changes
     */
     viewGlobalChanged() {}

}

/**
 * Extends the [spatial actor mixin]{@link AM_Spatial} to support view-side interpolation. Smoothed actors generate extra interpolation information
 * when they receive movement commands. Their pawns use this to reposition themselves every frame. Setting translation/rotation/scale will
 * pop the actor to the new position. If you want the transition to be smoothed, use moveTo, rotateTo, or scaleTo instead.
 *
 * **Note:** AM_Smoothed does generate some  overhead. If the object is stationary, consider using
 * {@link AM_Spatial} instead.
 *
 * **Note** - AM_Smoothed must be paired with {@link PM_Smoothed} in the pawn.
 * @public
 * @worldcoremixin
 * @augments AM_Spatial
 * @example
 * class SmoothedActor extends mix(Actor).with(AM_Smoothed) {}
 */
 class AM_Smoothed extends AM_Spatial {

    /**
     * Tells the actor to move to a new xyz position. The actor moves immediately to the new translation, while its pawn smoothly interpolates
     * over the next few frames. If you want the pawn to pop the new position, set the actor's [translation]{@link AM_Spatial#translation} property
     * instead.
     *
     * **Note:** All movement is relative to the actor's parent.
     * @public
     * @param {number[]} translation - A 3-vector containing the new translation for the actor.
     */
    moveTo() {}

    /**
     * Tells the actor to rotate to a new orientation. The actor moves immediately to the new rotation, while its pawn smoothly interpolates
     * over the next few frames. If you want the pawn to pop the new position, set the actor's [rotation]{@link AM_Spatial#rotation} property
     * instead.
     *
     * **Note:** All movement is relative to the actor's parent.
     * @public
     * @param {number[]} rotation - A quaternion containing the new rotation for the actor.
     */
    rotateTo() {}

    /**
     * Tells the actor to scale to a new size. The actor transitions immediately to the new scale, while its pawn smoothly interpolates
     * over the next few frames. If you want the pawn to pop the new scale, set the actor's [scale]{@link AM_Spatial#scale} property
     * instead.
     *
     * **Note:** All movement is relative to the actor's parent.
     *
     * **Warning** - Do not set the scale to 0!
     * @public
     * @param {number[]} scale - A 3-vector containing the new scale for the actor.
     */
    scaleTo() {}

}

/**
 * Extends the [spatial pawn mixin]{@link AM_Spatial} to support view-side interpolation. Smoothed pawns interpolate their position every
 * frame, always converging on the "true position" contained by their actor. Use the smoothed mixins for continuously moving objects,
 * particularly if the actor or the session as a whole is running at a low tick rate.
 *
 * **Note:** PM_Smoothed does generate some  overhead. If the object is stationary, consider using
 * {@link PM_Spatial} instead.
 *
 * **Note** - PM_Smoothed must be paired with {@link AM_Smoothed} in the actor.
 * @public
 * @worldcoremixin
 * @augments PM_Dynamic
 * @augments PM_Spatial
 * @example
 * class SmoothedPawn extends mix(Pawn).with(PM_Smoothed) {}
 */
 class PM_Smoothed extends PM_Spatial {

    /**
    * The local translation of the pawn relative to its parent. The value is a 3D vector. This is the interpolated value. If you
    * want the actor's true value, use ```this.actor.translation```.
    * @public
    * @type {number[]}
    */
    get translation() {}

    /**
    * The local rotation of the pawn relative to its parent. The value is a quaternion. This is the interpolated value. If you
    * want the actor's true value, use ```this.actor.translation```.
    * @public
    * @type {number[]}
    */
    get rotation() {}

    /**
    * The local scale of the pawn relative to its parent. The value is a 3D vector. This is the interpolated value. If you
    * want the actor's true value, use ```this.actor.scale```.
    *
    * @public
    * @type {number[]}
    */
     get scale() {}

    /**
    * A value ranging from 0 to 1 that determines how quickly the pawn will converge on the actor's position during interpolation.
    * If it's set to 0, the pawn will never move at all. If the tug is set to 1,
    * the pawn will snap to the actor's current position every frame.
    *
    * A pawn's tug is a trade-off between smoothness and responsiveness. Higher tug values converge faster, but also more jittery, and vice versa.
    * @public
    * @default: 0.2
    * @type {number}
    * @example
    * class SmoothedPawn extends mix(Pawn).with(PM_Smoothed) {
    *       constructor(...args) {
    *           super(...args);
    *           this.tug = 0.02. // Converge slowly.
    *       }
    * }
    */
    get tug() {}

}


/**
 * Extends the [smoothed actor mixin]{@link AM_Smoothed} to create an avatar under direct user control. Movement commands
 * are routed through the pawn to the actor. The pawn speculatively executes these movement commands for a more
 * responsive user experience. (Otherwise the actor wouldn't respond until the command had made the round
 * trip through the reflector and back.)
 *
 * The pawn still converges on the actor's "true position", so if the pawn's speculative execution turns out to be
 * in error, it will automatically correct itself over the next few frames.
 *
 * Instead of setting an avatar actor's translation and rotation directly, avatar pawns usually set the actor's
 * velocity and spin instead. This allows the actor to update its own position during its tick, rather than
 * the pawn sending every position change through the reflector.
 *
 * **Note** - AM_Avatar must be paired with {@link PM_Avatar} in the pawn.
 * @public
 * @worldcoremixin
 * @augments AM_Smoothed
 * @example
 * class Avatar extends mix(Actor).with(AM_Avatar) {}
 */
 class AM_Avatar extends AM_Smoothed {
    /**
    * The frequency in milliseconds of the actor's tick method. Every tick the actor will apply its velocity and spin to adjust
    * its position. Generally, for a first-person avatar you want to leave this at its default of 15ms so that it runs every frame.
    * @public
    * @default 15
    * @type {number[]}
    */
     get tickStep() {}

   /**
    * The velocity of the actor in units/millisecond. Every tick the actor will move tickStep * velocity from its current position. The
    * velocity is a 3-vector.
    *
    * **Warning:** You usually shouldn't set an avatar's velocity directly. Instead let it be controlled automatically
    * by events from the avatar's pawn.
    * @public
    * @default [0,0,0]
    * @type {number[]}
    */
   get velocity() {}

   /**
    * The spin of the actor in radians/millisecond. Every tick the actor will rotate tickstep * spin from its current position. The spin
    * is a quaternion.
    *
    * **Warning:** You usually shouldn't set an avatar's spin directly. Instead let it be controlled automatically
    * by events from the avatar's pawn.
    * @public
    * @public
    * @default 15
    * @type {number[]}
    */
   get spin() {}

   /**
    * The actor's tick runs every tickStep milliseconds. It will use the actor's velocity and spin to automatically update the translation and rotation.
    * You can overload the tick method if the actor needs to perform other periodic updates.
    * @public
    * @default 15
    * @type {number[]}
    */
   tick(delta) {}
}

/**
 * Extends the [smoothed pawn mixin]{@link PM_Smoothed} to create an avatar under direct user control. Movement commands from the user are routed
 * through the pawn to the actor. The pawn speculatively executes these movement commands for a more
 * responsive user experience. (Otherwise the actor wouldn't respond until the command had made the round
 * trip through the reflector and back.)
 *
 * The pawn still converges on the actor's "true position", so if the pawn's speculative execution turns out to be
 * in error, it will automatically correct itself over the next few frames.
 *
 * Instead of setting an avatar actor's translation and rotation directly, avatar pawns usually set the actor's
 * velocity and spin instead. This allows the actor to update its own position during its tick, rather than
 * the pawn sending every position change through the reflector.
 *
 * **Note** - PM_Avatar must be paired with {@link AM_Avatar} in the actor.
 * @public
 * @worldcoremixin
 * @augments PM_Smoothed
 * @property {number} moveThrottle=15 - The number of milliseconds between [throttled move events]{@link PM_Avatar#throttledMoveTo}.
 * @property {number} rotateThrottle=50 - The number of milliseconds between [throttled rotate events]{@link PM_Avatar#throttledRotateTo}.
 * @example
 * class AvatarPawn extends mix(Pawn).with(PM_Avatar) {}
 */
 class PM_Avatar extends PM_Smoothed {

   /**
    * Sends an event through the reflector telling the actor to move to a new position. The pawn will speculatively perform the same move
    * under the assumption that the actor will successfully complete it.
    *
    * **Note:** If you're frequently calling moveTo(), consider using
    * [throttledMoveTo()]{@link PM_Avatar#throttledMoveTo} instead to avoid flooding the reflector with events.
    * @public
    * @param {number[]} translation
    * @example
    * myAvatarPawn.moveTo([10,0,0]);
    */
   moveTo(v) {
  }

   /**
    * The same as [moveTo()]{@link PM_Avatar#moveTo}, but limits the number of events that are sent to the reflector. The frequency of the
    * throttled events is determined by the [moveThrottle]{@link PM_Avatar}
    * @public
    * @param {number[]} translation
    * @example
    * myAvatarPawn.throttledMoveTo([10,0,0]);
    */
  throttledMoveTo(v) {
      if (this.time < this.lastMoveTime + this.moveThrottle) {
          this._translation = v;
          this.lastMoveCache = v;
      } else {
          this.lastMoveTime = this.time;
          this.lastMoveCache = null;
          this.say("avatarMoveTo", v);
      }
  }

   /**
    * Sends an event through the reflector telling the actor to rotate to a new position. The pawn will speculatively perform the same rotation
    * under the assumption that the actor will successfully complete it.
    *
    * **Note:** If you're frequently calling rotateTo() , consider using
    * [throttledRotateTo()]{@link PM_Avatar#throttledRotateTo} instead to avoid flooding the reflector with events.
    * @public
    * @param {number[]} rotation
    * @example
    * myAvatarPawn.rotateTo(q_axisAngle([1,0,0], toRad(45))); // Rotate to 45 degrees around the x axis.
    */
   rotateTo(q) {}

   /**
    * The same as [rotateTo()]{@link PM_Avatar#rotateTo}, but limits the number of events that are sent to the reflector. The frequency of the
    * throttled events is determined by the [rotateThrottle]{@link PM_Avatar}
    * @public
    * @param {number[]} rotation
    * @example
    * myAvatarPawn.throttledRotateTo(q_axisAngle([1,0,0], toRad(45))); // Rotate to 45 degrees around the x axis.
    */
  throttledRotateTo(q) {}

   /**
    * Sends an event through the reflector setting the actor's velocity in xyz units per millisecond. Both the actor and the
    * pawn will then move at this velocity every tick/frame. The pawn's movement will be speculative under the assumption that
    * it's matching the actor, but if the actor does something else, the pawn will smoothly blend to the actor's true position.
    *
    * **Note:** Try to use setVelocity() whenever possible instead of [moveTo()]{@link PM_Avatar#moveTo}. It's a much more
    * efficient way for the pawn to control the actor.
    *
    * @public
    * @param {number[]} velocity 3-vector in units per millisecond
    * @example
    * myAvatarPawn.setVelocity([10,0,0]);
    */
  setVelocity(v) {}

     /**
    * Sends an event through the reflector setting the actor's spin in radians per millisecond. Both the actor and the
    * pawn will then rotate at this spin every tick/frame. The pawn's rotation will be speculative under the assumption that
    * it's matching the actor, but if the actor does something else, the pawn will smoothly blend to the actor's true position.
    *
    * **Note:** Try to use setSpin() whenever possible instead of [rotateTo()]{@link PM_Avatar#rotateTo}. It's a much more
    * efficient way for the pawn to control the actor.
    *
    * @public
    * @param {number[]} spin quaternion in radians per millisecond
    * @example
    * myAvatarPawn.setSpin(q_axisAngle([1,0,0], toRad(2))); // Rotate at 2 radians per millisecond around the x axis.
    * myAvatarPawn.setSpin(q_identity()); // Stop the rotation
    */setSpin(q) {}

}

/**
 * Extends the [avatar actor mixin]{@link AM_Avatar} to separate rotation into pitch and yaw components. Yaw is used to
 * control the avatar's facing. Pitch is ignored when calculating facing, but is used with yaw to determine camera direction.
 *
 * **Note** - AM_Avatar must be paired with {@link PM_MouselookAvatar} in the pawn.
 *
 * @public
 * @worldcoremixin
 * @augments AM_Avatar
 * @example
 * class MouselookAvatarActor extends mix(Actor).with(AM_MouselookAvatar) {}
 */
 class AM_MouselookAvatar extends AM_Avatar {

   /**
    * The pitch angle of the avatar in radians. Pitch is ignored in determining the actor's facing, but affects
    * camera direction.
    *
    * **Warning:** You usually shouldn't set the avatar's lookPitch directly. Instead let it be controlled automatically
    * by events from the avatar's pawn.
    * @public
    * @type {number}
    */
   get lookPitch() {}

   /**
    * The yaw angle of the avatar in radians. Yaw is used to determine the actor's facing.
    *
    * **Warning:** You usually shouldn't set the avatar's lookYaw directly. Instead let it be controlled automatically
    * by events from the avatar's pawn.
    * @public
    * @type {number}
    */
  get lookYaw() {}

 }

 /**
 * Extends the [avatar pawn mixin]{@link PM_Avatar} to break rotation into separate pitch and yaw components. Yaw is used to
 * control the avatar's facing. Pitch is ignored when calculating facing, but is used with yaw to determine camera direction.
 *
 * **Note** - PM_MouselookAvatar must be paired with {@link AM_MouselookAvatar} in the actor.
 * @public
 * @worldcoremixin
 * @augments PM_Avatar
 * @property {number} lookThrottle=50 - The number of milliseconds between [throttled look events]{@link PM_Avatar#throttledLookTo}.
 * @example
 * class MouseLookAvatarPawn extends mix(Pawn).with(PM_MouselookAvatar) {}
 */
  class PM_MouselookAvatar extends PM_Avatar {

    /**
    * The pitch angle of the avatar in radians. Pitch is ignored in determining the avatar's facing, but affects
    * camera direction. This is the pawn-side value and is interpolated every frame.
    * @public
    * @type {number}
    */
   get lookPitch() {}

   /**
    * The yaw angle of the avatar in radians. Yaw is used to determine the actor's facing. This is the pawn-side value and
    * is interpolated every frame.
    *
    * @public
    * @type {number}
    */
  get lookYaw() {}

   /**
    * Sends an event through the reflector telling the actor to rotate to a new position. The pawn will speculatively perform the same rotation
    * under the assumption that the actor will successfully complete it. The rotation is specified using separate pitch and yaw values. Only
    * the yaw value controls the facing of the avatar, but the pitch and yaw are combined to determine camera facing.
    *
    * **Note:** If you're frequently calling lookTo() , consider using
    * [throttledLookTo()]{@link PM_Avatar#throttledLookTo} instead to avoid flooding the reflector with events.
    * @public
    * @param {number} pitch in radians
    * @param {number} yaw in radians
     */
    lookTo(pitch, yaw) {}

    /**
     * The same as [lookTo()]{@link PM_Avatar#LookTo}, but limits the number of events that are sent to the reflector. The frequency of the
     * throttled events is determined by the [lookThrottle]{@link PM_MouselookAvatar}
     * @public
     * @param {number} pitch in radians
    * @param {number} yaw in radians
     */
   throttledLookTo(pitch, yaw) {}

  }

