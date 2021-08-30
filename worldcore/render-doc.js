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
 * @hideconstructor
 */
 class RenderManager {

    /**
     * The number of players in the session.
     * @public
     * @type {number}
     */
    get count() {}

}

/**
 * Provides an interface to the [WebGL renderer]{@link RenderManager}. Visible pawns can set up draw calls and attach
 * materials and geometry to them.
 *
 * ***Note:*** In order to work properly the `PM_Visible` mixin should be combined with {@link PM_Spatial} or
 * one of its descendents. Listens to {@link event:viewGlobalChanged} to update the tranform in the
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
     * Adds a webGL draw call to the pawn. The draw call will have its transform automatically updated when the
     * pawn moves.
     * @public
     * @param {DrawCall} [data] - A webGL renderer draw call.
     *
     */
    setDrawCall() {}

 }

/**
 * Holds a triangle mesh and a material for the [WebGL renderer]{@link RenderManager}.
 * @public
 * @property {Triangles} triangles
 * @property {Material} material
 */
class DrawCall {
    constructor(mesh, material = new Material()) {}

}

/**
 * A triangle mesh for the [WebGL renderer]{@link RenderManager}. The mesh holds the geometry in local memory so you can manipulate
 * it, and only transfers it to the graphics card when explicitly told to.
 * @public
 * @hideconstructor
 */
 class Triangles {

    /**
    * Adds a set of triangles to the local geometry buffers to create a convex polygonal face. You need to specify the cooridinates of the vertices
    * and their color and texture coordinates. Vertex 0 is shared by all triangles in the face.
    * @public
    * @param {Array.<number[]>} vertices - [xyz] coordinates ordered CCW around face.
    * @param {Array.<number[]>} colors - [rgba] vertex colors
    * @param {Array.<number[]>} coordinates - [uv] vertex texture coordinates
    * @param {Array.<number[]>} [normals] - [xyz] vertex normals (Automatically generated if not specified)
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
