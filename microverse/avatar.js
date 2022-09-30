/**
The "avatar" of Croquet Microverse handles user interaction such as mouse and keyboard. It also manages the "camera" of the 3D scene. The avatar is iamplemented as a special kind of [card](./Card.md). The default listeners for user interaction, such as the WASD key and pointer navigation, Ctrl-Click editting etc. are specified in a behavior module so that you can override them from your behavior. You can also attach some other behaviors to add world-specific features.

The base actor class of the avatar is called AvatarActor, and the base pawn class is called AvatarPawn. Because it is a card, its visual appearance is specified in the same way for a 3D model-type card.

Other participants' avatars shown in the session are also cards; but they use a different kind of AvatarPawn called RemoteAvatarPawn.

The following shows the publicly useful methods of Avatar classes. Microverse uses the vector types defined in the Worldcore library. Those vectors are actually simple JavaScript Array. In the description below, the representation of `Vector3` and `Quatanion` are:

`type Vector3 = [<number>, <number, <number>]`

`type Quaternion = [<number>, <number, <number>, <number>]`

`type Matrix4 = [<number> x 16]`

*/

/**
AvatarActor implements the model-side features of the avatar.

@public
@hideconstructor

*/

class AvatarActor {

    /**
       The avatar's camera rotation around the X axis (the axis going from left to right; thus a positive value indicates to look "up" ,and a negative value indicates to look "down".)

To get desired effects, use the set method:

`this.set({lookPitch: n})

Typically you would set lookPitch and lookYaw at the same time:

`this.set({lookPitch: m, lookYaw: n})`

@public
@type number
    */

    get lookPitch() {}

    /**
The avatar's camera rotation around the Y axis in the scene (the axis going from bottom to top; thus a positive value indicates to look east, and a negative value indicates to look west.

To get desired effects, use the `set()` method:

`this.set({lookYaw: n})`

Typically you would set lookPitch and lookYaw at the same time:

`this.set({lookPitch: m, lookYaw: n})`

@public
@type number
    */

    get lookYaw() {}

    /**
The offset in 3D coordinates between avatar's position and the camera's position. A typical third person view behind the avatar has [0, p, p], where p is a positive number.

While those three variables are used in the default `walkLook()` implementation, you can override the method to have a totally custom camera position. (see below.)

@public
@type Vector3
    */

    get lookOffset() {}

    /**
Glide to the specified position and rotation in the global coordinate. The fall flag specifies whether the avatar should start falling to the ground or not.

@public
@param {Vector3} v - the translation to go to.
@param {Quaternion} q - the rotation to go to.
@param {boolean} fall - a flag to specify whether the avatar should start falling immediately

    */

    goTo(v, q, fall) {}

    /**
       Equivalent to call:

```
goTo([0, 0, 0], [0, 0, 0, 1]);
this.set({lookPitch: 0, lookYaw: 0});
this.say("setLookAngles", {pitch: 0, yaw: 0, lookOffset: [0, 0, 0]});
```

the last `say` line notifies the pawn to update the display.

@public
    */

    goHome() {}

    /**
This method computes the position and rotation in front of the avatar at specified distance. The optional `optOffset` is added to the result in the reference frame of the avatar.

The function returns an object with two properties `{translation: Vector3, rotation: Quaternion}`.

@public
@param {Vector3} distance - the distance from the avatar's position
@param {Vector3?} optOffset - additional offset from the position computed above
@returns Pose
    */

    dropPose(distance, optOffset) {}

    /**
This method sets the translation of the avatar to the specified `[x, y, z]` coordinates. (Inherited from CardActor.)

@public
@param {Vector3} v - the new translation of the avatar.
    */

    translateTo(v) {}

    /**
This method sets the rotation of the avatar to the specified quaternion. (Inherited from CardActor.)

@public
@param {Quaternion} q - the new rotation of the avatar.
    */

    rotateTo(q) {}

    /**
This method sets the scale of the avatar to the specified by scale factors in [x, y, z] axis. (Inherited from CardActor.)

@public
@param {Vector3} s - the new scale of the avatar.
    */

    scaleTo(q) {}
}

/**
AvatarPawn is the view-side implementation of Avatar for the local AvatarActor. There is a separate and almost empty RemoteAvatarPawn to show remote avatars.

@public
@hideconstructor

*/

class AvatarPawn {
    /**
Sets the coressponding actor's look configurations by publishing an event to the actor.

@public
@param {number} pitch - the pitch
@param {number} yaw - the yaw
@param {Vector3} lookOffset - the lookOffset

    */

