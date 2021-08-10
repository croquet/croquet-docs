declare module "@croquet/virtual-dom" {
    /**
       @class
       @ignore
    */
    class Model {}
    /**
       @class
       @ignore
    */
    class View {}
    /**
       @class
       @ignore
    */
    class ElementRef {}
    /**
       @class
       @ignore
    */
    class Style {}
    /**
       @class
       @ignore
    */
    class CookedEvent {}
    /**
       @class
       @ignore
    */
    class HTMLElement {}
    /**
       @class
       @ignore
    */
    class DOMEvent {}
    /**
       @class
       @ignore
    */
    class DataHandle {}
    /**
       @class
       @ignore
    */
    class ClassList {
        add(...names:string[]): void;
        remove(...names:string[]): void;
        replace(oldToken:string, newToekn:string): void;
        contains(token:string): boolean;
    }

    class Library {
        classses: [string];
        functions: [string];
        expanders: [string];
    }

    /**
       Elements represent the adaptation of the HTML Document Object Model to Croquet. While basic API are model after the [DOM spec](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), it has Croquet-specific features. On the other hand, it omits some types elements in the standard.
      @example this.createElement("div");
      @public
      @hideconstructor
    */
    export class Element {
        /**     
                Add a child Element to an Element to the end of `childNodes` list.

                @public
                @param elem - the child element to be added
        */
        appendChild(elem: Element|ElementRef): void;

        /**
           Add a child element in front of `referenceElem` in the `childNodes` list. If `referenceElem` is `null`, the element is added at the end of the list.

           @public
           @param elem - the child element to be added
           @param referenceElem - the child element to be added
        */
        insertBefore(elem :Element|ElementRef, refelenceElem?: (Element|ElementRef)):void;

        /**
           Remove the receiver from its parent's `childNodes`. If the receiver is not in the display scene, this method does not have any effects.

           @public
        */
        remove():void;

        /**
           remove specified elem from childNodes of the receiver.

           @public
           @param elem - the child element to be removed
        */
        removeChild(elem: Element|ElementRef):void;

        /**
           Add a listener for a DOM event specified by `eventType` to the receiver.

           It resembles the native DOM's addEventListener but the second argument is restricted to a string that specifies the name of a method to conform Croquet Model.

           A typical case is to call `addEventListener()` from an expander. In that case, the method is looked up from the calling expander.

           @public
           @param eventType - the DOM event type
           @param methodName - the name of the handler in the calling expander
           @param useCapture - indicating if the event will be dispatched elements below
        */

        addEventListener(eventType: string, methodName: string, useCapture?: boolean):void;

        /** 
            Remove the specified event listener from the element.

            @public
            @param  eventType - the DOM event type
            @param  methodName - the name of the handler in the calling expander
        */

        removeEventListener(eventType:string, methodName:string):void;

        /**
           Look up an element that matches the specified query. (cr. https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)  However, As of writing, querySelector only works with the `#id` form.

           @public
           @param   query - \# followed by a domId
           @returns the Element found or null.
        */

        querySelector(query: string): (Element|null);

        /**
           Create a virtual DOM element of type specified by elementType. It is similar to the native DOM API, which uses the global `document.createElement`, (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement). elementType is one of "div", "canvas", "textarea", "iframe", "video", or "img".

           @public
           @param  elementType - the type element to instanciate
           @returns  An instance or sub-instance of Element
        */
        createElement(name:string): Element;

        /**
           Set a list of expanders to the receiver (on the model side). The argument can be either a single string, in which case set the list to be an array of one expander, or an array of string to specify the list of expanders.

           If a string has a form of a dot-delimited __libraryName__.__expanderName__, the expander code is looked up from the "library" of the receiver.  If the string is a valid expander definition that starts with the keyword `class`, it is treated as an expander definition. The first form is provided to save space when there are many instances of Element that shares the same expander.

           @param code - singleton code (a string) or an array of strings that specify expanders
           @public
        */
        setCode(code:string|[string]): void;

        /**
           Add a list of expanders to the receiver. The difference from `setCode()` is that `setCode()` removes all existing expanders while `addCode()` doesn't.

           @param code - singleton code (a string) or an array of strings that specifies expanders
           @public
        */
        addCode(code:string|[string]):void;

        /**
           Return the list of expanders.

           @public
           @returns an array of strings that specifies expanders
        */
        getCode():[string];

        /**
           Set a list of expanders to the View of the receiver. The argument can be either a single string, in which case set the list to be an array of one expander, or an array of string to specify the list of expanders.

           @public
           @param code - singleton code (a string) or an array of strings that specify expanders
        */

        setViewCode(code:string|[string]):void;

        /**
           Add a list of expanders to the View of the receiver.  The difference from `setViewCode()` is that `setViewCode()` removes all existing expanders while `addViewCode()` doesn't.

           @param code - singleton code (a string) or an array of strings that specifies expanders 
           @public
        */

        addViewCode(code:string|[string]):void;

        /**
           Return the list of expanders for the view

           @public
           @returns singleton code (a string) or an array of strings that specifies expanders
        */
        getViewCode():void;

        /**
           The style string is stored in the Element, and added to the native display scene as a `<style>` node. Note that it is in the global scope so the CSS selector may be picked up by other elements.

           @public
           @param style - CSS classes to be included in the document
        */
        setStyleClasses(style: string):void;

        /**
           Append the `style` to the existing `styleClasses` string.
           @param style - CSS classes to be included in the document
        */
        addStyleClasses(style: string):void;

        /**
           Returns the content in the Library mechanism. Typically a Library for an app is set up upon the load time of the app. The path is in the form of "__libraryName.__item__" and the value of the specified item is returned. The return value is either a function or expander as a string, or an actual class object if specified items is in the `classes` array of the library.

           @public
           @param path - dot-delimited path to the library in the Element and its ancestors
           @return An object that contains expanders, classes, and functions arrays.
        */
        getLibrary(path:string):Library;

        /**
           Store a value for the model in the property dictionary of the receiver. (N.B. The underscore in the method name is a reminder that the value has to be a data structure that Croquet serializer can serialize.)

           @public
           @param name - name of the property
           @param value - the new value of the property. It should be serializable by the Croquet Serializer
        */
        _set(name:string, value:any):void;

        /**
           Retrive the value for name in the Element's property dictionary.

           @public
           @param name - name of the property
           @returns The value of the property.
        */

        _get(name:string):any;

        /**
           Deletes the entry from the Element's property dictionary.

           @public
           @param name - name of the property to be deleted
        */
        _delete(name:string):void;

        /**
           Subscribe to a Croquet message specified by the `scope` and `eventName`. The method specified by the `methodName` is invoked when the Croquet message is delivered to the model.

           `Scope` and `eventName` can be arbitrary strings. A common practice is to use the model ID (not confused with domId) as the scope to indicate that the message is related to the element, and eventName is a representative name.

           @public
           @param scope - scope of Croquet message
           @param eventName - name of the event of Croquet message
           @param methodName - name of the expander method to invoke
        */
        subscribe(scope:string, eventName:string, methodName:string):void;

        /**
           Sends a Croquet message in `scope` and `eventName` with data as payload.
           @public
           @param scope - scope of Croquet message
           @param eventName - name of the event of Croquet message
           @param data - a serializable value
        */
        publish(scope:string, eventName:string, data:any):void;

        /**
           Invoke a method in the specified expander with arguments on the receiver. It results in an error if there is no expander with the name or the expander does not have a method of the name.

           There is no need to use this form if the method is invoked from the same expander. In some cases, however, it is desirable to be able to invoke a method from a different expander, or a method of a different receiver.

           @public
           @param expanderName - name of the expander
           @param methodName - the scope of Croquet message
           @param  args - arguments for the method
           @returns  the return value from the method
        */

        call(expanderName:string, methodName:string, ...args:any):any;

        /**
           The virtualized `CSSStyleDeclaration` object for the receiver. It has `setProperty()` `getPropertyValue()`, and `removeProperty()` (A subset of spec described in [CSSStyleDeclaration](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration)).
       
           @public
        */

        style: Style;

        /**
           The `classList` of the receiver. The `classList` object has `add()`, `remove()`, `replace()`, and `contains()`. (a subset of spec described in [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)).

           @public
        */
        classList:ClassList;

        
        /**
           Element's DOM ID.
           @public
        */

        domId:string;
    }

    /**
       ElementViews manages the view side faculty for Elements. An ElementView is created when a virtual DOM Element is created.bel An ElementView in turn creates the corresponding native DOM element and insert it into the actual DOM display scene.

       When a subclasses of Element, such as IFrameElement, is created, corresponding view class is instanciated, and in turn the right native DOM element is created.

       @public
       @hideconstructor
    */

    
    export class ElementView {
        /**
           The corresponding model (Element).
           @public
        */
        model: Element;

        /**
           The actual DOM element created for Element. Attaching a native event listner (e.g. call `this.dom.addEventListener("click", (evt) => this.method(evt))` is legit if the listener needs the actual event object), or setAtribures of the element.
           @type
           @public
        */
        dom: HTMLElement;

        /**
           Add an event listener to the ElementView. A typical case is to call `addEventListener()` from an expander for the ElementView. In that case, the method is looked up from the calling expander.

       @public
       @param eventType - the DOM event type
       @param methodName - the name of the handler in the calling expander
       @param useCapture - indicating if the event will be dispatched elements below
        */
        addEventListener(eventType:string, methodName:string, useCapture?: boolean)

        /**
           Removes an event listener from ElementView.
           
           @public
           @param eventType - the DOM event type
           @param methodName - the name of the handler in the calling expander
        */
        removeEventListener(eventName:string, methodName:string)

        /**
           Look up an ElementView that matches the specified query. (cf. https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)  As of writing, `querySelector` is restricted to the \#id form.

           @public
           @param query - \# followed by a domId
           @returns the ElementView found or null.
        */
        querySelector(query:string): (ElementView|null)

        /**
           Creates an object that contains most properties. The resulting object is serializable and can be sent to the model.

           @public
           @param evt - A DOM event that may be delivered to the element via a listner added to the native DOM element
           @returns An object that contains important values of the event.
        */
        cookEvent(evt:DOMEvent):CookedEvent;

        /**
           Invokes a method in the specified expander with arguments on the receiver. It results in an error if there is no expander with the name or the expander does not have a method of the name. There is no need to use this form if the method is invoked from the same expander. In some cases, however, it is desirable to be able to invoke a method from a different expander, a method of a different receiver.

           @public
           @param expanderName - name of the expander
           @param methodName - the scope of Croquet message
           @param  ...args - arguments for the method
           @returns the return value from the method
        */
        call(expanderName:string, methodName:string, ...args:any):any;

        /**
           `setPointerCapture()` and `releasePointerCapture()` calls the pointer event capture feature of the native DOM (cf [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)). Another method, `releaseAllPointerCapture()`, is a convenice method to make sure that all captured pointers are released.  As Croquet is a multi user environment, remote users' actions may break some assumptions about the capturing DOM element. This method tries to mitigate issues around capturing.

           @public
           @param pointerId - the ID of the pointer
        */
        setPointerCapture(pointerId:number):void;

        /**
           @public
           @param pointerId - the ID of the pointer
        */
        releasePointerCapture(pointerId:number):void;

        /**
           @public
        */
        releaseAllPointerCapture():void;
    }

    /**
       CanvasElement is a virtual Canvas element.

       It has two specific style properties called -cards-pixelWidth and -cards-pixelHeight.

       When those values in the style dictionary changes, the DOM attributes of the corresponding native canvas element are updated.

       @public
       @hideconstructor
       @noInhericDoc
    */

    export class CanvasElement {
    }

    /**
       IFrameElement is a virtual IFrame element. Some attributes are stored in the virtual DOM properties (via `_set()` and `_get()`), and changes in them are applied to the native DOM element.

       It also has allow, importance, name, referrerpolicy, sandbox, and width properties.

       Those are also (mostly) standard attributes and when they change on the virtual element via _set(), the native DOM attriburtes are updated.

       @public
       @hideconstructor
    */

    export class IFrameElement {
    }
    
    /**
       ImageElement is a virtual Image element. The src property supports Croquet Data API handle, in addition to the regular string.
       @public
       @hideconstructor
    */
    export class ImageElement {

        /**
           Note that this is not a property of the object, but accessed via _set() and _get(). If the element has `src` in the property dictionary (set by _set()), the native element's src is updated. If the value is a string, it is simply assigned. If it is a Croquet Data API handle, the data is fetched via the API, and the blob created from the data is assigned into the src attribute.

           @public
        */
        src:string|{handle: DataHandle, type: string}
    }

    /**
       The View for the ImageElement. It has two ImageElementView specific properties.

       @public
       @hideconstructor
    */

    export class ImageElementView {
        /**
           If the view has a property named onload, it is assumed to be a period delimited string whose first part specifies the name of an expander installed to this view and the second part specifies the method name to invoke.

        @public
        */
        onload?: string;

        /**
           If the view has a property named onerror, it is assumed to be a period delimited string whose first part specifies the name of an expander installed to this view and the second part specifies the method name to invoke.

           @public
        */
        onerror: string;
    }

    /**
       VideoElement is a virtual video element. It does not have a Croquet specific properties on the model side, but its view has a set of methods and properties that are compatible with the native HTMLVideoElement.
       
       @public
       @hideconstructor
    */
    export class VideoElement {
    }

    /**
       VideoElementView is the View for VideoElement. It does not have a Croquet specific properties on the model side, but its view has a set of methods and properties that are compatible with the native HTMLVideoElement.
       
       @public
       @hideconstructor
    */
    export class VideoElementView {
        /**
           same as the property of the DOM video element
           @public
        */
        muted: boolean;

        /**
           same as the property of the DOM video element
           @public
        */
        playsInline:boolean;
        /**
           same as the property of the DOM video element
           @public
        */
        srcObject:any;

        /**
           `play()` is are a thin wrapper around the native DOM.
           @public
        */
        play():void;
    }

    /**
       TextElement is a fully collaborative text area where each of multiple users has a cursor, and can independently edit the content.  It has a set ofpre-determined Croquet messages that the element sends and receives.

       @public
       @hideconstructor
    */
    
    export class TextElement {
        /**
           The string represents the content of the text area.
           @public
        */
        value:string

        /**
         * text Croquet message. (not a property). 
         *
         * When the content is "accepted" (by pressing Cmd-S or Ctrl-S in the view), a Croquet event of the form:

         this.publish(this.id, "text" {ref: ElementRef, text: string});

         * will be published.

         @public
        */

        text:any;

        /**
         * changed Croquet message (not a property).
         *
         * When the content changesa Croquet event of the form:

         this.publish(this.id, "changed", {ref: this.asElementRef()});

         * will be published.

         @public
        */

        changed:any

        /**
           Set the styled content. When `content` is a string, it is simply used When `content` is an array, it is assumed to have the type:

           [{text: string, style?: {font?: font<string>, size?: size<number>, color?: color<string>, bold?: bold<boolean>, italic?: italic<boolean>}}]

           @public
           @param  - new content
        */
        
        load(content:string|[string]):void;
    }
}
