/**

 * The UIManager is a ViewService that manages the widget user interface. Do not instantiate the UIManager
 * directly. Instead, add the UIManager as a view service in the ViewRoot. You should also add
 * the InputManager, since the UIManager depends upon InputManager events.
 *
 * The UIManager republishes pointer events that don't interact with any control widgets. Sometimes you
 * may want to have a 2D UI that floats above a 3D scene, and let the user click on both. By subscribing
 * to the republished events from the UIManager, you'll only get the clicks that actually fall in the 3D scene.
 * For example:
 * ```
 * this.subscribe("input", "pointerDown", this.onPointerDown); // Handle any pointerDown event anywhere in the window
 * this.subsribe("ui", "pointerDown", this.onPointerDown); // Handle only pointerDown events that are not handled by widgets
 * ```
 *
 * @public
 * @augments ViewService
 * @example
 * class MyViewRoot extends ViewRoot {
    createServices() {
        this.addService(InputManager);
        this.addService(UIManager);
    }
 * }
 */
class UIManager {
    /**
    The UIManager creates a single root CanvasWidget that fills the entire application window
    Other widgets that you create should be added as children to this root widget.
    @public
    @Type CanvasWidget
    @example
    * const ui = this.service("UIManager");
    * const myWidget = new Widget({parent: ui.root});
    */
    get root() {}
}


/**
 * The base class that all widgets inherit from.
  * @public
  * @param {object} [options] - An options object that sets the widget's properties.
  * @augments WorldcoreView
  * @example
  * const myWidget = new Widget({parent: parentWidget, size: [20,20]})
*/

 class Widget {
    constructor(options) {}

    /**
    * Sets one or more properties. Set is called by the widget's [constructor]{@link Widget} to set the widget's properties on instantiation.
    * @public
    * @param {object} [options] - An options object that contains the properties to be set.
    * @example
    * myWidget.set({visible: false});
    */
    set(options) {}

    /**
     * The widget's parent in the widget tree.
     * @public \
     * @type {Widget}
     * */
    get parent() {}

    /**
     * A 2d array containing the widget's xy size.
     * @public
     * @type {Array<number>}
     * */
     get size() {}

    /**
     * A 2d array specifying the xy size the widget relative to it's parent. Values can range from 0-1. If either the x or the y value is 0,
     * that dimension will default to the value of [size()]{@link Widget#size}.
     * @public
     * @default [0,0]
     * @type {Array<number>}
     * @example myWidget.set({autoSize: [1,1]}); // The widget will be the same size as its parent.
     * */
     get autoSize() {}

    /**
     * A 2d array specifying the relative xy position of the widget within its parent. Values can range from 0-1. The actual position of a widget
     * relative to its parent is determined by a combination of anchor, pivot, local, and border.
     * @public
     * @default [0,0]
     * @type {Array<number>}
     * @example myWidget.set({anchor: [1,0]}); // Anchor the widget to the upper right corner of its parent.
     * @example myWidget.set({anchor: [0.5,1]}); // Anchor the widget to the center bottom of its parent.
     * */
    get anchor() {}

    /**
     * A 2d array specifying the relative xy position in the widget that matches the parent's anchor. Values can range from 0-1. The actual position of a widget
     * relative to its parent is determined by a combination of anchor, pivot, local, and border
     * @public
     * @default [0,0]
     * @type {Array<number>}
     * @example myWidget.set({anchor: [0.5,0.5], pivot: [0.5,0.5]}); // The center of the widget is exactly in the center of its parent.
     * @example myWidget.set({anchor: [1,0.25], pivot: [1,0]}); // The top left corner of the widget is 25% of the way down the parent's right side.
     * */
    get pivot() {}

    /**
     * A 2d array specifying the xy pixel offset of the widget relative to its parent. The actual position of a widget
     * relative to its parent is determined by a combination of anchor, pivot, local, and border.
     * @public
     * @default [0,0]
     * @type {Array<number>}
     * @example myWidget.set({anchor: [0,1], pivot: [0,1], local: [20,-20]}); // Inset the widget 20 pixels from the lower-left corner of its parent.
     * */
    get local() {}

    /**
     * A 4d array specifying pixel insets to be applied when calculating the edges of the widget relaitve to its parent. The values are [left,top,right,bottom] and
     * are always positive. The actual position of a widget relative to its parent is determined by a combination of anchor, pivot, local, and border.
     * @public
     * @default [0,0,0,0]
     * @type {Array<number>}
     * @example myWidget.set({autoSize: [1,1], border: [20,20,20,20]}); // The widget fills its parent with an inset of 20 pixels all around.
     * */
    get border() {}

    /**
     * The visibility of the widget. Hidden widgets can't be interacted with. The visibility of a parent affects all its children.
     * @public
     * @default true
     * @type {boolean}
     * @example myWidget.set({visible: false}); // Hides the widget and its children.
     * */
    get visible() {}

    /**
     * A 3d array specifying the rgb color of a widget. Not all widgets use this property, but enough do that its worth putting in the base class.
     * @public
     * @default [0,0,0]
     * @type {Array<number>}
     * @example myWidget.set({color: [0,1,0]}); // Sets the color to green.
     * */
    get color() {}

    /**
     * The widget's relative scale. A parent passes its scale on to its children. Usually you just want to leave the scale set to 1 and control the
     * layout of your UI using the widget's other parameters. However, it can be useful if you want to create an interface that dynamically adapts to different
     * window sizes.
     * @public
     * @default 1
     * @type {Array<number>}
     * @example myWidget.set({color: [0,1,0]}); // Sets the color to green.
     * */
     get scale() {}

    /**
     * Ignored unless the widget is placed inside a [horizontal widget]{@link HorizontalWidget}. This allows you to override the horizontal widget's
     * automatic scaling.
     * @public
     * @type {number}
     * */
    get width() {}

    /**
     * Ignored unless the widget is placed inside a [vertical widget]{@link VerticalWidget}. This allows you to override the vertical widget's
     * automatic scaling.
     * @public
     * @type {number}
     * */
     get height() {}

}