    lookTo(pitch, yaw, lookOffset) {}

    /**
       This method sets the opacity of the 3D model by assigning a different opacity value into the Three.js material.
       
       @public
       @param {number} opacity
    */

    setOpacity(opacity) {}

    /**
       This call initiates tells the actor to move back to [0, 0, 0], and resets rotation.

       @public
    */

    gotHome() {}

    /**
This method updates the local avatar pawn translation directly to the given value to have immediate screen update and publishes an event to set the corresponding actor's translation. (Inherited from CardPawn.)

@public
@param {Vector3} v - the new translation of the avatar.
    */

    translateTo(v) {}

    /**
This method updates the local avatar pawn translation directly to the given value to have immediate screen update and publishes an event to set the corresponding actors's rotation.

@public
@param {Quaternion} q - the new rotation of the avatar.
    */

    rotateTo(v) {}

    /**
This method updates the local avatar pawn translation directly to the given value to have immediate screen update and publishes an event to set the corresponding actors's scale.

@public
@param {Vector3} s - the new scale of the avatar.
    */

    scaleTo(v) {}
}

/**
AvatarEventHandler Behavior Module

The Microverse system automatically attaches a behavior module named `AvatarEventHandler` to the Avatar. Its default implementation is stored in `behaviors/croquet/avatarEvents.js`, but you can create a behavior with a similar structure to override the default functionality of some methods defined at AvatarPawn.

When the card spec for the avatar has the `avatarEventHandler` property, the behavior module with the name is used (instead of a module named `AvatarEventHandler`.  You can provide a custom action for a known method by defining a method at the pawn side behavior called `AvatarPawn`. (cf. `behaviors/croquet/halfBodyAvatar.js` in the source code).

Currently the following methods of the base AvatarPawn can be overridden. (In the source code the methods with `this.call(...handlerModuleName...)` lines checks if the named method exists in the behavior and calls if it does.)

@public
@hideconstructor
*/

class AvatarEventHandler {
    /**
Called when the shell sends the `motion-start` DOM message from the Microverse shell, typically when the joystick is pressed down.

@public
@param {number} dx - the offset of joystick knob
@param {number} dy - the offset of joystick knob
    */

    startMotion(dx, dy) {}

    /**
Called repeatedly when the shell sends the `motion-update` DOM message from the Microverse shell, typically when the joystick is moved from the off-center.

@public
@param {number} dx - the offset of joystick knob
@param {number} dy - the offset of joystick knob
    */

    updateMotion(dx, dy) {}

    /**
Called when the shell sends the `motion-end` DOM message from the Microverse shell, typically when the joystick is released.

@public
@param {number} dx - the offset of joystick knob
@param {number} dy - the offset of joystick knob
    */

    endMotion(dx, dy) {}

    /**
This method specifies the global camera position. The implementation can use various properties such as the global transformation of the avatar, lookPitch and other properties that the behavior defines.    
    
@public
@returns Matrix4
    */

    walkLook() {}

    /**

This method receives the time and "delta", which is the elapsed time since last display animation frame time, and the proposed "pose" of the avtar based on the user interaction. The default implementation moves the proposed position based on the BVH collision detection and testing the edge of the walkable terrain and returns another pose. You can override the movement by supplying the walk method at your AvatarPawn behavior. (Its details is somewhat implementation dependent so please consult the actual source code.)
    
@public
@param {number} time - the animation frame time
@param {number} delta - the difference from the last animation frame time
@param {Object} vq - an object with the v property for proposed next position and q property for proposed next rotation
    */

    walk(time, delta, vq) {}

    /**

Implementing them at the AvatarPawn overrides their actions. Note that the first responder and last responder mechanism is involved so some methods expects certain patterns. In general, you can simply copy the default implementation in `src/avatar.js` into your own behavior file as ther starting point for your own custom implementation.
    
@public
@param {Event} evt - the p3e event from Pointer.
    */

    pointerDown(evt) {}
    pointerUp(evt) {}
    pointerMove(evt) {}
    pointerMove(evt) {}
    pointerTap(evt) {}
    pointerWheel(evt) {}
    pointerDoubleDown(evt) {}
    keyDown(evt) {}
    keyUp(evt) {}


   /**
This method controls the opacity used to render avatars. Typically a remote avatar close to yours become translucent. the custom implementation of `mapOpacity` defined at the AvatarPawn maps the value in the [0, 1] range.

@public
@param{number} opacity - the proposed opacity between [0, 1]
@returns a number to represent modified opacity between [0, 1]
   */

    mapOpacity(opacity) {}
}
