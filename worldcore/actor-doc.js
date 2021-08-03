/**
 An actor is a type of model that automatically instantiates a pawn in the view when it’s created. This actor/pawn pair has a private communication channel that allows them to talk directly with each other. The actor handles the simulation, and the pawn handles input and output. When the actor is destroyed, the pawn is destroyed.


 @example
 * this.createElement("div");
 @public
 @hideconstructor
 */

class Actor {

    /**
       Returns the class type of the actor's corresponding pawn. Actors inheriting from this base class should overload this getter to specify
       their pawn type.

       @readonly
       @public
       @augments Model
       @type Pawn
       @example
      class MyActor extends Actor {
	      get pawn() { return MyPawn }
      }
      MyActor.regsister(‘MyActor’)
     */

    get pawn() {}

    /**
     * Create an instance of an actor and automatically spawn its corresponding pawn. Create calls the user-defined [init()]{@link Actor#init} method and passes in the options.
     *
     * **Note:** When your actor is no longer needed, you must [destroy]{@link Actor#destroy} it. Otherwise it will be kept in the snapshot forever.
     *
     * **Warning**: never create an actor instance using `new`, or override its constructor.
     *
     * @public
     * @param {Object} [options] - An initialization object that's passed to the actor's [init()]{@link Actor#init}. Init automatically generates internal properties with the name of each option prefaced by "_".
     * @example
     * const a = MyActor.create({scale: 2})
    */
    static create(options) {}

    /**
     * This is called by [create()]{@link Actor.create} to initialize the actor. In your actor subclass, this is the place to
     * subscribe to or listen for events, or to start a future message for a reoccuring tick.
     *
     * Super.init() automatically
     * generates internal properties with the name of each initialization option prefaced by "_". You should define corresponding
     * getters to access these internal properties, along with their default values.
     *
     * **Note:** The reason to use getters to reduce snapshot size. Worldcore actors can be quite complicated with dozens of
     * properties. Multiplied by the number of actors, the total number of properties stored in the snapshot can be large. Using
     * getters prevents defaults from being stored.

     @param {Object} [options] - An initialization object. super.init() automatically generates internal properties with the name of each option prefaced by "_".
     @public
     @example
     class MyActor extends Actor {
         get scale() {return this._scale || 1};
     }
     */
    init(options) {}




    /**
        Add a child element in front of `referenceElem` in the `childNodes` list. If `referenceElem` is `null`, the element is added at the end of the list.

        @public
        @param {Element|ElementRef} elem - the child element to be added
        @param {(Element|ElementRef)=} referenceElem - the child element to be added
        @example
        let anchor = this.querySelector("#myElem"); this.insertBefore(another, anchor);

    */
    insertBefore(elem, refelenceElem) {}

    /**
       Remove the receiver from its parent's `childNodes`. If the receiver is not in the display scene, this method does not have any effects.

        @public
        @example
        another.remove();
    */
    remove() {}

    /**
        remove specified elem from childNodes of the receiver.

        @public
        @param {(Element|ElementRef)=} elem - the child element to be removed
        @example this.removeChild(another);
    */
    removeChild(elem) {}

    /**
       * Add a listener for a DOM event specified by `eventType` to the receiver.

       * It resembles the native DOM's addEventListener but the second argument is restricted to a string that specifies the name of a method to conform Croquet Model.

       * A typical case is to call `addEventListener()` from an expander. In that case, the method is looked up from the calling expander.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @param {boolean=} useCapture - indicating if the event will be dispatched elements below
       @example this.addEventListener("click", "onClick"); // onClick is the name of a method
    */

    addEventListenerrrr(eventType, methodName, useCapture) {}

    /**
       Remove the specified event listener from the element.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @example this.removeEventListener("click", "onClick");
    */

    removeEventListener(eventType, methodName) {}

    /**
       Look up an element that matches the specified query. (cr. https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)  However, As of writing, querySelector only works with the `#id` form.

       @public
       @param {string} query - \# followed by a domId
       @returns {Element|null} the Element found or null.
       @example let elem = this.querySelector("#myElement");
    */

    querySelector(query) {}

    /**
       Create a virtual DOM element of type specified by elementType. It is similar to the native DOM API, which uses the global `document.createElement`, (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement). elementType is one of "div", "canvas", "textarea", "iframe", "video", or "img".

       @param {string} elementType - the type element to instanciate
       @public
       @returns {Element} An instance or sub-instance of Element
       @example let elem = this.createElement("canvas");
    */
    createElement(name) {}

    /**
       * Set a list of expanders to the receiver (on the model side). The argument can be either a single string, in which case set the list to be an array of one expander, or an array of string to specify the list of expanders.

       * If a string has a form of a dot-delimited __libraryName__.__expanderName__, the expander code is looked up from the "library" of the receiver.  If the string is a valid expander definition that starts with the keyword `class`, it is treated as an expander definition. The first form is provided to save space when there are many instances of Element that shares the same expander.

       @public
       @param {string|string[]} code - singleton code (a string) or an array of strings that specify expanders
       * @example
       * this.setCode("myLib.MyExpander");
       * @example
       * this.setCode("class C {onClick {this.remove();}}");
       * @example
       * this.setCode(["myLib.MyExpander", "myLib.YourExpander"]);
    */
    setCode(code) {}

