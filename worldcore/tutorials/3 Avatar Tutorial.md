This is the second in a series of tutorials illustrating how to build a Worldcore app. It assumes that you have familiarity with the basics of the Croquet SDK, and understand the general concepts behind Worldcore. For more inforamation, see croquet.io/docs/croquet and croquet.io/docs/worldcore.

**This tutorial shows how to create user interface elements, and create avatars that only respond to one user's input.**

The tutorials for the `@croquet/worldcore` package makes use of CodeSandbox to show a whole project for each example, with the same structure as your own project would have locally. Please clone the [Worldcore github repository](https://github.com/croquet/worldcore) and visit the `tutorial/tutorial3` directory.

This actor is extended with the `Avatar` and `Player` mixins. Avatar supports speculative execution by the actor's pawn, which makes user-controlled actors more responsive. Player allows an instance of the actor to be automatically spawned by the PlayerManager when a new user joins.

The avatar creates its own children in its `init()`. This is a better way to build hierarchical objects if you're going to spawn multiple instances of them.

The actor also listens for messages from its pawn telling it to toggle its child on and off or change its child's color.
```
class MyAvatar extends mix(Actor).with(AM_Avatar, AM_Player) {

    get pawn() {return AvatarPawn}
    get color() {return this._color || [1,1,1,1]}

    init(options) {
        super.init(options);

        this.orbit = OrbitActor.create({parent: this});
        this.child = ChildActor.create({
            parent: this.orbit,
            translation: [1.5,0,0],
            scale: [0.5, 0.5, 0.5],
            color: [0, 0.7, 0.7, 1]
        });

        this.listen("color", this.randomColor);
        this.listen("toggle", this.toggleChild);
    }

    randomColor() {
        if (!this.child) return;
        this.child.set({color: [Math.random(), Math.random(), Math.random(), 1});
        this.child.say("colorChanged", this.child.color);
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
MyAvatar.register('MyAvatar');
```
In a multiplayer session, every user is represented by an avatar/pawn pair. But only one pawn on a given client "belongs" to the local user. The `isMyPlayerPawn` property identifies this pawn. Only that pawn should subscribe to local control inputs and pass them on only to its actor. That way, each avatar is controlled by the user it belongs to.

Speculative execution is handled by the `Avatar` mixin. This mixin extends the pawn with methods like `setSpin()` and `moveTo()`. Calling these methods sends a message to the avatar, but it also immediately changes the pawn's local transformation.

So in this example, calling `setSpin()` from the pawn sets the actor's rotational velocity. But it also immediately applies that rotational velocity to the pawn itself. That means the pawn starts spinning instantly, without having to wait for the message to travel to the reflector and back. That makes user inputs feel more tight and responsive.

The Avatar mixin also handles reconciliation of the speculative position of the pawn with the correct position of the actor. This is done with the same view smoothing mechanism that normal smoothed pawns use.
```
class AvatarPawn extends mix(Pawn).with(PM_Avatar, PM_Player, PM_Visible) {
    constructor(...args) {
        super(...args);

        this.mesh = Cube(1,1,1);
        this.mesh.load();
        this.mesh.clear()
        this.setDrawCall(new DrawCall(this.mesh));

        if (this.isMyPlayerPawn) {
            this.subscribe("hud", "joy", this.joy);
            this.subscribe("input", "cDown", () => this.say("color"));
            this.subscribe("input", "dDown", () => this.say("toggle"));
            this.subscribe("hud", "color", () => this.say("color"));
            this.subscribe("hud", "toggle", () => this.say("toggle"));
        }
    }

    destroy() {
        super.destroy();
        this.mesh.destroy();
    }

    joy(xy) {
        const spin = xy[0];
        const pitch = xy[1];
        let q = q_multiply(q_identity(), q_axisAngle([0,1,0], spin * 0.005));
        q = q_multiply(q, q_axisAngle([1,0,0], pitch * 0.005));
        q = q_normalize(q);
        this.setSpin(q);
    }
}
```
No change from the previous tutorial.
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

class ChildActor extends mix(Actor).with(AM_Smoothed) {

    get pawn() {return MyPawn}
    get color() {return this._color || [1,1,1,1]}

    randomColor() {
        this.set({color: [Math.random(), Math.random(), Math.random(), 1]});
        this.say("colorChanged", this.color);
    }

}
ChildActor.register('ChildActor');

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

class OrbitPawn extends mix(Pawn).with(PM_Smoothed) {}
```
The `PlayerManager` automatically spawns an avatar whenever a new user joins the session. It also automatically deletes that avatar when the player leaves.

You should overload the player manager's `createPlayer()` method with your own avatar-creation logic. This can be fairly complex. For example, you could randomize where the avatar appears, or check to make sure that the new avatar doesn't collide with existing ones. Your version of `createPlayer()` should
always return a pointer to the new avatar.

(Note that any initialization options must be appended to the existing options object. The player manager uses the options object to pass its own parameters to the new avatar, and if you replace it entirely, the player manager won't be able to keep track of the player.)

```
class MyPlayerManager extends PlayerManager {

    createPlayer(options) {
        options.translation = [0,0,-4];
        return MyAvatar.create(options);
    }

}
MyPlayerManager.register("MyPlayerManager");
```
This `ModelRoot` is much simpler than it was in the previous tutorial. All it does is add the player manager as a model service. All event handling is done by the player pawn, and the avatar and its children are spawned automatically by the player manager.

```
class MyModelRoot extends ModelRoot {

    static modelServices() {
        return [MyPlayerManager];
    }

}
MyModelRoot.register("MyModelRoot");
```
This `ViewRoot` adds another service, the `UIManager`. The UIManager provides an alternate framework for creating a 2D user interface. Worldcore is compatible with normal HTML and CSS, but it's often easier to build your UI procedurally using Worldcore widgets.

First we create the HUD. This is an empty container widget that automatically scales to match the size of the its parent. We attach it to the root of the widget tree in the UIManager. The root widget is always an empty widget that completely fills the app window.

Then we create two buttons anchored to the upper left corner. Their `onClick` methods are replaced with publish calls to broadcast that they've been pressed.

Finally we create a virtual joystick in the lower right corner. The `anchor` and `pivot` options are used to control where the widget attaches to its parent. The joystick's `onChange` method is replaced with a publish call to broadcast its position.
```
class MyViewRoot extends ViewRoot {

    static viewServices() {
        return [InputManager, RenderManager, UIManager];
    }

    constructor(model) {
        super(model);

        const uiRoot = this.service("UIManager").root;
        const HUD = new Widget({parent: uiRoot, autoSize: [1,1]});

        // We can create the widget with options passed to its constructor ...

        const button1 = new ButtonWidget({
            parent: HUD,
            local:[20,20],
            size: [150,70],
            label: new TextWidget({text: "Color"}),
            onClick: () => this.publish("hud", "color")
        });

        // ... or modify it afterwards using set()

        const button2 = new ButtonWidget({
            parent: HUD,
            local:[20,100],
            size: [150,70]
            });
        button2.set({onClick: () => this.publish("hud", "toggle")});
        button2.label.set({text: "Toggle"});

        const joy = new JoystickWidget({
            parent: HUD,
            anchor: [1,1],
            pivot: [1,1],
            local: [-20,-20],
            size: [150, 150],
            onChange: xy => this.publish("hud", "joy", xy)
        });

    }

}
```
Try running this tutorial in multiple windows at the same time. Each window will spawn its own avatar, and that avatar will only respond to control inputs from the window that owns it.
```
StartWorldcore({
    appId: 'io.croquet.tutorial',
    apiKey: '1Mnk3Gf93ls03eu0Barbdzzd3xl1Ibxs7khs8Hon9',
    name: 'tutorial',
    password: 'password',
    model: MyModelRoot,
    view: MyViewRoot,
});
```


