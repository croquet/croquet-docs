/**
The "avatar" of Croquet Microverse handles user interaction such as mouse and keyboard and manages the "camera" of the 3D scene. The avatar is implemented as a special kind of [card](./card.html). The default listeners for user interaction, such as the WASD key and pointer navigation, Ctrl-Click editting etc. are specified in a behavior module so that you can implement a new set and turn on and off certain actions. You can also attach some other behaviors to add world-specific features.

The base actor class of the avatar is called AvatarActor, and the base pawn class is called AvatarPawn. Because it is a card, its visual appearance is specified in the same way for a 3D model-type card.

Other participants' avatars shown in the session are also cards. However, typically the card for an avatar is not on the "pointer" layer so usually you cannot drag it around or get the property sheet.

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
`type Vector3 = Array<number, number, number>`

The offset in 3D coordinates between avatar's position and the camera's position. A typical third person view behind the avatar has [0, p, p], where p is a positive number.

@public
@type Vector3
    */

    get lookOffset() {}

    /**
`type Vector3 = Array<number, number, number>`

`type Quaternion = Array<number, number, number, number>`

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
`type Vector3 = Array<number, number, number>`

`type Quaternion = Array<number, number, number, number>`

`type Pose = {translation: Vector3, rotation: Quaternion}`

This method computes the position and rotation in front of the avatar at specified distance. The optional `optOffset` is added to the result in the reference frame of the avatar.

@public
@param {Vector3} distance - the distance from the avatar's position
@param {Vector3?} optOffset - additional offset from the position computed above
@returns Pose
    */

    dropPose(distance, optOffset) {}
}

/**
AvatarPawn is the view-side implementation of Avatar for the local AvatarActor. There is a separate and almost empty RemoteAvatarPawn to show remote avatars.

@public
@hideconstructor

*/

class AvatarPawn {
    /**
`type Vector3 = Array<number, number, number>`

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
}







    




