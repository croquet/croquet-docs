/**
 * Dynamic pawns have an update method that is called every frame by {@link ViewRoot}. Make
 * a pawn dynamic if it needs to do something every frame. (for example, interpolate its position.)
 *
 * @public
 * @class
 * @mixin
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
 * @mixin
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
 * The abstract base class for mixins that organize [pawns] {@liink Pawn} into hierarchical trees.
 * (For example, a scene graph.) The pawn automatically updates its parent to
 * be the pawn associated with its actor's parent.
 *
 * **Note** - PM_Tree must be paired with {@link AM_Tree} in the actor.
 * @public
 * @mixin
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
 * @mixin
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
     * **Warning** - Do NOT set this matrix directly. Set the indpendent translation, rotation, and scale components
     * and let the actor combine them to get the local matrix.
     * @public
     * @type {number[]}
     */
    get local() {}

    /**
     * The global 4x4 transformation matrix. This is the actor's transform relative to world space,
     * taking into account its local transform and the local transforms of all of its parents.
     *
     * **Warning** - Do NOT set this matrix directly. Set the indpendent translation, rotation, and scale components
     * and let the actor combine them to get the global matrix.
     * @public
     * @type {number[]}
     */
    get global() {}

    /**
     * Fired when the spatial actor's translation changes. Data is a 3-vector holding the actor's new translation.
     * @name translationChanged
     * @event AM_Spatial#translationChanged
     * @returns {number[]}
     * @public
     * @example
     * this.listen("translationChanged", v => {console.log(v)}) // Prints the new translation when it changes
     */
    translationChanged() {}

    /**
     * Fired when the spatial actor's rotation changes. Data is a quaternion holding the actor's new rotation.
     * @event AM_Spatial#rotationChanged
     * @returns {number[]}
     * @public
     * @example
     * this.listen("rotationChanged", q => {console.log(q)}) // Prints the new rotation when it changes
     */
    rotationChanged() {}

     /**
     * Fired when the spatial actor's scale changes. Data is a 3-vector holding the actor's new scale.
     * @event AM_Spatial#scaleChanged
     * @returns {number[]}
     * @public
     * @example
     * this.listen("scaleChanged", v => {console.log(v)}) // Prints the new scale when it changes
     */
    scaleChanged() {}

    /**
     * Fired when the spatial actor's local transform matrix changes. Data is a 4x4 matrix holding the actor's new local transform.
     * @event AM_Spatial#localChanged
     * @returns {number[]}
     * @public
     * @example
     * this.listen("localChanged", m => {console.log(m)}) // Prints the new matrix when it changes
     */
    localChanged() {}

    /**
     * Fired when the spatial actor's global transform matrix changes. Data is a 4x4 matrix holding the actor's new global transform.
     * @event AM_Spatial#globalChanged
     * @returns {number[]}
     * @public
     * @fires [viewGlobalChanged]{@link PM_Spatial#viewGlobalChanged}
     * @example
     * this.listen("globalChanged", m => {console.log(m)}) // Prints the new matrix when it changes
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
 * @mixin
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
     * The global 4x4 transformation matrix. This is the pawns's transform relative to world space,
     * taking into account its local transform and the local transforms of all of its parents.
     *
     * @public
     * @type {number[]}
     */
    get global() {}

    /**
     * Fired when the spatial pawn's global transform matrix changes. Data is a 4x4 matrix holding the new global transform.
     * This is a separate event from [globalChanged]{@link AM_Spatial#event:globalChanged} because a pawn can update its global transform every frame
     * even if its actor updates less frequently. Use this event to drive things like updating the transform matrix of a render model.
     * @event PM_Spatial#viewGlobalChanged
     * @returns {number[]}
     * @public
     * @example
     * this.listen("viewGlobalChanged", m => {console.log(m)}) // Prints the new matrix when it changes
     */
     viewGlobalChanged() {}

}

/**
 * Extends a [spatial actor]{@link AM_Spatial} to support view-side interpolation. Smoothed actors generate extra interpolation information
 * when they receive movement commands. Their pawns use this to reposition themselves every frame. Setting translation/rotation/scale will
 * pop the actor to the new position. If you want the transition to be smoothed, use moveTo, rotateTo, or scaleTo instead.
 *
 * **Note:** AM_Smoothed does generate some  overhead. If the obejct is stationary, consider using
 * {@link AM_Spatial} instead.
 *
 * **Note** - AM_Smoothed must be paired with {@link PM_Smoothed} in the pawn.
 * @public
 * @mixin
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
 * Extends a [spatial pawn]{@link AM_Spatial} to support view-side interpolation. Smoothed pawns interpolate their position every
 * frame, always converging on the "true position" contained by their actor. Use the smoothed mixins for continuously moving objects,
 * particularly if the actor or the session as a whole is running at a low tick rate.
 *
 * **Note:** PM_Smoothed does generate some  overhead. If the object is stationary, consider using
 * {@link PM_Spatial} instead.
 *
 * **Note** - PM_Smoothed must be paired with {@link AM_Smoothed} in the actor.
 * @public
 * @mixin
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
 * Extends a [smoothed actor]{@link AM_Smoothed} to create an avatar under direct user control. Movement commands
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
 * @mixin
 * @augments AM_Smoothed
 * @example
 * class Avatar extends mix(Actor).with(AM_Avatar) {}
 */
 class AM_Avatar extends AM_Smoothed {

    /**
    * The local translation of the pawn relative to its parent. The value is a 3D vector. This is the interpolated value. If you
    * want the actor's true value, use ```this.actor.translation```.
    * @public
    * @type {number[]}
    */
     get translation() {}
}

