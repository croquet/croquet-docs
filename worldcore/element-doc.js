/**
 Elements represent the xxxxxx adaptation of the HTML Document Object Model to Croquet. While basic API are model after the [DOM spec](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), it has Croquet-specific features. On the other hand, it omits some types elements in the standard.

Elements are created and appended to the "top" element to form a tree. For each Element model object, a corresponding ElementView object is created.  Further more, for each ElementView object instanciates the corresponding native DOM element.
When some code updates a property on an the Element model, the framework applies the change to the native DOM element.  The View side code can manipulate the View object as well as the native DOM element

A virtual DOM eleme   nt holds its parent element (`parentNode`), the list of children (`childNodes`), the dictionary of style properties (`style`), its DOM ID (renamed to `domId` to avoid name conflict with Croquet model id), CSS class list (`classList`), and the static part of the sub element in the HTML form (`innerHTML`).

It also stores a set of [expander](https://croquet.io/q/docs/en/vdom.md.html) code for the model side of the Element, and another set for its View counterpart. An Element also contains the string representation of CSS class definitions.

A subset of commonly used DOM API is implemented for Element. For instance, methods such as `appendChild()` and `removeChild()` can be used to set up the display scene.

The set of expanders for Element (`code`) or ElementView (`viewCode`) are converted to an executable form. Typically an expander has an API call to add an event listenr (`addEventListener()`) or a Croquet event subscription (`subscribe()`) to trigger a method in it.

Element has several subclasses for custom DOM element types. There are subclasses for `iframe`, [`canvas`](@CanvasElement), [`video`](@VideoElement), [`img`](@ImageElement), and [`textarea`](@TextElement). The first four are relatively simple wrapper to handle specific features. The `textarea` creates a multi-user collaborative text editor implementation. Other elements types (such as `ul`, `select`, `h1`, etc.) are not included, as a `div` element with style and event handlers can mimick them. But when need arises, we could add them to the framework.

 @example
 * this.createElement("div");
 @public
 @hideconstructor
 */
class Element {
    /**
       The virtualized `CSSStyleDeclaration` object for the receiver. It has `setProperty()` `getPropertyValue()`, and `removeProperty()` (A subset of spec described in [CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)).

       @readonly
       @public
       @type {Style}
     */

    get style() {}

    /**
       The `classList` of the receiver. The `classList` object has `add()`, `remove()`, `replace()`, and `contains()`. (a subset of spec described in [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)).

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
     Add a child Element to an Element to the end of `childNodes` list.

     @param {Element|ElementRef} elem - the child element to be added
     @public
     @example
     let another = this.createElement("div"); this.appendChild(another);
    */
    appendChild(elem) {}

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

    addEventListener(eventType, methodName, useCapture) {}

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

/**
   ElementViews manages the view side faculty for Elements. An ElementView is created when a virtual DOM Element is created.bel An ElementView in turn creates the corresponding native DOM element and insert it into the actual DOM display scene.

   When a subclasses of Element, such as IFrameElement, is created, corresponding view class is instanciated, and in turn the right native DOM element is created.

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
       The actual DOM element created for Element. Attaching a native event listner (e.g. call `this.dom.addEventListener("click", (evt) => this.method(evt))` is legit if the listener needs the actual event object), or setAtribures of the element.
       @type {HTMLElement}
       @public
    */
    get dom() {}

    /**
       Add an event listener to the ElementView. A typical case is to call `addEventListener()` from an expander for the ElementView. In that case, the method is looked up from the calling expander.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @param {boolean=} useCapture - indicating if the event will be dispatched elements below
       @example this.addEventListener("click", "onClick"); // onClick is the name of a method
    */

    addEventListener(eventType, methodName) {}

    /**
       Removes an event listener from ElementView.

       @public
       @param {string} eventType - the DOM event type
       @param {string} methodName - the name of the handler in the calling expander
       @example this.removeEventListener("click", "onClick");
    */

    removeEventListener(eventName, methodName) {}

    /**
       Look up an ElementView that matches the specified query. (cf. https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)  As of writing, `querySelector` is restricted to the \#id form.

       @public
       @param {string} query - \# followed by a domId
       @returns {ElementView|null} the ElementView found or null.
       @example let elem = this.querySelector("#myElement");
    */

    querySelector(query) {}

    /**
       Creates an object that contains most properties. The returned object is serializable and can be sent to the model.

       @public
       @param {DOMEvent} evt - A DOM event that may be delivered to the element via a listner added to the native DOM element
       @returns {Object} An object that contains important values of the event.
       @example let cookedEvent = this.cookEvent(aDOMEvent);
    */

    cookEvent(evt) {}

