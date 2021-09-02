/**
 * The render manager is a view-side service. It provides a basic WebGL renderer that you can use for testing and to make
 * simple apps. If you want to use the render manager, add it as a service to your root view.
 *
 * ***Note:*** The render manager requires the [inputManager]{@link InputManager}.
 * ```
 * class MyViewRoot extends ViewRoot {
 *      createServices() {
 *          this.addService(InputManager);
 *          this.addService(RenderManager);
 * }
 *
 * @public
 * @augments ViewService
 * @property {Lights} lights
 * @property {Camera} camera
 */
 class RenderManager {
}

/**
 * Provides a pawn with an interface to the [WebGL renderer]{@link RenderManager}. Visible pawns can set up draw calls and attach
 * materials and geometry to them.
 *
 * ***Note:*** In order to work properly the `PM_Visible` mixin should be combined with {@link PM_Spatial} or
 * one of its descendants. Listens to {@link event:viewGlobalChanged} to update the transform in the
 * draw call.
 *
 * @public
 * @listens viewGlobalChanged
 * @mixin
 * @example
 * class MyPawn extends mix(Pawn).with(PM_Spatial, PM_Visible) {}
 */
 class PM_Visible {

    /**
     * Adds a draw call to the pawn. The draw call will have its transform automatically updated when the
     * pawn moves.
     * @public
     * @param {DrawCall} [data] - A webGL renderer draw call.
     *
     */
    setDrawCall() {}

 }

/**
 * Attaches the camera for the [WebGL renderer]{@link RenderManager} to this pawn. The camera will
 * track the pawn's position. Only the pawn associated with the local player will control the camera.
 *
 * ***Note:*** In order to work properly the `PM_Camera` mixin should used in conjunction with
 * {@link PM_Player} as well as {@link PM_Spatial} or one of its descendants.
 *
 * @public
 * @listens viewGlobalChanged
 * @mixin
 * @example
 * class MyPawn extends mix(Pawn).with(PM_Spatial, PM_Visible, PM_Camera, PM_Player) {}
 */
  class PM_Camera {
 }

/**
 * Holds a triangle mesh and a material for the [WebGL renderer]{@link RenderManager}.
 * @public
 * @property {Triangles} triangles
 * @property {Material} [material] - Defaults to untextured solid white.
 */
class DrawCall {
    constructor(mesh, material = new Material()) {}
}

/**
 * A triangle mesh for the [WebGL renderer]{@link RenderManager}. The mesh holds the geometry in local memory so you can manipulate
 * it, and only transfers it to the graphics card when explicitly told to.
 * @public
 */
 class Triangles {

    /**
     * Triangle meshes create buffers on the graphics card. When you're done with a mesh, you must explicitly destroy it to free
     * these buffers. (It's not done automatically because pawns can share meshes.)
     * @public
     */
    destroy() {}

    /**
    * Adds a set of triangles to the local geometry buffers to create a convex polygonal face. You need to specify the coordinates of the vertices
    * and their color and texture coordinates. Vertex 0 is shared by all triangles in the face.
    * @public
    * @param {Array.<number[]>} vertices - [xyz] coordinates ordered CCW around face.
    * @param {Array.<number[]>} colors - [rgba] vertex colors
    * @param {Array.<number[]>} coordinates - [uv] vertex texture coordinates
    * @param {Array.<number[]>} [normals] - [xyz] vertex normals (Automatically generated if not specified)
    * @example
    * const myMesh = new Triangles();
    * myMesh.addFace( // Add two triangles to makes a square face with black, red, green blue corners.
    *       [[0,0,0], [1,0,0], [1,1,0], [0,1,0]],
    *       [[0,0,0,1], [0,1,0,1], [0,0,1,1], [0,0,1,1]],
    *       [[0,0], [1,0], [1,1], [0,1]]
    * )
    */
    addFace(vertices, colors, coordinates, normals) {}

    /**
     * Copies another triangle mesh into this one. Only copies the local buffers, so you'll want to do a [load]{@link Triangles#load} afterwards.
     * @public
     * @param {Triangles} triangles
     */
    copy(triangles) {}

    /**
     * Merges another triangle mesh into this one. Only merges the local buffers, so you'll want to do a [load]{@link Triangles#load} afterwards.
     * @param {Triangles} triangles
     * @public
     */
    merge(triangles) {}

    /**
    * Transforms the vertex coordinates by 4x4 matrix. Also transforms the normals. Only affects the local coordinates, so you'll want to do a [load]{@link Triangles#load} afterwards.
    * @param {number[]} matrix
    * @public
    */
    transform(matrix) {}

     /**
      * Loads the local geometry buffers onto the graphics card. After you've created a triangle mesh, you must
      * load it before it will be drawn.
      * @public
      */
    load() {}

    /**
    * Clears the local geometry buffers. If you don't need to reuse the geometry, you can do this after you [load]{@link Triangles#load}
    * to save memory.
    * @public
    */
    clear() {}

}

/**
 * A material for the [WebGL renderer]{@link RenderManager}. Holds a texture, and also determines which drawing pass to use. (For efficiency, the WebGL renderer renders
 * meshes that have the same material at the same time. It also does separate passes for opaque and translucent meshes.)
 *
 * ***Note:*** By default the material is created with a solid white texture. If you want a different image [load]{@link Texture#loadFromURL} it from an external asset.
 * @public
 * @property {string} pass="opaque" - `"opaque"`or `"translucent"`
 * @property {Texture} texture
 */
 class Material {

 }

 /**
 * A texture for the [WebGL renderer]{@link RenderManager}. The texture holds an rgb asset loaded from a URL.
 * @public
 * @noconstructor
 */
  class Texture {

    /**
     * Textures create buffers on the graphics card. When you're done with a texture, you must explicitly destroy it to free
     * these buffers. (It's not done automatically because pawns can share textures.)
     * @public
     *
     */
    destroy() {}

    /**
     * Load an image from an external asset. The load occurs dynamically and the texture will refresh  when it's completed.
     * @public
     * @param {string} url
     * @example
     * import myImage from "./assets/image.jpg";
     * const myTexture.loadFromURL(myImage});
     */
    loadFromURL (url) {}
  }

/**
 * Holds the lighting information the [WebGL renderer]{@link RenderManager}. It supports ambient light for the entire world, plus one directional light.
 * @public
 * @property {number[]} ambientColor=[0.7,0.7,0.7]]
 * @property {number[]} directionalColor=[0.3,0.3,0.3]]
 * @property {number[]} directionalAim=[0,-1,0]] - Should be normalized.
 * @noconstructor
 */
class Lights {}

/**
 * The camera for the the [WebGL renderer]{@link RenderManager}.
 * @public
 * @noconstructor
 */
 class Camera {
    setProjection(fov, near, far) {}
 }
