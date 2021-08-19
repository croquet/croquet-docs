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
 * Gives [actors]{@link Actor} a spatial position with translation, rotation and scale.
 *
 * **Note** - AM_Spatial must be paired with {@link PM_Spatial} in the pawn.
 * @public
 * @mixin
 * @mixes AM_Tree
 * @example
 * class SpatialActor extends mix(Actor).with(AM_Spatial) {}
 */
 class AM_Spatial extends AM_Tree {

    /**
     * The local translation of the actor relative to its parent. The value is a 3D vector.
     * @public
     * @default [0,0,0]
     * @type {number[]}
     * @example
     * spatialActor.set({translation: [1,0,0]}); // Translate this actor one unit in the X direction from its parent.
     */
    get translation() {}

    /**
     * The local rotation of the actor relative to its parent. The value is a quaternion.
     * @public
     * @default [0,0,0,1]
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

}


