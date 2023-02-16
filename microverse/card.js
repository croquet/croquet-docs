/**
A card in Croquet Microverse is represented with a class called CardActor on the Croquet's Model side, and CardPawn on the Croquet's View side.

An instance of CardActor and CardPawn can have a list of behaviors. Each of such behavior can use the features provided by the CardActor or CardPawn to which it is attached. For example, A CardActor implements a method called `createCard()`, which takes a card spec and creates a new card and place it in the world. A behavior can simply call:

```JavaScript
  this.createCard({...});
```

to invoke the feature of the CardActor.

 This document shows all public methods on CardActor and CardPawn that can be used from your behaviors.

Also, properties of CardActor or CardPawn can be read and written in a simple form:

```JavaScript
let a = this.foo;
```

or

```JavaScript
this.foo = 42;
```

Note that multiple behaviors installed to the same CardActor (or CardPawn) share the same property.

Microverse uses the vector types defined in the Worldcore library. Those vectors are actually simple JavaScript Array. In the description below, the representation of `Vector3` and `Quatanion` are:

`type Vector3 = [<number>, <number, <number>]`

`type Quaternion = [<number>, <number, <number>, <number>]`

Some rotation related methods take an array with 3 elements as an Euler angle. Internally it converts the Euler angle to a Quaternion. Thus they may take a union of `Quaternion` or `Vector3` as a generic rotation argument.

`type Rotation = Quaternion|Vector3`

Also, the Card can handle certain kinds of pointer events. The EventName type is defined as:

`type EventName = "pointerDown"|"pointerUp"|pointerMove"|"pointerTap"|"pointerLeave"|"pointerEnter"|"wheel"|"doubleDown"|"click"|"keyUp"|"keyDown"`

The `pointerTap` event, only one synthesized event type, is generated when a `pointerUp` event occurs close in time (< 300ms) and space (< 10 pixels) to the corresponding `pointerDown` event. Then first the `pointerTap` event is sent before the `pointerUp`.

  @public
  @hideconstructor
*/
class CardActor {
    /**
The [x, y, z] translation of the card.

        @public
        @type Vector3
    */
    get _translation() {}

    /**
The rotation of the card in quaternion.
       @public
       @type Quaternion
    */
    get _rotation() {}

    /**
The scale of the card in three axes.
       @public
       @type Vector3
    */
    get _scale() {}

    /**
       The layers property specifies how the card is treated when a special action is taken. Typical value are as follows:

- "walk": The avatar stays on the geometry of the card.
- "pointer": The pointer action is enabled.
- "portal": the avatar tests if the card it is going through needs to take the avatar to a connected world.

       @public
       @type Array

    */
    get _layers() {}

    /**
       The cards in the world are organized in a hierarchical parent-children structure. The `_parent` specifies its parent. Note that this is a "logical" structure. All cards are held as a direct child of the Three.JS scene, with automatic matrix composition for nested cards.

       @public
       @type CardActor
    */
    get _parent() {}

    /**
       The list of behavior modules installed to the card.

       @public
       @type Array

    */
    get _behaviorModules() {}

    /**
       An informative string for the card.

       @public
       @type string
    */
    get _name() {}

    /**
       Any other values that the CardActor holds are stored in an object stored in the `_cardData` property. This is needed to mark the values to be stored in the persistent data.

       @public
       @type Object
    */
    get _cardData() {}

    /**
       This method creates a new card (a CardActor on the model side and a CardPawn on the view side), based on the `cardSpec`.

       @public
       @param {object} data - the spec for a card to be created.
       @returns {CardActor} the CardActor created.
    */
    createCard(data) {}

    /**
       This method removes the card from the world. All `teardown()` method of installed pawn behaviors and actor behaviors are called before the CardActor is removed from the system.

       @public
    */
    destroy() {}

    /**
       This method invokes a method of another behavior. The `behaviorName` has to be in one of the form of:

- "*ModuleName*$*BehaviorName*"
- "*BehaviorName*"

When the first form is used, it specifies the globally known module name and the behavior with the name on the actor side of the module.  When the second form is used, it specified the behavior in the same module as the calling behavior.

       * The `methodName` is the name of the method, and `values` are variable-length arguments for the method.

       @public
       @param {string} behaviorName - name of the behavior
       @param {string} methodName - name of the method
       @param {any} ...arguments - arguments for the method
       @returns {any} the return value from the method
    */
    call(behaviorName, methodName, ...args) {}

