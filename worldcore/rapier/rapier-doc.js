/**
 * The Rapier physics manager is a model-side service with the public name "RapierPhysicsManager".
 * It creates a Rapier world to manage a physics simulation using Worldcore objects. Actors can add
 * the {@link PM_RapierPhysics} mixin to give them access to the simulation. Objects in the simulation
 * will automatically have their physics state synched and snapshotted.
 *
 * When it's created, the physic manager can be passed an options object containing the gravity vector in
 * meters/second, and how often the simulation will run in milliseconds.
 *
 * ```
 * class MyModelRoot extends ModelRoot {
 *   static modelServices() { return [{service: RapierPhysicsManager, options: {gravity: [0,-9.8, 0], timeStep: 15}}] }
 * }
 * @public
 * @augments ModelService
 * @param {Object} [options] - An optional option object.
 * @property {Object} world - The Rapier world.
 */
 class RapierPhysicsManager {
}

/**
 * Provides an actor with an interface to the [Rapier physics simulation]{@link RapierPhysicsManager}.
 *
 * Allows you to create a rigid body to track the object's position, and attach colliders to it.
 * An object may only have one rigid body as a time, but can have multiple colliders.
 *
 * **Note:** Only kinematic rigid bodies listen for Worldcore movement events.
 * Other types of rigid bodies (static, dynamic) **should not** have their positions changed after they are created. Static
 * rigid bodies don't move, and the position of dynamic rigid bodies is controlled by the simulation.
 * @public
 * @listens setTranslation
 * @listens setRotation
 * @listens moveTo
 * @listens rotateTo
 * @worldcoremixin
 * @example
 * class MyActor extends mix(Actor).with(AM_RapierPhysics) {}
 */
 class AM_RapierPhysics {

   /**
    * Returns the Rapier rigid body attached to this Wordcore object.
    * @public
    * @returns{*} rigid body
    */
    get rigidBody() {}

    /**
     * Create a new rigid body for this object. Deletes any previous rigid body and its attached colliders.
     * An object can only have one rigid body at a time. The position of the rigid body is taken from the position
     * of the object at the moment that it's created.
     * Takes as its argument a Rapier rigid body description (see the Rapier docs for more information.)
     *
     * Supported types:
     * * Static - Doesn't move
     * * Dynamic - Position controlled by simulation
     * * KinematicPositionBased - Position controlled by user
     *
     * @param {RigidBodyDesc} rigidBodyDesc - A Rapier rigid body description.
     * @public
     * @example
     * this.createRigidBody(RAPIER.RigidBodyDesc.newDynamic());
     */
    createRigidBody(rigidBodyDesc) {}

    /**
     * Deletes the object's current rigid body and any attached colliders. Called automatically when
     * the actor is destroyed.
     * @public
     */
    removeRigidBody() {}

    /**
     * Create a new collider and attaches it to the object's rigid body. Objects can have multiple
     * colliders at the same time.
     * Takes as its argument a Rapier collider description (see the Rapier docs for more information.)
     * @public
     * @param {ColliderDesc} colliderDesc
     * @example
     * const cd = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
     * cd.setRestitution(0.5);
     * cd.setFriction(0.8);
     * cd.setDensity(2.5);
     * this.createCollider(cd);
     *
     */
    createCollider(colliderDesc) {}

 }