/**
 * Manages the underlying DOM canvas element where widgets are drawn. The UIManager automatically instantiates a CanvasWidget
 * as the root of the widget tree. Canvas widgets have an opacity property, that controls the transparency of the user interface.
 *
 * **Note:** Generally you don't need to create your own CanvasWidgets. The only exception is if different parts of the UI need to have different
 * opacities at the same time.
 * @augments Widget
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 */
class CanvasWidget {
    /**
     * A value from 0-1 that determines the transparency of this widget and all its children.
     * @public
     * @default 1
     * @type {number}
     * @example ui.root.set({opacity: 0.5}); // Makes the whole ui translucent
     * */
     get opacity() {}
}

/**
 * Abstract base class for widgets that control the layout of their children.
 * @public
 * @abstract
 * @hideconstructor
 * @augments Widget
 */
class LayoutWidget {
    /**
     * The size of the intrnal margins in pixels. Change using [set()]{@link Widget#set}.
     * @public
     * @default 0
     * @type {number}
     * */
    get margin() {}

    /**
     * Returns the widget in the indexed slot.
     * @param {number} index - The position of the widget.
     * @returns {Widget}
     * @public
     * */
    slot(index) {}

    /**
     * Add a widget to the layout widget. If you don't specify an index, the widget will be added to the end.
     * @param {Widget} widget - The widget to be added to the collection.
     * @param {number} [index] - The position where the widget should appear. If you don't specify an index, the widget will be added to the end.
     * @public
     * @example
     * myLayoutWidget.addSlot(firstWidget);
     * myLayoutWidget.addSlot(secondWidget);
     * myLayoutWidget.addSlot(thirdWidget);
     * myLayoutWidget.addSlot(replacementWidget, 1); // This replaces the second widget.
     * */
    addSlot(widget,index) {}

    /**
     * Removes a widget from the layout widget.
     * @param {number} [index] - The position of the widget.
     * @public
     * */
    removeSlot(index) {}