    /**
       This method schedules a future call in the specified logical time in milliseconds. If it is used in this form:

`this.future(20).mth();`

`mth` of the same behavior will be invoked 20 milliseconds from logical `now`. If you would like to call a method of another module or behavior, you can use `call()`:

`this.future(20).call("Module$Behavior", "mth");`

       @public
       @param {number} time - the delay in logical millisecond
       @returns A proxy to invoke a method on
    */
    future(time) {}

    /**
       This method updates some elements in the `_cardData` object. The current value and the new values are merged to create the new `_cardData` object. As a side effect, it publishes `cardDataSet` Croquet event that can be handled by the pawn or any other subscribers.

       @public
       @param {object} options - keys and values to specify new values

    */
    setCardData(options) {}

    /**
This method adds a "listener" to be invoked when an event occurs on the card.  When `listener` is a function, it has to have a form of `this.mthName` where `mthName` is an existing method name of CardActor or the behavior itself. When listener is a string, it has to be the name of a method at CardActor or the behavior itself. The listener added by this Actor-side `addEventListener()` is invoked when any user in the world causes the corresponding user pointer or key event.

Calling this method with the same arguments removes the previous listener before adding the new one. This semantics ensures that dynamically-modified method will be used.

       @public
       @param {EventName} eventType - the event type
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
    */
    addEventListener(eventName, listener) {}

    /**
This method removes the event listener that was added. You can call it when there is no matching event listener.

       @public
       @param {EventType} eventName - the event type
       @param {string|function} listener
    */
    removeEventListener(eventName, listener) {}

    /**
       This method adds a Croquet event subscription. Unlike the version in the Croquet Library, this version removes the subscription with the same `scope` and `eventName` if it exists before adding the new one. This semantics ensures that it is safe to call this from the `setup()` of a behavior.

       @public
       @param {string} scope - the scope of Croquet event
       @param {string} eventName - the event name of Croquet event
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
    */
    subscribe(scope, eventName, listener) {}

    /**
       This method publishes a Croquet event.

       @public
       @param {string} scope - the scope of Croquet event
       @param {string} eventName - the event name of Croquet event
       @param {any} data - serializable data to be published
    */
    publish(scope, eventName, data) {}

    /**
       This method adds a Croquet event subscription by calling the `subscribe()` method with `this.id` as the `scope`.

       @public
       @param {string} eventName - the event name of Croquet event
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
    */
    listen(eventName, listener) {}

    /**
       This method publishes a Croquet event with `this.id` as the `scope`. It is usually used to publish an event whose expect recipient is the corresponding CardPawn.

       @public
       @param {string} eventName - the event name of Croquet event
       @param {any} data - serializable data to be published
    */
    say(eventName, data) {}

    /**
       This method adds a new element to the `layers` array. If `newLayerName` is already in the `layers` array, the call does not have any effects.

       @public
       @param {string} newLayerName - the name of a later to be added
    */
    addLayer(newLayerName) {}

    /**
       This method removes an element from the `layers` array. If `layerName` is not in the `layers` array, the call does not have any effects.

       @public
       @param {string} layerName - the name of a later to be removed
    */
    removeLayer(layerName) {}

    /**
This method moves the translation of the card to the specified `[x, y, z]` coordinates.
       @public
       @param {Vector3} v - the translation for the card
    */
    translateTo(v) {}

    /**
When rot is a 4 element array, it is interpreted as a quaternion.
When rot is a 3 element array, it is interpreted as an Euler angle.
When rot is a number, it is interpreted as [0, rot, 0].

This method sets the rotation of the card to the specified by the argument.
       @public
       @param {Rotation|number} rot - the rotation for the card
    */
    rotateTo(rot) {}

    /**
When s is a number, it is interpreted as `[s, s, s]`.
This method sets the scale of the card to the specified by scale factors in [x, y, z] axis.

       @public
       @param {Vector3|number} s - the scale for the card
    */
    scaleTo(s) {}

    /**
This method sets the translation and rotation of the card, making sure that those two values are used in the same logical time and used for the rendering.

       @public
       @param {Vector3} v - the translation for the card
       @param {Quaternion} q - the rotation for the card
    */
    positionTo(v, q) {}


    /**
This method moves the translation of the card by the specified `[x, y, z]` vector.
       @public
       @param {Vector3} v - the translation offset
    */
    translateBy(v) {}

    /**
When rot is a 4 element array, it is interpreted as a quaternion.
When rot is a 3 element array, it is interpreted as an Euler angle.
When rot is a number, it is interpreted as [0, rot, 0].

This method combines the rotation of the card by the specified rotation.
       @public
       @param {Rotation|number} rot - the additional rotation for the card
    */
    rotateBy(rot) {}

    /**
When s is a number, it is interpreted as [s, s, s].
This method multiplies the scale of the card by the specified by scale factors in [x, y, z] axis.

       @public
       @param {Vector3} s - the scale offset
    */
    scaleBy(s) {}

