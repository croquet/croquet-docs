/**
 Elements represent the adaptation of the HTML Document Object Model to Croquet. While the basic API is modeled after the [DOM spec](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), it has Croquet-specific features. On the other hand, it omits some types of elements in the standard.

Elements are created and appended to the "top" element to form a tree. For each Element model object, a corresponding ElementView object is created.  Each ElementView object instantiates the corresponding native DOM element.
When some code updates a property on an Element model, the framework applies the change to the native DOM element.  The View side code can manipulate the View object as well as the native DOM element.

A virtual DOM element holds its parent element (`parentNode`), the list of children (`childNodes`), the dictionary of style properties (`style`), its DOM ID (renamed to `domId` to avoid name conflict with Croquet model id), CSS class list (`classList`), and the static part of the sub-element in HTML form (`innerHTML`).

It also stores a set of [expander](https://croquet.io/q/docs/en/vdom.md.html) code blocks for the model side of the Element, and another set for its View counterpart. An Element also contains a string representation of its CSS class definitions.

A subset of the commonly used DOM API is implemented for Element. For instance, methods such as `appendChild()` and `removeChild()` can be used to set up the display scene.

The set of expanders for Element (`code`) or ElementView (`viewCode`) are converted to an executable form. Typically an expander has an API call to add an event listener (`addEventListener()`) or a Croquet event subscription (`subscribe()`) to trigger a method in it.

Element has several subclasses for custom DOM element types. There are subclasses for `iframe`, [`canvas`](@CanvasElement), [`video`](@VideoElement), [`img`](@ImageElement), and [`textarea`](@TextElement). The first four are relatively simple wrappers to handle specific features. The `textarea` creates a multi-user collaborative text editor. Other element types (such as `ul`, `select`, `h1`, etc.) are not included, as a `div` element with style and event handlers can mimic them. But when the need arises, we could add them to the framework.

 @example
 * this.createElement("div");
 @public
 @hideconstructor
 */
class Element {
    /**
       The virtualized `CSSStyleDeclaration` object for the receiver. It has `setProperty()` `getPropertyValue()`, and `removeProperty()` (a subset of the spec described in [CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)).

       @readonly
       @public
       @type {Style}
     */

    get style() {}

    /**
       The `classList` of the receiver. The `classList` object has `add()`, `remove()`, `replace()`, and `contains()` (a subset of the spec described in [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)).

       @public
       @readonly
       @type {ClassList}
     */

    get classList() {}

    /**
       Element's DOM ID.

       @public
       @type {string|undefined}
    */

    get domId() {}

    /**
     Add a child Element to the end of an Element's `childNodes` list.

     @param {Element|ElementRef} elem - the child element to be added
     @public
     @example
     let another = this.createElement("div"); this.appendChild(another);
    */
    appendChild(elem) {}

    /**
        Add a child Element in front of `referenceElem` in the `childNodes` list. If `referenceElem` is `null`, the element is added at the end of the list.

        @public
        @param {Element|ElementRef} elem - the child element to be added
        @param {(Element|ElementRef)=} referenceElem - the child element to be added
        @example
        let anchor = this.querySelector("#myElem"); this.insertBefore(another, anchor);

    */
    insertBefore(elem, referenceElem) {}

    /**
       Remove the receiver from its parent's `childNodes`. If the receiver is not in the display scene, this method does not have any effect.

        @public
        @example
        another.remove();
    */
    remove() {}

    /**
        Remove the specified Element from the receiver's `childNodes`.

        @public
        @param {(Element|ElementRef)=} elem - the child element to be removed
        @example this.removeChild(another);
    */
    removeChild(elem) {}

    /**
       * Add a listener for a DOM event specified by `eventType` to the receiver.

       * This resembles the native DOM's addEventListener, but the second argument is restricted to a string that specifies the name of a method, to conform to Croquet's Model.

       * A typical case is to call `addEventListener()` from an expander. In that case, the method is looked up from the calling expander.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @param {boolean=} useCapture - indicating if the event will be dispatched to elements below
       @example this.addEventListener("click", "onClick"); // onClick is the name of a method
    */

    addEventListener(eventType, methodName, useCapture) {}

    /**
       Remove the specified event listener from the Element.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @example this.removeEventListener("click", "onClick");
    */