    /**
       Add a list of expanders to the receiver. The difference from `setCode()` is that `setCode()` removes all existing expanders while `addCode()` doesn't.

       @public
       @param {string|string[]} code - singleton code (a string) or an array of strings that specifies expanders
       @example this.addCode("myLib.MyExpander");
    */
    addCode(code) {}

    /**
       Return the list of expanders.

       @public
       @returns {string|string[]} - singleton code (a string) or an array of strings that specifies expanders
    */
    getCode() {}

    /**
       Set a list of expanders to the View of the receiver. The argument can be either a single string, in which case set the list to be an array of one expander, or an array of string to specify the list of expanders.

       @public
       @param {string|string[]} code - singleton code (a string) or an array of strings that specify expanders
       * @example
       * this.setViewCode("myLib.MyExpander");
       * @example
       * this.setViewCode("class C {onClick {this.remove();}}");
       * @example
       * this.setViewCode(["myLib.MyExpander", "myLib.YourExpander"]);
       */

    setViewCode(code) {}

    /**
       Add a list of expanders to the View of the receiver.  The difference from `setViewCode()` is that `setViewCode()` removes all existing expanders while `addViewCode()` doesn't.

       @public
       @param {string|string[]} code - singleton code (a string) or an array of strings that specifies expanders
       @example this.addViewCode("myLib.MyExpander");
    */

    addViewCode(code) {}

    /**
       Return the list of expanders for the view

       @public
       @returns {string|string[]} - singleton code (a string) or an array of strings that specifies expanders
    */
    getViewCode() {}

    /**
       The style string is stored in the Element, and added to the native display scene as a `<style>` node. Note that it is in the global scope so the CSS selector may be picked up by other elements.

       @public
       @param {string} style - CSS classes to be included in the document
       @example this.setStyleClasses(`.foo {background-color: black}`);
    */

    setStyleClasses(style) {}

    /**
       Append the `style` to the existing `styleClasses` string.
       @public
       @param {string} style - CSS classes to be included in the document
       @example this.addStyleClasses(`.bar {width: 10px}`);
    */

    addStyleClasses(style) {}

    /**
       Returns the content in the Library mechanism. Typically a Library for an app is set up upon the load time of the app. The path is in the form of "__libraryName.__item__" and the value of the specified item is returned. The return value is either a function or expander as a string, or an actual class object if specified items is in the `classes` array of the library.

       @public
       @param {string} path - dot-delimited path to the library in the Element and its ancestors
       @returns {string|class|null}
       @example this.getLibrary("myLib.MyClass");
    */

    getLibrary(path) {}

    /**
       Store a value for the model in the property dictionary of the receiver. (N.B. The underscore in the method name is a reminder that the value has to be a data structure that Croquet serializer can serialize.)

       @public
       @param {string} name - name of the property
       @param {any} value - the new value of the property. It should be serializable by the Croquet Serializer
       @example this._set("myData", new Map());
    */

    _set(name, value) {}

    /**
       Retrive the value for name in the Element's property dictionary.

       @public
       @param {string} name - name of the property
       @returns {any} The value of the property.
       @example this._get("myData");
    */

    _get(name) {}

    /**
       Deletes the entry from the Element's property dictionary.

       @public
       @param {string} name - name of the property to be deleted
       @example this._delete("myData");
    */
    _delete(name) {}

    /**
       Subscribe to a Croquet message specified by the `scope` and `eventName`. The method specified by the `methodName` is invoked when the Croquet message is delivered to the model.

       * `Scope` and `eventName` can be arbitrary strings. A common practice is to use the model ID (not confused with domId) as the scope to indicate that the message is related to the element, and eventName is a representative name.

       @public
       @param {string} scope - scope of Croquet message
       @param {string} eventName - name of the event of Croquet message
       @param {string} methodName - name of the expander method to invoke
       @example this.subscribe(this.id, "myMessage", "myMessageHandler");
    */

    subscribe(scope, eventName, methodName) {}

    /**
       Sends a Croquet message in `scope` and `eventName` with data as payload.
       @public
       @param {string} scope - scope of Croquet message
       @param {string} eventName - name of the event of Croquet message
       @param {any} data - a serializable value
       @example this.publish(this.id, "myMessage", {a: 1, b: 2});
    */

    publish(scope, eventName, data) {}

    /**
     Invoke a method in the specified expander with arguments on the receiver. It results in an error if there is no expander with the name or the expander does not have a method of the name.

     * There is no need to use this form if the method is invoked from the same expander. In some cases, however, it is desirable to be able to invoke a method from a different expander, or a method of a different receiver.

     @public
     @param {string} expanderName - name of the expander
     @param {string} methodName - the scope of Croquet message
     @param {any} ...arguments - arguments for the method
     @returns {any} the return value from the method
     @example other.call("OtherExander", "myMethod", 1, 2, 3);
    */

    call(expanderName, methodName, ...args) {}
}