    /**
When v is a number, it is interpreted as [0, 0, v].

This method translates the object by `the specified offset, in the reference frame of the object.
       @public
       @param {Vector3|number} v - the offset
    */
    forwardBy(v) {}

    /**
A Three.js keyframe based animation is supported. The animation clip can contain multiple tracks. The index specified here dictates which track to play. A cardData called animationStartTime specifiy the base for time offset.

@public
@param {number} animationClipIndex - the index into animation tracks array
    */

    setAnimationClipIndex(animationClipIndex) {}

    /**
       This method is empty. It is used to have a way to get the tap to focus keyboard events but you don't need to take any particular action on tap.

       @public
    */
    nop() {}
}

/**
CardPawn is the view side implementation of the Card.

The corresponding actor for a CardPawn is accessible by `this.actor`. You can read a value in `_cardData` simply by `this.actor._cardData.prop`. But note that a pawn should never modify the state of the actor.

The most important property of CardPawn is `shape`, which is a Three.JS `Group`, and the Micorverse system treats it as the primary visual representation of the card. Customizing the visual appearance of a card means to create a new Three.JS Object3D and add it to `shape`.

When the Card's type is "2d", and it has some `textureType`, the texture object is stored in `this.texture`.  If the `textureType is "canvas", the DOM canvas is stored in `this.canvas` so a pawn behavior can paint into the canvas.

@public
@hideconstructor
*/

class CardPawn {
    /**
       This method invokes a method of another behavior. The `behaviorName` has to be in one of the form of:

- "*ModuleName*$*BehaviorName*"
- "*BehaviorName*"

When the first form is used, it specifies the globally known module name and the behavior with the name on the actor side of the module.  When the second form is used, it specified the behavior in the same module as the calling behavior.

The `methodName` is the name of the method, and `values` are variable-length arguments for the method.

       @public
       @param {string} behaviorName - the name of the behavior that has the metho
       @param {string} methodName - the name of the method
       @param {any} values - arguments for the method
       @returns any
    */
    call(behaviorName, methodName, ...values) {}

    /**
       This method invokes a method on the corresponding actor. It is expected that the method to be invoked does not alter the state of the actor, but only reads a property or synthesizes a value from properties.

       * The `behaviorName` has to be a name of an actor behavior in the same module.

       * `actorCall()` is used as you cannot invoke an intended method by a simple invocation syntax:

`let foo = aPawn.actor.getFoo();`

because the behavior that has `getFoo()` is not specified. If `getFoo()` is defined by an actor behavior with the name `FooActor`, you can call it by

`let foo = aPawn.actorCall("FooActor", "getFoo");`

Make sure that the actor's method called from the pawn does not modify the state of the model in any way.

       @public
       @param {string} behaviorName - the name of the behavior that has the method
       @param {string} methodName- the name of the method
       @param {any} values - arguments for the method
    */

    actorCall(behaviorName, methodName, ...values) {}

    /**
       This method schedules a future call in roughly the specified wall time in milliseconds. If it is used in this form:

`this.future(20).mth();`

mth` of the same behavior will be invoked. If you would like to call a method of another module or behavior, you can use `call()`:

       @example this.future(20).call("Module$Behavior", "mth");

       @public
       @returns a proxy to call a method on
       @param {number} time - the wall clock time to delay the method invocatino.
    */
    future(time) {}

    /**
This method adds a "listener" to be invoked when an event occurs on the pawn of a card. When `listener` is a string, it has to have the name of an existing method of CardPawn or the behavior itself. (Internally the function object is stored in the event listener data structure.)

Calling this with the same arguments (thus the string form) removes the previous listener and then add the new one. This semantics ensures that dynamically-modified method will be used.

       @public
       @param {EventName} eventName - the event name of Croquet event
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
    */

    addEventListener(eventName, listener) {}

    /**
This method removes the event listener that was added. You can call it even when there is no matching event listener.

       @public
       @param {EventName} eventName - the event name of Croquet event
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
    */

    removeEventListener(eventName, listener) {}

    /**
       This method adds Croquet event subscription. Unlike the version in the Croquet Library, this version removes the subscription with the same `scope` and `eventName` if it exists before adding a new one; so that it is safe to call this from the `setup()` of a behavior.

       * The `listener` can be either a function or a string in the form of:

- "*ModuleName*$*BehaviorName*.*methodName*"
- "*BehaviorName*.*methodName*"
- "*methodName*"

       @public
       @param {string} scope - the scope name of Croquet event
       @param {string} eventName - the event name of Croquet event
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
       */