    removeEventListener(eventType, methodName) {}

    /**
       Look up an Element that matches the specified query. This is similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector but, as of writing, it only works with the `#id` form.

       @public
       @param {string} query - \# followed by a domId
       @returns {Element|null} the Element found, or null.
       @example let elem = this.querySelector("#myElement");
    */

    querySelector(query) {}

    /**
       Create a virtual DOM Element of type specified by elementType. It is similar to the native DOM API, which uses the global `document.createElement` (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement). elementType is one of "div", "canvas", "textarea", "iframe", "video", or "img".

       @param {string} elementType - the type element to instantiate
       @public
       @returns {Element} An instance or sub-instance of Element
       @example let elem = this.createElement("canvas");
    */
    createElement(name) {}

    /**
       * Set the receiver's list of expanders (on the model side). The argument can be either a string specifying a single expander, or an array of strings to specify multiple expanders.

       * If a string has the dot-delimited form __libraryName__.__expanderName__, the expander code is looked up from the "library" of the receiver.  Alternatively, a string can contain a full expander definition starting with the keyword `class`. The first form is provided to save space when there are many instances of Element that share the same expander.

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
       @param {string|string[]} code - singleton code (a string) or an array of strings that specify expanders
       @example this.addCode("myLib.MyExpander");
    */
    addCode(code) {}

    /**
       Return the list of expanders.

       @public
       @returns {string|string[]} - singleton code (a string) or an array of strings that specify expanders
    */
    getCode() {}

    /**
       Set the list of expanders for the receiver's View. The argument can be either a string specifying a single expander, or an array of strings to specify multiple expanders.

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
       Add a list of expanders to the receiver's View.  The difference from `setViewCode()` is that `setViewCode()` removes all existing expanders while `addViewCode()` doesn't.

       @public
       @param {string|string[]} code - singleton code (a string) or an array of strings that specify expanders
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
       The style string is stored in the Element, and added to the native display scene as a `<style>` node. Note that it is in the global scope so the CSS selectors may be picked up by other elements.

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
       Returns the content in the Library mechanism. Typically a Library for an app is set up at the app's load time. The path is in the form __libraryName__.__item__, and the value of the specified item is returned. The return value is either a function or expander as a string, or an actual class object if specified item is in the `classes` array of the library.

       @public
       @param {string} path - dot-delimited path to the library in the Element and its ancestors
       @returns {string|class|null}
       @example this.getLibrary("myLib.MyClass");
    */

    getLibrary(path) {}

    /**
       Store a value in the property dictionary for the receiver Element. NB: The underscore in the method name is a reminder that the value has to be a data structure that the Croquet serializer can serialize.

       @public
       @param {string} name - name of the property
       @param {any} value - the new value of the property. It must be serializable by the Croquet Serializer.
       @example this._set("myData", new Map());
    */

    _set(name, value) {}

    /**
       Retrieve the value for name in the Element's property dictionary.

       @public
       @param {string} name - name of the property
       @returns {any} The value of the property.
       @example this._get("myData");
    */

    _get(name) {}

    /**
       Delete the entry from the Element's property dictionary.

       @public
       @param {string} name - name of the property to be deleted
       @example this._delete("myData");
    */
    _delete(name) {}

    /**
       Subscribe to a Croquet message specified by `scope` and `eventName`. The method specified by the `methodName` is invoked when the Croquet message is delivered to the model.

       * `Scope` and `eventName` can be arbitrary strings. A common practice is to use the model ID (not to be confused with domId) as the scope to indicate that a message is related to a given Element, and eventName to specify the message's purpose.

       @public
       @param {string} scope - Croquet message scope
       @param {string} eventName - Croquet message event name
       @param {string} methodName - name of the expander method to invoke
       @example this.subscribe(this.id, "myMessage", "myMessageHandler");
    */

    subscribe(scope, eventName, methodName) {}

    /**
       Send a Croquet message with `scope` and `eventName`, with `data` as payload.
       @public
       @param {string} scope - Croquet message scope
       @param {string} eventName - Croquet message event name
       @param {any} data - a serializable value
       @example this.publish(this.id, "myMessage", {a: 1, b: 2});
    */

    publish(scope, eventName, data) {}