    /**
     * Removes a widget from the layout widget and destroys it.
     * @param {number} [index] - The position of the widget.
     * @public
     * */
    destroySlot(index) {}
}

/**
 * Holds a collection of widgets arranged horizontally. The child widgets are resized so their
 * vertical dimension matches the vertical dimension of this widget, and so they equally fill it
 * horizontally. Individual children can override the horizontal scaling by setting their
 * [width()]{@link Widget#width} property. You can also set internal margins to separate the
 * widgets.
 *
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments LayoutWidget
 */

class HorizontalWidget {}

/**
 * Holds a collection of widgets arranged vertically. The child widgets are resized so their
 * horizontal dimension matches the horizontal dimension of this widget, and so they equally fill it
 * vertically. Individual children can override the vertical scaling by setting their
 * [height()]{@link Widget#height} property. You can also set internal margins to separate the
 * widgets.
 *
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments LayoutWidget
 */

 class VerticalWidget {}

/**
 * Clears its rectangle when refreshed. Can be used as the background for floating text.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments Widget
 */
 class EmptyWidget {}

 /**
 * A box of a solid color.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments Widget
 */
  class BoxWidget {}

/**
 * Displays an image loaded from either a canvas or an external asset.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments Widget
 */
class ImageWidget {

    /**
     * The url of an external image asset. Supports all image types supported by HTMLImageElement. The widget will automatically refresh itself when the asset finishes loading.
     * @public
     * @type {string}
     * @example
     * import myImage from "./assets/image.jpg";
     * const myImageWidget = new ImageWidget({url: myImage});
     * */
    get url() {}

    /**
     * The canvas holding the image.
     * @public
     * @type {Canvas}
     * */
    get canvas() {}

}

/**
 * Display a QR code.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments ImageWidget
 */
 class QRWidget {

    /**
     * The text to be encoded in the QR code. The code is generated automatically when the text is [set()]{@link Widget#set}.
     * @public
     * @type {string}
     * @example
     * const myQRWidget = new QRWidget({text: "https:croquet.io"});
     * */
    get text() {}

}

/**
 * Displays an image that preserves its edges and corners as it's resized. More information [here]{@link https://en.wikipedia.org/wiki/9-slice_scaling}.
 * NineSliceWidgets can be used as child widgets in controls like {@link ButtonWidget} and {@link SliderWidget} to create a more polished look. In
 * a NineSliceWidget, only the center of source image scales on resizing. The top and bottom edges scale horizontally. And the left and right edges scale
 * vertically. The corners maintain their original dimensions. A scaling factor can be applied so that you're not limited to the pixel size of the
 * source image.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments ImageWidget
 */
 class NineSliceWidget {

    /**
     * The pixel inset that defines the slices. The inset is a 4d array: [left, top, right, bottom].
     * @public
     * @default [32,32,32,32];
     * @type {number[]}
     * @example
     * const mySliceWidget = new NineSliceWidget({url: myAsset, inset: [20.20,20,20]}); // The outer 20 pixels on each side of the source image won't scale.
     * */
    get inset() {}

    /**
     * A scaling factor that applies to the edges of the image.
     * @public
     * @type {number}
     * @example
     * mySliceWidget.set({inset: [20.0,0,0], insetScale:2}); // The outer 20 pixels on the left side of the source won't scale. But those pixels will be double-sized.
     * */
    get insetScale() {}

}

