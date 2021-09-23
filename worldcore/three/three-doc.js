/**
 * The three render manager is a view-side service with the public name "ThreeRenderManager".
 * It creates a Three.js renderer, plus and default scene and camera.  If you want to use the
 * three render manager, add it as a service to your root view. A pawn with the {@link PM_ThreeVisible} will automatically be inserted into the
 * screen when the pawn is created. If a pawn is given the {@link PM_ThreeCamera}, it will drive the camera using its location.
 *
 * You can also add render objects to the scene directly (for example, lights), or change the settings of the renderer or camera.
 *
 * ***Note:*** If you want the three render manager to automically resize the viewport, you must include the [inputManager]{@link InputManager} as well.
 * ```
 * class MyViewRoot extends ViewRoot {
 *   static viewServices() { return [InputManager, ThreeRenderManager];}
 * }
 * @public
 * @augments ViewService
 * @property {Object} renderer - The three.js renderer.
 * @property {Object} scene - The deault three.js scene.
 * @property {Object} camera - The default three.js camera.
 */
 class ThreeRenderManager {
}

/**
 * Provides a pawn with an interface to the [Three.js renderer]{@link ThreeRenderManager}. Visible pawns should set their three.js render objects
 * when they are created. The three.js render object will then automatically track the pawns position within the scene.
 *
 * ***Note:*** In order to work properly the `PM_Visible` mixin should be combined with {@link PM_Spatial} or
 * one of its descendants. Listens to {@link event:viewGlobalChanged} to update the transform in the
 * draw call.
 *
 * @public
 * @listens viewGlobalChanged
 * @worldcoremixin
 * @example

 * class MyPawn extends mix(Pawn).with(PM_Spatial, PM_ThreeVisible) {}
 */
 class PM_ThreeVisible {

    /**
     * Adds a three.js render object to the pawn. The render object will have its transform automatically updated when the
     * pawn moves.
     * @public
     * @param {Object} renderObject - A three.js render object.
     * @example
     * this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
     * this.material = new THREE.MeshStandardMaterial();
     * const cube = new THREE.Mesh( this.geometry, this.material );
     * this.setRenderObject(cube);
      */
    setRenderObject() {}

 }

/**
 * Attaches the camera for the [three.js renderer]{@link ThreeRenderManager} to this pawn. The camera will
 * track the pawn's position. Only the pawn associated with the local player will control the camera.
 *
 * ***Note:*** In order to work properly the `PM_ThreeCamera` mixin should used in conjunction with
 * {@link PM_Player} as well as {@link PM_Spatial} or one of its descendants.
 *
 * @public
 * @listens viewGlobalChanged
 * @listens lookGlobalChanged
 * @worldcoremixin
 * @example
 * class MyPawn extends mix(Pawn).with(PM_Spatial, PM_Visible, PM_ThreeCamera, PM_Player) {}
 */
  class PM_ThreeCamera {
 }