    subscribe(scope, eventName, listener) {}

    /**
       This method publishes a Croquet event.

       @public
       @param {string} scope - the scope of Croquet event
       @param {string} eventName - the eventName of Croquet event
       @param {anyf} data - serializable data to be published
    */

    publish(scope, eventName, data) {}

    /**
       This method add a Croquet event subscription by calling the `subscribe()` method with `this.actor.id` as the `scope`.

       @public
       @param {string} eventName - the eventName of Croquet event
       @param {string|function} listener - the name of the handler in the calling behavior, or a function specified in the form of `this.mth`
    */

    listen(eventName, listener) {}

    /**
       This method publishes a Croquet event with `this.actor.id` as its `scope`.

       @public
       @param {string} eventName - the eventName of Croquet event
       @param {any} data - serializable data to be published
    */

    say(eventName, data) {}

    /**
       This method returns the AvatarPawn of the local client. Recall that the notion of "my" avatar only exists on the view side. The model side treats all avatars equally, even the one that is associated with the local computer. This is why this method is on the pawn side, and returns the AvatarPawn.

       @public
       @returns {AvatarPawn} The local AvatarPawn
    */

    
    getMyAvatar() {}

    /**
       A pawn behavior may request a method callback when CardPawn's `update()` method is invoked. behaviorName and methodName will be "registered in the pawn, and for each `update()` call, the behavior method is invoked.

       *the argument is an array of the behavior name and the method to be called: `type BehaviorMethod = Array<behaviorName, methodName>`.

       @public
       @param {BehaviorMethod} array - a two element array with behavior name and method name
    */
       
    addUpdateRequest(array) {}

    /**
       This method creates a flat card like Three.JS geometry in specified in `width`, `height`, `depth`, and `cornerRadius`.

       @public
       @param {number} width - width of the geometry (in meters)
       @param {number} height - height of the geometry (in meters)
       @param {number} depth - depth of the geometry (in meters)
       @param {number} cornerRadius - radius of the corners of the geometry (in meters)
       @returns {Geometry} THREE.Geometry created
    */

    roundedCornerGeometry(width, height, depth, cornerRadius) {}

    /**
`type PlaneMaterial = Material|Array<Material>`

This method creates a Three.JS material that can be used with the geometry created by `roundedCornerGeometry()`. When the depth is non-zero, thus it is expected that the geometry from `roundedCornerGeometry()` has "sides", this method returns an array of materials with `color` and `frameColor`. Otherwise, it return a material with `color`.

       @public
       @param {number} depth - depth of the geometry (in meters)
       @param {number} color - the surface color for the material
       @param {number} frameColor - the frame color for the material if depth is non-zero
       @param {boolean} fullBright - if the material should ignore shaadows.
       @returns {PlaneMaterial}
    */

    makePlaneMaterial(depth, color, frameColor, fullBright) {}

    /**
This method publishes an event to set the corresponding actor's translation.

       @public
       @param {Vector3} v - the translation to be used by corresponding actor
    */

    translateTo(v) {}

    /**
This method publishes an event to set the corresponding actors's rotation.

       @public
       @param {Quaternion} q - the rotation to be ued by corresponding actor
    */

    rotateTo(q) {}

    /**
This method publishes an event to set the corresponding actors's rotation.

       @public
       @param {Vector3} s the scale to be used by the corresponding actor
    */

    scaleTo(s) {}

    /**
This method publishes an event to set the corresponding actors's translation and rotation. It guarantees that two values are sent in one message, thus causes both to be updated at the same time.

       @public
       @param {Vector3} v  - the translation to be used by corresponding actor
       @param {Quaternion} q - the rotation to be ued by corresponding actor
    */

    positionTo(v, q) {}

    /**
       In order for the avatar to walk on a three-dimensional model, the 3D model needs to have the bounded volume hierarchy structure attached. This method has to be called to make a 3D object that is created in the pawn-side behavior.

       @public
       @param {Object3D} obj
    */

    constructCollider(obj) {}

    /**
       If the card has an associated collider object, it will be removed. If there is no collider object, this method does not take any effects.

       * A typical use case of `constructCollider()` and `cleanupColliderObject()` in a pawn-side behavior is as follows in its `setup()` method:

       @public
       @example
this.cleanupColliderObject()
if (this.actor.layers && this.actor.layers.includes("walk")) {
    this.constructCollider(this.floor);
    // where this.floor is a Three.js Mesh with geometry.
 }
    */

    cleanupColliderObject() {}

    /**
       This method is empty. It is used to have a way to get the tap to focus keyboard events but you don't need to take any particular action on tap.

       @public
    */

    nop() {}
}