/**
 * Displays a piece of static text. Should be placed over a background to refresh properly. When a TextWidget changes, it automatically refreshes
 * its parent. If you want floating text, put it in an [EmptyWidget]{@Link EmptyWidget}.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments Widget
 */
 class TextWidget {

    /**
     * The string to display.
     * @public
     * @type {string}
     * @example
     * myTextWidget.set({text: "Disply this string!"});
     * */
    get text() {}

    /**
     * The size of the text.
     * @public
     * @default 24
     * @type {number}
     * @example
     * myTextWidget.set({point: 12}); // Make the text smaller than the default
     * */
    get point() {}

    /**
     * The styling of the text. Options include "normal", "bold", and "italic".
     * @public
     * @default "normal"
     * @type {string}
     * @example
     * myTextWidget.set({style: "italic"});
     * */
    get style() {}

    /**
     * The horizontal alignment of the text. Options are "right", "center", and "left".
     * @public
     * @default "center"
     * @type {string}
     * @example
     * myTextWidget.set({alignX: "right"});
     * */
    get alignX() {}

    /**
     * The vertical alignment of the text. Options are "top", "middle", and "bottom".
     * @public
     * @default "middle"
     * @type {string}
     * @example
     * myTextWidget.set({againY: "bottom"});
     * */
    get alignY() {}

    /**
     * The name of an installed font ("arial") or a generic font type ("sans-serif")
     * @public
     * @default "sans-serif"
     * @type {string}
     * @example
     * myTextWidget.set({font: "serif"});
     * */
    get font() {}

    /**
     * The url of an external font asset (.otf). The widget will automatically refresh itself when the font finishes loading.
     * @public
     * @type {string}
     * @example
     * import myFont from "./assets/weirdFont.otf";
     * const myTextWidget = new TextWidget({fontURL: myFont, text: "This will display in the weird font!"});
     * */
    get fontURL() {}

    /**
     * The flag that controls word-wrap. If it's set to true, the text wraps to multiple lines, using the y dimension of the
     * widget to control line length. Use lineSpacing to set the spacing of the lines and border to set the outer
     * margins.
     * @public
     * @default true
     * @type {boolean}
     * @example
     * myTextWidget.set{wrap: true, lineSpacing: 24, border: [10,10,10,10]});
     * */
    get wrap() {}

    /**
     * The spacing between wrapped lines. The default is 0, which means the text will be single spaced. If you want more
     * space between lines, the lineSpacing value is the point size of the empty space inserted.
     * @public
     * @default 0
     * @type {number}
     * @example
     * myTextWidget.set{wrap: true, lineSpacing: 12, point: 12}); // Double-spaced
     * */
    get lineSpacing() {}

}

/**
 * Abstract base class for all widgets that respond to pointer events.
 * @public
 * @abstract
 * @hideconstructor
 * @augments Widget
 */
 class ControlWidget {

    /**
     * Setting disabled to true grays the widget out and prevents it from accepting pointer events.
     * @public
     * @default false
     * @type {boolean}
     * @example
     * myControl.set({disabled: true}); .
     * */
    get disabled() {}

    /**
     * The transparent box widget that is used to gray out the control. Generally you don't want to change this, unless the styling of your
     * interface requires a different way of indicating that the control is disabled.
     * @public
     * @type {BoxWidget}
     * @example
     * myControl.set({dim: new BoxWidget({color: [0.8,0.2,0.2], opacity: 0.4}); // Make disabled widgets turn pink.
     * */
    get dim() {}

}

/**
 * A pressable button with a label.
 * @public
* @param {object} [options] - An options object that sets the widget's properties.
 * @augments ControlWidget
 */
 class ButtonWidget {

    /**
     * The function that executes when the button is pressed.
     * @public
     * @type {function}
     @example
     * myButton.set({onClick: () => { console.log("click!")} });
     **/
    get onClick() {}

    /**
     * The child widget that's displayed when the button is in its normal, unpressed state. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get normal() {}

    /**
     * The child widget that's displayed when the button is hovered by a mouse. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get hilite() {}

    /**
     * The child widget that's displayed when the button is in its pressed state. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get pressed() {}

    /**
     * The child widget that's displayed to show what this button does. By default, its a TextWidget. You can change the properties of the
     * default text widget, or replace it with and ImageWidget for a picture label.
     * @public
     * @type {Widget}
     * @example
     * myButton.label.set({text: "Press to Start"});
     **/
    get label() {}

}