    /**
     Invoke a method in the receiver's specified expander, with arguments. An error will be thrown if the receiver has no expander of that name, or the expander does not include that method.

     * There is no need to use this form if the method is invoked from the same expander. In some cases, however, it is desirable to be able to invoke a method from a different expander, or a method of a different receiver.

     @public
     @param {string} expanderName - name of the expander
     @param {string} methodName - name of the method
     @param {any} ...arguments - arguments for the method
     @returns {any} the return value from the method
     @example other.call("OtherExpander", "myMethod", 1, 2, 3);
    */

    call(expanderName, methodName, ...args) {}
}

/**
   ElementViews manage the view side for Elements. An ElementView is created when a virtual DOM Element is created. An ElementView in turn creates the corresponding native DOM element and inserts it into the actual DOM display scene.

   When a subclass of Element is created, such as IFrameElement, the corresponding view class is instantiated, and in turn the appropriate native DOM element.

 @public
 @hideconstructor
*/
class ElementView {
    /**
       The corresponding model (Element).
       @type {Element}
       @public
    */
    get model() {}

    /**
       The actual DOM element created for Element. Attaching a native event listener (e.g., calling `this.dom.addEventListener("click", (evt) => this.method(evt))`) is reasonable if the listener needs the actual event object, or setAttributes of the element.
       @type {HTMLElement}
       @public
    */
    get dom() {}

    /**
       Add an event listener to the ElementView. A typical case is to call `addEventListener()` from an expander for the ElementView. In that case, the method is looked up from the calling expander.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @param {boolean=} useCapture - indicating if the event will be dispatched to elements below
       @example this.addEventListener("click", "onClick"); // onClick is the name of a method
    */

    addEventListener(eventType, methodName) {}

    /**
       Remove an event listener from the ElementView.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @example this.removeEventListener("click", "onClick");
    */

    removeEventListener(eventName, methodName) {}

    /**
       Look up an ElementView that matches the specified query. This is similar to https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector but, as of writing, it only works with the \#id form.

       @public
       @param {string} query - \# followed by a domId
       @returns {ElementView|null} the ElementView found, or null.
       @example let elem = this.querySelector("#myElement");
    */

    querySelector(query) {}

    /**
       Create an object that contains most of the properties of the supplied raw DOM event. The returned object is serializable and can be sent to the model.

       @public
       @param {DOMEvent} evt - a DOM event that may be delivered to the element via a listener added to the native DOM element
       @returns {Object} an object that contains important values of the event.
       @example let cookedEvent = this.cookEvent(aDOMEvent);
    */

    cookEvent(evt) {}

    /**
       Invoke a method in the receiver's specified expander, with arguments. An error is thrown if the receiver has no expander of that name, or the expander does not include that method. There is no need to use this form if the method is invoked from the same expander. In some cases, however, it is desirable to be able to invoke a method from a different expander, or a method of a different receiver.

       @public
       @param {string} expanderName - name of the expander
       @param {string} methodName - name of the method
       @param {any} ...arguments - arguments for the method
       @returns {any} the return value from the method
       @example other.call("OtherExpander", "myMethod", 1, 2, 3);
    */

    call(expanderName, methodName, ...args) {}

    /**
       `setPointerCapture()` and `releasePointerCapture()` call the pointer event capture features of the native DOM (see [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)). Another method, `releaseAllPointerCapture()`, is a convenience method to make sure that all captured pointers are released.  As Croquet is a multi-user environment, remote users' actions may break some assumptions about the capturing DOM element. This method tries to mitigate issues around capturing.

       @public
       @param {number} pointerId - the ID of the pointer
    */

    setPointerCapture(pointerId) {}

    /**
       @public
       @param {number} pointerId - the ID of the pointer
    */

    releasePointerCapture(pointerId) {}

    /**

       `releaseAllPointerCapture()` is a convenience method to make sure that all captured pointers are released.  As Croquet is a multi-user environment, remote users' actions may break some assumptions about the capturing DOM element. This method tries to mitigate issues around capturing.
       @public
    */

    releaseAllPointerCapture() {}
}

