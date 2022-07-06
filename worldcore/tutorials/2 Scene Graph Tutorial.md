This is the tutorial following the quick start illustrating how to build a Worldcore app. It assumes that you have familiarity with the basics of the Croquet SDK, and understand the general concepts behind Worldcore. For more inforamation, see croquet.io/docs/croquet and croquet.io/docs/worldcore.

**This tutorial show how to create a hierarchy of dynamic objects and control them using input events.**

The tutorials for the `@croquet/worldcore` package makes use of CodeSandbox to show a whole project for each example, with the same structure as your own project would have locally. Please clone the [Worldcore github repository](https://github.com/croquet/worldcore) and visit the `tutorial/tutorial2` directory.

We've extended our actor with the `Smoothed` mixin. Smoothed is derived from Spatial, but it includes the additional methods `moveTo()`, `rotateTo()`, and `scaleTo()`. These methods set the actor's translation, rotation, or scale, but they also tell the actor's pawn to smoothly interpolate from its previous position to its new one.

(You can also use the standard `set()` operation with a Smoothed actor to pop it to its desired position if you need a quick transition.)

This actor also includes a `tick` to animate it. The tick method uses Croquet's `future()` method for scheduling. We call tick the first time in init, and then tick sets itself up to be called again 50 ms in the future. Inside the tick, we generate a quaternion representing a 2 degree rotation. Then we multiply that
with the actor's current rotation find its new rotation. Finally we call "rotate to" to tell the actor to smoothly rotate to that new position.

We've also added a `getter` for a color property. This lets us set the color of the actor. If we don't set it, the color will default to white.

```
class MyActor extends mix(Actor).with(AM_Smoothed) {

    get pawn() {return MyPawn}
    get color() {return this._color || [1,1,1,1]}

    init(options) {
        super.init(options);
        this.tick();
    }

    tick() {
        const q = q_axisAngle(v3_normalize([-1,1,-1]), toRad(2));
        const rotation = q_multiply(this.rotation, q );
        this.rotateTo(rotation);
        this.future(50).tick();
    }

}
MyActor.register('MyActor');
```
Our pawn is extended with the pawn version of the `Smoothed` mixin. Smoothed pawns interpolate every frame from their current position to the actor's position. That means that even if the actor is updating slowly or there is a hitch in the reflector heartbeat, the pawn's movement will feel continuous.

How quickly the convergence happens is determined by the `tug` property, which can have a value from 0 to 1. The lower the tug, the more slowly the pawn will converge to the actor's true position. By default, pawns have their tug set to 0.2.

The pawn sets its color based on the actor's color property. It does this in its constructor, reading the color directly from the actor. However, it also listens to messages from the actor telling it if its color has changed.

`listen()` is a scope-limited version of subscribe. Listen only pays attention to messages published by this actor/pawn pair. This means you can create multiple actors of the same type, and they can communicate with their respective pawns without getting their wires crossed.

```
class MyPawn extends mix(Pawn).with(PM_Smoothed, PM_Visible) {
    constructor(...args) {
        super(...args);
        this.mesh = Cube(1,1,1);
        this.setColor(this.actor.color);
        this.setDrawCall(new DrawCall(this.mesh));
        this.listen("colorChanged", this.setColor);
    }

    destroy() {
        super.destroy();
        this.mesh.destroy();
    }

    setColor(color) {
        this.mesh.setColor(color);
        this.mesh.load();
    }

}
```
This is the child that will be attached to our parent actor. It will use the parent's transform, but apply its own as well.

(Note that the child actor uses the same pawn type as the parent. It's fine for actors to share pawn types. You only need to define a new type of pawn if it needs different behavior.)

The child also subscribes to a message from the `InputManager`. The input manager is a view-side service that captures DOM events and converts them to Croquet messages. This is useful because you can subscribe to them even in the model.

In this case, the actor has subscribed to the event that's published when the "c" key is pressed. When it receives that event, the actor will randomly change its color to a new value. Note the use of `set()`. You can use set to set any property in the actor, as long as you create a corresponding getter to retrieve it.

Note also the use of Croquet's `Math.Random()`. Because this code is being run in the model,  Math.random() will return the same value on every client.

After the actor has changed color, it lets its pawn know by publishing the `"colorChanged"` message using `say()`. Say is the counterpart to listen. Using it means the message only goes to the specific pawn associated with this particular actor.
```
class ChildActor extends mix(Actor).with(AM_Smoothed) {

    get pawn() {return MyPawn}
    get color() {return this._color || [1,1,1,1]}

    init(options) {
        super.init(options);
        this.subscribe("input", "cDown", this.randomColor);
    }

    randomColor() {
        this.set({color: [Math.random(), Math.random(), Math.random(), 1]});
        this.say("colorChanged", this.color);
    }

}
ChildActor.register('ChildActor');
```
The orbit actor holds a separate transform and has its own tick, rotating around a different axis that our main actor. This lets the child move independently from the main actor's rotation.
```
class OrbitActor extends mix(Actor).with(AM_Smoothed)  {

    get pawn() {return OrbitPawn}

    init(options) {
        super.init(options);
        this.future(50).tick();
    }

    tick() {
        const q = q_axisAngle(v3_normalize([0,1,0]), toRad(4));
        const rotation = q_multiply(this.rotation, q );
        this.rotateTo(rotation);
        this.future(50).tick();
    }
}
OrbitActor.register('OrbitActor');
```
The pawn associated with the orbit actor is very simple. It doesn't even have the Visible component because there's nothing to render. It just has Smoothed so that the view-side scene graph will work.
```
class OrbitPawn extends mix(Pawn).with(PM_Smoothed) {}
```
In the `ModelRoot` we spawn all three actors and link them in a hierarchy. The parent actor rotates in place. The orbit actor rotates along with the parent, and adds a second rotation of its own around a different axis. The child actor is attached to the orbit and uses both rotations, as well as applying its own offset from the center.

The model root also subscribes to the event that's published when the "d" key is pressed. Pressing the "d" key destroys the child. That actor is completely deleted. It's removed from the scene hierarchy, its pawn is destroyed, and all of its render resources are freed.

If there isn't a child actor when you press the "d" key, it spawns a new one and attaches it to the orbit.
```
class MyModelRoot extends ModelRoot {

    init(...args) {
        super.init(...args);
        this.parent = MyActor.create({
            translation: [0,0,-4],
            rotation: q_axisAngle(v3_normalize([1,1,1]), toRad(45))
        });

        this.orbit = OrbitActor.create({
            parent: this.parent
        });

        this.child = ChildActor.create({
            parent: this.orbit,
            translation: [1.5,0,0],
            scale: [0.5, 0.5, 0.5],
            color: [0, 0.7, 0.7, 1]
        });

        this.subscribe("input", "dDown", this.toggleChild);
    }

    toggleChild() {
        if(this.child) {
            this.child.destroy();
            this.child = null;
        } else {
            this.child = ChildActor.create({
                parent: this.orbit,
                translation: [1.5,0,0],
                scale: [0.5, 0.5, 0.5],
                color: [0, 0.7, 0.7, 1]
            });
        }
    }

}
MyModelRoot.register("MyModelRoot");
```

The ViewRoot and the start function are unchanged from the previous tutorial.

```
class MyViewRoot extends ViewRoot {
    static viewServices() {
        return [InputManager, RenderManager];
    }
}

StartWorldcore({
    appId: 'io.croquet.tutorial',
    apiKey: '1Mnk3Gf93ls03eu0Barbdzzd3xl1Ibxs7khs8Hon9',
    name: 'tutorial',
    password: 'password',
    model: MyModelRoot,
    view: MyViewRoot,
});
```
