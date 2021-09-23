/**
 * The input manager is a view-side service with the public name "InputManager". It captures common UI events and turns them into
 * Croquet events that you can subscribe to. If you want to use the input manager, add it as
 * a service to your root view.
 * ```
 * class MyViewRoot extends ViewRoot {
 *      static viewServices() { return [InputManager];}
 * }
 * @public
 * @augments ViewService
 * @hideconstructor
 */
 class InputManager {

     /**
     * Adds a custom event that will fire when a combination of keys is pressed. The event [chordDown]{@link InputManager#event:chordDown} is published when
     * the chord is completed, and the event [chordUp]{@link InputManager#event:chordUp} is published when any key in a pressed chord is released.
     * @public
     * @param {string} name The name of the chord.
     * @param {string[]} down The keys that comprise the chord.
     * @param {string[]} [up] The keys that prevent the chord.
     * @example
     * this.service("InputManager").addChord("cheat", ['q', 't']); // Pressing q and t together will start cheat mode
     * this.subscribe("input", "cheatDown", () => { console.log("Start cheat mode!"); })
     */
    addChord(name, down = [], up = []) {}

    /**
     * Returns true if the app is currently in fullscreen mode
     * @public
     * @type {boolean}
     */
    get inFullscreen() {}

    /**
     * Attempts to put the app in fullscreen mode.
     * @public
     */
    enterFullscreen() {}

    /**
     * Takes the app out of fullscreen mode.
     * **Note:** Many browsers provide alternate ways to cancel fullscreen.
     * @public
     */
    exitFullscreen() {}

    /**
     * Returns true if the app is currently in pointerlock mode.
     * In pointerlock mode the mouse cursor will not be displayed and mouse movements will not return screen coordinates.
     * @public
     * @type {boolean}
     */
    get inPointerLock() {}

    /**
     * Attempts to put the app in pointerlock mode.
     * In pointerlock mode the mouse cursor will not be displayed and mouse movements will not return screen coordinates.
     * @public
     * @fires pointerLock
     */
    enterPointerLock() {}

    /**
     * Takes the app out of pointerlock mode.
     * In pointerlock mode the mouse cursor will not be displayed and mouse movements will not return screen coordinates.
     * **Note:** Many browsers provide alternate ways to cancel pointerlock.
     * @public
     * @fires pointerLock
     */
    exitPointerLock() {}

    /**
     * Generic touch or mouse click event.
     * @event
     * @global
     * @public
     * @property {String} scope - `"input"`
     * @property {String} event - `"click"`
     */
    click() {}

    /**
     * Fired when the final key to complete a [chord]{@link InputManager#addChord} is pressed. The event is the name of the chord + "Down".
     * @event
     * @global
     * @public
     * @property {String} scope - `"input"`
     * @property {String} event - `"<chord> + Down"`
     */
    chordDown() {}

    /**
     * Fired when any key of a pressed [chord]{@link InputManager#addChord} is released. The event is the name of the chord + "Up".
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"<chord> + Up"`
     */
    chordUp() {}

    /**
     * Fired when the app enters or exits pointerlock mode.
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"pointerLock"`
     * @property {boolean} state - Whether the app is currently in pointerlock
     */
    pointerLock() {}

    /**
     * Fired immediately when the app window changes size. However, because of layout issues on iOS, this
     * size may not reflect the actual window size when all layout is done. Most apps will want to use
     * the [resize]{@link event:resize} event instead.
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"beforeResize"`
     * @property {number[]} size - [x,y] size of the window
     */
    beforeResize() {}

    /**
     * Fired when the app window changes size.
     *
     * **Note:** This event has a built-in delay to allow iOS window layout to settle. See [beforeResize]{@link event:beforeResize}.
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"resize"`
     * @property {number[]} size - [x,y] size of the window
     */
     resize() {}

    /**
     * Fired when the app window gets focus.
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"focus"`
     */
    focus() {}

    /**
     * Fired when the app window loses focus.
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"blur"`
     */
    blur() {}

    /**
     * The data passed by the {@link InputManager} for a [keyDown]{@link event:keyDown}, [keyUp]{@link event:keyUp}, or [keyRepeat]{@link event:keyRepeat} event.
     * @public
     * @name keyData
     * @property {string} scope - key
     * @property {boolean} scope - shift pressed
     * @property {boolean} scope - alt pressed
     * @property {boolean} scope - ctrl pressed
     * @property {boolean} scope - meta pressed
     */

    /**
     * Fired when a key is pressed. The data object contains the name of the key along with booleans for various modifier keys.
     *
     * Alternatively, you can subscribe to the event `<key> + Down` which will report single key presses. The data object is the same.
     * @event
     * @public
     * @global
     * @property {string} scope - `"input"`
     * @property {string} event - `"keyDown"`
     * @property {keyData} data - {key, shift, alt, ctrl, meta}
     * @example
     * this.subscribe("input", "keyDown" data => { console.log(data.key + " was pressed!")});
     * this.subscribe("input", "aDown" data => { if (data.shift) console.log("A was pressed!")});
     */
    keyDown() {}

    /**
     * Fired when a key is released. The data object contains the name of the key along with booleans for various modifier keys.
     *
     * Alternatively, you can subscribe to the event `<key> + Up` which will report single key releases. The data object is the same.
     * @event
     * @public
     * @global
     * @property {string} scope - `"input"`
     * @property {string} event - `"keyUp"`
     * @property {keyData} data - {key, shift, alt, ctrl, meta}
     * @example
     * this.subscribe("input", "keyUp" data => { console.log(data.key + " was released!")});
     * this.subscribe("input", "aUp" data => { console.log("a was released!") });
     */
    keyUp() {}

    /**
     * Fired repeatedly while a key is held down. The data object contains the name of the key along with booleans for various modifer keys.
     *
     * Alternatively, you can subscribe to the event `<key> + Repeat` which will fire when a single key is held down. The data object is the same.
     *
     * **Warning:** This generates a lot of events! Do not subscribe to this in the model, or you will overload the reflector!
     * @event
     * @public
     * @global
     * @property {string} scope - `"input"`
     * @property {string} event - `"keyRepeat"`
     * @property {keyData} data - {key, shift, alt, ctrl, meta}
     * @example
     * this.subscribe("input", "keyRepeat" data => { console.log(data.key + " held down!")});
     * this.subscribe("input", "aRepeat" data => { console.log("a held down!") });
     */
    keyRepeat() {}

    /**
     * The data passed by the {@link InputManager} for pointer events.
     * @public
     * @name pointerData
     * @property {string} id - For multitouch devices, the touch's unique ID.
     * @property {string} type - "mouse" or "touch".
     * @property {number} button - If a mouse button, which one.
     * @property {number[]} xy - The screen coordinates of the event. (or the xy delta)
     */

    /**
     * The data passed by the {@link InputManager} for multitouch zoom events.
     * @public
     * @name zoomData
     * @property {number[]} mid - The xy coordinates of the midpoint between the two touch contacts.
     * @property {number} zoom - The proportional distance between the two touch contacts (starts at 1).
     * @property {dial} dial - The rotation angle in radians of the two touch contacts (starts at 0).
     */

    /**
     * Fired when the mouse is clicked, or a touchscreen is touched.
     *
     * @event
     * @public
     * @global
     * @property {string} scope - `"input"`
     * @property {string} event - `"pointerDown"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "pointerDown" data => { console.log(data.xy)}); // Prints the xy position of the click or touch.
     */
    pointerDown() {}

    /**
     * Fired when a mouse click or touch is released.
     *
     * @event
     * @public
     * @global
     * @property {string} scope - `"input"`
     * @property {string} event - `"pointerUp"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "pointerUp" data => { console.log(data.xy)}); // Prints the final xy position of the click or touch.
     */
    pointerUp() {}

    /**
     * Fired when the mouse is moved, or a touch is dragged.
     *
     * **Warning:** This generates a lot of events! Do not subscribe to this in the model, or you will overload the reflector!
     *
     * @event
     * @public
     * @global
     * @property {string} scope - `"input"`
     * @property {string} event - `"pointerMove"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "pointerMove" data => { console.log(data.xy)}); // Prints the current xy position of the cursor or touch.
     */
    pointerMove() {}

    /**
     * Fired when the mouse is moved, or a touch is dragged. Similar to the [pointerMove]{@link event:pointerMove}
     * event, but instead of reporting the cursor's absolute xy position, it reports its change from the last pointer event.
     * Use this if you're in [pointerLock]{@link InputManager#enterPointerLock} mode
     *
     * **Warning:** This generates a lot of events! Do not subscribe to this in the model, or you will overload the reflector!
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"pointerDelta"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "pointerDelta" data => { console.log(data.xy)}); // Prints xy distance moved since the last delta event.
     */
    pointerDelta() {}

    /**
     * Fired when there's a brief press and release of the pointer.
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"tap"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "tap" data => { console.log(data.xy)}); // Prints xy position of the tap
     */
    tap() {}

    /**
     * Fired when there's a quick double press of the pointer
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"doubleDown"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "doubleDown" data => { console.log(data.xy)}); // Prints xy position of the double press
     */
     doubleDown() {}

    /**
     * Fired when there's a quick triple press of the pointer
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"tripleDown"`
     * @property {pointerData} data - {id, type, button, xy}
     * @example
     * this.subscribe("input", "tripleDown" data => { console.log(data.xy)}); // Prints xy position of the triple press
     */
    tripleDown() {}

    /**
     * Fired when there's a quick horizontal swipe on a touch device. The pointerData passed by the event also includes a `distance` member
     * that contains the distance of the swipe.
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"swipeX"`
     * @property {pointerData} data - {id, type, button, xy, distance}
     * @example
     * this.subscribe("input", "swipeX" data => { console.log(data.distance)}); // The length of the swipe.
     */
    swipeX() {}

    /**
     * Fired when there's a quick vertical swipe on a touch device. The pointerData passed by the event also includes a `distance` member
     * that contains the distance of the swipe.
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"swipeY"`
     * @property {pointerData} data - {id, type, button, xy, distance}
     * @example
     * this.subscribe("input", "swipeY" data => { console.log(data.distance)}); // The length of the swipe.
     */
    swipeY() {}

    /**
     * Fired when exactly two multitouch contacts appear on a touch device. This is interpreted as the start of a zoom
     * sequence. During a zoom sequence the input manager tracks the midpoint between the contacts, and their separation and rotation
     * relative to where they started.
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"zoomStart"`
     * @property {zoomData} data - {mid, zoom, dial}
     * @example
     * this.subscribe("input", "zoomStart" data => { console.log(data.mid)}); // The xy midpoint between the two contacts.
     */
    zoomStart() {}

    /**
     * Continuously fires while there are exactly two multitouch contacts on a touch device. This is interpreted as an ongoing zoom
     * sequence. During a zoom sequence the input manager tracks the midpoint between the contacts, and their separation and rotation
     * relative to where they started.
     *
     * **Warning:** This generates a lot of events! Do not subscribe to this in the model, or you will overload the reflector!
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"zoomUpdate"`
     * @property {zoomData} data - {mid, zoom, dial}
     * @example
     * this.subscribe("input", "zoomUpdate" data => { console.log(data.zoom)}); // The distance between the contacts relative to their starting distance.
     */
    zoomUpdate() {}

    /**
     * Fired when a double touch event comes to an end, terminating the zoom sequence. The data contains the final midpoint between the contacts,
     * and their final separation and rotation relative to where they started.
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"zoomEnd"`
     * @property {zoomData} data - {mid, zoom, dial}
     * @example
     * this.subscribe("input", "zoomEnd" data => { console.log(data.dial)}); // The final rotation of the double touch.
     */
    zoomEnd() {}

    /**
     * Fired when the mouse wheel rotates.
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"wheel"`
     * @property {number} delta - The mouse wheel's rotation since the last event.
     */
    wheel() {}

    /**
     * Fired by mobile devices that track their physical orientation. The event data is an object containing the device's pitch and yaw in radians.
     *
     * **Warning:** This generates a lot of events! Do not subscribe to this in the model, or you will overload the reflector!
     *
     * @event
     * @global
     * @public
     * @property {string} scope - `"input"`
     * @property {string} event - `"orientation"`
     * @property {Object} delta - {pitch, yaw}
     */
    orientation() {}

}