/**
CanvasElement is a virtual Canvas element.

It has two specific style properties called `-cards-pixelWidth` and `-cards-pixelHeight`.

When those values in the style dictionary change, the DOM attributes of the corresponding native canvas element are updated.

 @public
 @hideconstructor
*/

class CanvasElement extends Element {
}

/**
   IFrameElement is a virtual IFrame element. Some attributes are stored in the virtual DOM properties (via `_set()` and `_get()`), and changes in them are applied to the native DOM element.

   It also has `allow`, `importance`, `name`, `referrerpolicy`, `sandbox`, and `width` properties.

   Those are also (mostly) standard attributes, and when they are changed on the virtual element via `_set()`, the native DOM attributes are updated.

 @public
 @hideconstructor
*/

class IFrameElement extends Element {
}

/**
ImageElement is a virtual Image element. The `src` property supports a Croquet Data API handle, in addition to the regular string.
 @public
 @hideconstructor
*/
class ImageElement extends Element {

    /**
       Note that this is not a property of the object, but accessed via `_set()` and `_get()`. If the element has `src` in the property dictionary (set using `_set()`), the native element's `src` is updated. If the value is a string, it is simply assigned. If it is a Croquet Data API handle, the data is fetched via the API, and the blob created from the data is assigned into the `src` attribute.

       @type {string|{handle: DataHandle, type: string}}
       @public

    */
    get src() {}
}

/**
The View for the ImageElement. It has two ImageElementView-specific properties.

@public
@hideconstructor
*/

class ImageElementView extends ElementView {
    /**
        If the view has a property named `onload`, it is assumed to be a two-element array whose first element specifies the name of an expander installed on this view, and the second element specifies a method name in the expander. The designated method is invoked when the native DOM `img` element succeeds in loading an image.

        @type {Array}
        @public
        @example this.onload = ["ImageLoadNotifier", "onLoad"];
    */

    get onload() {}

    /**
        If the view has a property named `onerror`, it is assumed to be a two-element array whose first element specifies the name of an expander installed on this view, and the second element specifies a method name in the expander. The designated method is invoked when the native DOM `img` element encounters an error.

        @type {Array}
        @public
        @example this.onerror = ["ImageLoadNotifier", "onError"];
    */
    get onerror() {}
}

/**
   VideoElement is a virtual video element. It does not have Croquet-specific properties on the model side, but its view has a set of methods and properties that are compatible with the native HTMLVideoElement.

   @public
   @hideconstructor
*/
class VideoElement extends Element {
}

/**
   VideoElementView is the View for a VideoElement. It has a set of methods and properties that are compatible with the native HTMLVideoElement.

   @public
   @hideconstructor
*/
class VideoElementView extends ElementView {
    /**
       same as the property of the DOM video element
       @public
    */
    get muted() {}

    /**
       same as the property of the DOM video element
       @public
    */
    get playsInline() {}
    /**
       same as the property of the DOM video element
       @public
    */
    get srcObject() {}

    /**
       `play()` is a thin wrapper around the native DOM.
       @public
    */
    play() {}
}

/**
   TextElement is a fully collaborative text area where each of multiple users has a cursor, and can independently edit the content.  The Element has a set of Croquet messages that it can send and receive.

   @public
   @hideconstructor
*/

class TextElement extends Element {
    init() {
        /**
         * `text` Croquet message
         *
         * When the content is "accepted" (by pressing Cmd-S or Ctrl-S in the view), a Croquet event of the form:

         this.publish(this.id, "text" {ref: <ElementRef>, text: <string>});

         * will be published.

         @public
         @event TextElement#text
         @type {object}
        */


        /**
         * `changed` Croquet message
         *
         * When the content changes, a Croquet event of the form:

         this.publish(this.id, "changed", {ref: this.asElementRef()});

         * will be published.

         @public
         @event TextElement#changed
         @type {object}
        */
    }

    /**
       The string represents the content of the text area.
       @public
       @type {string}
    */
    get value() {}

    /**
       Set the styled content. When `content` is a string, it is simply used as-is. When `content` is an array, it is assumed to contain styled-text runs of the following form:

       [{text: str<string>, style?: {font?: font<string>, size?: size<number>, color?: color<string>, bold?: bold<boolean>, italic?: italic<boolean>}}]

       @public
       @param {string|runs[]} - new content
    */

    load(content) {}
}