/**
 * A button that can be toggled between two states.
 * @public
 * @param {object} [options] - An options object that sets the widget's properties.
 * @augments ControlWidget
 */
 class ToggleWidget {

    /**
     * The function that executes when the widget toggles to true
     *
     * **Note** - This may be the triggered by a user click, or setting the state directly.
     * @public
     * @type {function}
     @example
     * myToggle.set({onToggleOn: () => { console.log("toggle on!")} });
     **/
    get onToggleOn() {}

    /**
     * The function that executes when the widget toggles to false.
     *
     * **Note** - This may be the triggered by a user click, setting the state directly, or having another toggle turn on in a [toggle set]{@link ToggleSet}.
     * @public
     * @type {function}
     @example
     * myToggle.set({onToggleOff: () => { console.log("toggle off!")} });
     **/
     get onToggleOff() {}

    /**
     * The state of the toggle.
     * @public
     * @default false;
     * @example
     * const myToggle = new MyToggle({state: true} }); // Create the toggle in the 'on' position.
     * @type {boolean}
     **/
    get state() {}

    /**
     * The [toggleSet]{@link ToggleSet} the widget belongs to. If a ToggleWidget is in a toggle set, turning one toggle on will turn the others off.
     * @public
     * @example
     * const myToggleSet = new ToggleSet();
     * const myToggle0 = new ToggleWidget({toggleSet: myToggleset} }); // Only one of these toggles can be on a time.
     * const myToggle1 = new ToggleWidget({toggleSet: myToggleset} });
     * @type {ToggleSet}
     **/
    get toggleSet() {}

    /**
     * The child widget that's displayed when the toggle is on, and is in its normal, unpressed state. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get normalOn() {}

    /**
     * The child widget that's displayed when the toggle is off, and is in its normal, unpressed state. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get normalOff() {}

    /**
     * The child widget that's displayed when the button is on, and is hovered by a mouse. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get hiliteOn() {}

    /**
     * The child widget that's displayed when the button is off, and is hovered by a mouse. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get hiliteOff() {}

    /**
     * The child widget that's displayed when the button is on, and is in its pressed state. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get pressedOn() {}

    /**
     * The child widget that's displayed when the button is off, and is in its pressed state. You can replace this with a different BoxWidget, ImageWidget,
     * or NineSliceWidget to create prettier buttons.
     * @public
     * @type {Widget}
     **/
    get pressedOff() {}

    /**
     * The child widget that's displayed when this toggle is on. By default, its a TextWidget. You can change the properties of the
     * default text widget, or replace it with and ImageWidget for a picture label.
     * @public
     * @type {Widget}
     * @example
     * myToggle.labelOn.set({text: "On"});
     **/
    get labelOn() {}

    /**
     * The label widget that's displayed when this toggle is off. By default, its a TextWidget. You can change the properties of the
     * default text widget, or replace it with and ImageWidget for a picture label.
     * @public
     * @type {Widget}
     * @example
     * myToggle.labelOff.set({text: "Off"});
     **/
    get labelOff() {}
}

