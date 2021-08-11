Worldcore Widget is a user interface system that sits on top of Worldcore. It can be used in place of HTML and CSS to create user interfaces for Worldcore apps.

One advantage of Worldcore Widget is that it integrates with the Worldcore Input Manager. This allows you to create a user interface that floats over
a 3D rendered scene. Pointer events that interact with the interface are trapped by the UI Manager, while those that don't are passed on to input handlers for the
3D scene.

Widgets all share a single HTML canvas. They can be organized hierarchically, and procedurally manipulated with layout parameters. Supported widget types include text, image,
buttons, toggles, scroll bars, and virtual joysticks. In their basic form they are simple colored blocks, but they can be decorated with imported graphics to
match the theme of a specific app.