    /**
       Invokes a method in the specified expander with arguments on the receiver. It results in an error if there is no expander with the name or the expander does not have a method of the name. There is no need to use this form if the method is invoked from the same expander. In some cases, however, it is desirable to be able to invoke a method from a different expander, a method of a different receiver.

       @public
       @param {string} expanderName - name of the expander
       @param {string} methodName - the scope of Croquet message
       @param {any} ...arguments - arguments for the method
       @returns {any} the return value from the method
       @example other.call("OtherExander", "myMethod", 1, 2, 3);
    */

    call(expanderName, methodName, ...args) {}

    /**
       `setPointerCapture()` and `releasePointerCapture()` calls the pointer event capture feature of the native DOM (cf [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)). Another method, `releaseAllPointerCapture()`, is a convenice method to make sure that all captured pointers are released.  As Croquet is a multi user environment, remote users' actions may break some assumptions about the capturing DOM element. This method tries to mitigate issues around capturing.

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

       `releaseAllPointerCapture()` is a convenice method to make sure that all captured pointers are released.  As Croquet is a multi user environment, remote users' actions may break some assumptions about the capturing DOM element. This method tries to mitigate issues around capturing.
       @public
    */

    releaseAllPointerCapture() {}
}

/**
CanvasElement is a virtual Canvas element.

It has two specific style properties called -cards-pixelWidth and -cards-pixelHeight.

When those values in the style dictionary changes, the DOM attributes of the corresponding native canvas element are updated.

 @public
 @hideconstructor
*/

class CanvasElement extends Element {
}

/**
   IFrameElement is a virtual IFrame element. Some attributes are stored in the virtual DOM properties (via `_set()` and `_get()`), and changes in them are applied to the native DOM element.

   It also has allow, importance, name, referrerpolicy, sandbox, and width properties.

   Those are also (mostly) standard attributes and when they change on the virtual element via _set(), the native DOM attriburtes are updated.

 @public
 @hideconstructor
*/

class IFrameElement extends Element {
}

/**
ImageElement is a virtual Image element. The src property supports Croquet Data API handle, in addition to the regular string.
 @public
 @hideconstructor
*/
class ImageElement extends Element {

    /**
       Note that this is not a property of the object, but accessed via _set() and _get(). If the element has `src` in the property dictionary (set by _set()), the native element's src is updated. If the value is a string, it is simply assigned. If it is a Croquet Data API handle, the data is fetched via the API, and the blob created from the data is assigned into the src attribute.

       @type {string|{handle: DataHandle, type: string}}
       @public

    */
    get src() {}
}

/**
The View for the ImageElement. It has two ImageElementView specific properties.

@public
@hideconstructor
*/

class ImageElementView extends ElementView {
    /**
        If the view has a property named `onload`, it is assumed to be a two-element array whose first element specifies the name of an expander installed to this view and the second element specifies the method name to invoke. When the native DOM img element errors in loading an image, the specified method is invoked.

        @type {Array}
        @public
        @example this.onload = ["ImageLoadNotifier", "onLoad"];
    */

    get onload() {}

    /**
        If the view has a property named `onerror`, it is assumed to be a two-element array whose first element specifies the name of an expander installed to this view and the second element specifies the method name to invoke. When the native DOM img element errors in loading an image, the specified method is invoked.

        @type {Array}
        @public
        @example this.onerror = ["ImageLoadNotifier", "onError"];
    */
    get onerror() {}
}

/**
   VideoElement is a virtual video element. It does not have a Croquet specific properties on the model side, but its view has a set of methods and properties that are compatible with the native HTMLVideoElement.

   @public
   @hideconstructor
*/
class VideoElement extends Element {
}

/**
   VideoElementView is the View for VideoElement. It does not have a Croquet specific properties on the model side, but its view has a set of methods and properties that are compatible with the native HTMLVideoElement.

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
       `play()` is are a thin wrapper around the native DOM.
       @public
    */
    play() {}
}

/**
   TextElement is a fully collaborative text area where each of multiple users has a cursor, and can independently edit the content.  It has a set ofpre-determined Croquet messages that the element sends and receives.

   @public
   @hideconstructor
*/

class TextElement extends Element {
    init() {
        /**
         * `text` Croquet message.
         *
         * When the content is "accepted" (by pressing Cmd-S or Ctrl-S in the view), a Croquet event of the form:

         this.publish(this.id, "text" {ref: <ElementRef>, text: <string>});

         * will be published.

         @public
         @event TextElement#text
         @type {object}
        */


        /**
         * changed Croquet message
         *
         * When the content changesa Croquet event of the form:

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
       Set the styled content. When `content` is a string, it is simply used When `content` is an array, it is assumed to have the type:

       [{text: str<string>, style?: {font?: font<string>, size?: size<number>, color?: color<string>, bold?: bold<boolean>, italic?: italic<boolean>}}]

       @public
       @param {string|runs[]} - new content
    */

    load(content) {}
}