/**
 * A set of [ToggleWidgets]{@link ToggleWidget}. Only one member of a ToggleSet can be on at a time. Turning on one, turns off all the others. You
 * can add the toggles to the toggle set's constructor, or set the toggle's toggleSet property.
 * @param {...ToggleWidget} [toggles] - A list of toggle widgets to add to the set.
 * @public
 * @example
 * const myToggle0 = new ToggleWidget();
 * const myToggle1 = new ToggleWidget();
 *
 * const myToggleSet = new ToggleSet(myToggle0, myToggle1);
 *
 * const myToggle2 = new ToggleWidget({toggleSet: myToggleset} }); // All three toggles are in the set.
 */
 class ToggleSet {

 }

 /**
 * A horizontal or vertical slider bar. (The orientation is determined by the xy values in the size property.) The value
 * of the slider is a percentage that ranges from 0 to 1.
 * @public
 * @param {object} [options] - An options object that sets the widget's properties.
 * @augments ControlWidget
 */
  class SliderWidget {

    /**
     * The number of discrete steps that the slider has between 0 and 1 (inclusive). If its set to 0, the slider will be continuous.
     * @public
     * @default 0;
     * @type {number}
     * @example
     * const mySlider = new SliderWidget({step: 6}); // The slider can have the values 0, 0.2, 0.4, 0.6, 0.8, or 1.
     * */
    get step() {}

    /**
     * The position of the slider. A percentage that ranges from 0 to 1.
     * @public
     * @default 0;
     * @type {number}
     * @example
     * const mySlider = new SliderWidget({percent: 0.5}); // The slider starts with its knob at the midpoint.
     * */
    get percent() {}

    /**
     * The function that executes whenever the position of the slider changes. The function takes the slider's
     * current percent as it's argument.
     *
     * **Note** - This will be called every frame when the slider is being dragged. To limit the number of times that onChanged is called, set
     * the [throttle]{@link SliderWidget#throttle} property.
     * @public
     * @type {function}
     @example
     * mySlider.set({onChanged: percent => { console.log(percent} });
     **/
     get onChanged() {}

    /**
     * How frequently the [onChanged]{@link SliderWidget#onChanged} function will be called when the slider is being dragged. The value is in milliseconds,
     * and represents the minimum delay between successive onChanged events. If its set to 0, the slider will update as
     * quickly as possible.
     *
     * @public
     * @default 0;
     * @type {number}
     * @example
     * const mySlider = new SliderWidget({throttle: 50}); // The slider will only call its onChanged function 20 times a second.
     * */
    get throttle() {}

    /**
     * The child widget that's displayed as the background bar. You can replace this with a different {@link BoxWidget}, {@link ImageWidget},
     * or {@link NineSliceWidget} to create a prettier slider.
     * @public
     * @type {Widget}
     **/
    get bar() {}

    /**
     * The child widget that's displayed as the moveable knob. You can replace this with a different {@link BoxWidget}, {@link ImageWidget},
     * or {@link NineSliceWidget} to create a prettier slider.
     * @public
     * @type {Widget}
     **/
    get knob() {}

}

 /**
 * A virtual joystick. The position of of the stick is an xy vector with both values ranging from -1 to 1.
 * The magnitude of the vector will never exceed 1. When the stick it released, it will snap back to the
 * center [0,0] position.
 * @public
 * @param {object} [options] - An options object that sets the widget's properties.
 * @augments ControlWidget
 */
  class JoystickWidget {

    /**
     * The position of the stick. An xy vector with both values ranging from -1 to 1.
     * The magnitude of the vector will never exceed 1.
     * @public
     * @type {number[]}
     * */
    get xy() {}

    /**
     * The function that executes whenever the position of the joystick changes. The function takes the stick's
     * xy position as it's argument.
     *
     * **Note** - This will be called every frame when the joystick is being dragged. To limit the number of times that onChanged is called, set
     * the [throttle]{@link JoystickWidget#throttle} property.
     * @public
     * @type {function}
     @example
     * myJoystickWidget.set({onChanged: xy => { console.log(xy} });
     **/
     get onChanged() {}

    /**
     * How frequently the [onChanged]{@link JoystickWidget#onChanged} function will be called when the knob is being dragged. The value is in milliseconds,
     * and represents the minimum delay between successive onChanged events. If its set to 0, the joystick will update as
     * quickly as possible.
     * @public
     * @default 0;
     * @type {number}
     * @example
     * const myJoyStickWidget = new JoystickWidget({throttle: 50}); // The joystick will only call its onChanged function 20 times a second.
     **/
    get throttle() {}

    /**
     * The size of the dead zone in the middle of the joystick. Small stick deflections near [0,0] will be treated as [0,0] unless they exceed
     * the dead radius.
     * @public
     * @default 0.1;
     * @type {number}
     **/
    get deadRadius() {}

    /**
     * The child widget that's displayed as the background graphic. You can replace this with a different {@link BoxWidget}, {@link ImageWidget},
     * or {@link NineSliceWidget} to create a prettier joystick.
     * @public
     * @type {Widget}
     **/
    get background() {}

    /**
     * The child widget that's displayed as the moveable knob. You can replace this with a different {@link BoxWidget}, {@link ImageWidget},
     * or {@link NineSliceWidget} to create a prettier joystick.
     * @public
     * @type {Widget}
     **/
    get knob() {}

}

