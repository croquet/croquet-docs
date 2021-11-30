/**
 * Converts degrees to radians.
 * @public
 * @param number angle
 * @returns {number}
 */
 function toRad(a) {}

 /**
  * Converts radians to degrees.
  * @public
  * @param number angle
  * @returns {number}
  */
  function toDeg(a) {}

//--------------------------------------------------------------------------------
//-- 2 Vectors -------------------------------------------------------------------
//--------------------------------------------------------------------------------

 /**
  * Null 3-vector [0,0]
  * @public
  * @returns {number[]}
  */
 function v2_zero() {}

  /**
  * Random point on a unit circle.
  * @public
  * @returns {number[]}
  */
  function v2_random() {}

  /**
  * Magnitude of vector.
  * @public
  * @param {number[]} vector
  * @returns {number}
  */
  function v2_magnitude(v) {}

  /**
  * Squared magnitude of vector.
  * @public
  * @param {number[]} vector
  * @returns {number}
  */
  function v2_sqrMag(v) {}

 /**
  * Normalized vector. (Error on magnitude 0)
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v2_normalize(v) {}

 /**
  * Absolute value of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v2_abs(v) {}

 /**
  * Ceiling of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v2_ceil(v) {}

 /**
  * Floor of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v2_floor(v) {}

 /**
  * Reciprocal of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v2_inverse(v) {}

 /**
  * Multiply all elements by a constant scale factor.
  * @public
  * @param {number[]} vector
  * @param number scale
  * @returns {number[]}
  */
 export function v2_scale(v,s) {
     return [v[0] * s, v[1] * s];
 }

 /**
  * Multiply individual elements of two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v2_multiply(a,b) {}

 /**
  * Add two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v2_add(a,b) {}

 /**
  * Subtract two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v2_sub(a,b) {}

 /**
  * Dot product of two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
 export function v2_dot(a,b) {}

 /**
  * Minimum of two vectors, compared element by element.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
 export function v2_min(a,b) {}

 /**
  * Maximum of two vectors, compared element by element.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v2_max(a,b) {}

 /**
  * Angle in radian between two vectors.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
 export function v2_angle(a,b) {}

 /**
  * Linear interpolation between two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @param {number} interpolation value between 0 and 1
  * @returns {number[]}
  */
 export function v2_lerp(a,b,t) {
     return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
 }

 /**
  * Checks for vector equality within an epsilon.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @param {number} [epsilon=0]
  * @returns {boolean}
  */
 export function v2_equals(a,b,e = 0) {}

/**
 * Checks if vector is [0,0]
 * @public
 * @param {number[]} vector
 * @returns {boolean}
 */
export function v2_isZero(v) {}

/**
* Manhattan distance of vector
* @public
* @param {number[]} vector
* @returns {number}
*/
export function v2_manhattan(a, b) {}

 /**
  * Multiplies vector by a 2x2 matrix
  * @public
  * @param {number[]} vector
  * @param {number[]} matrix
  * @returns {number[]}
  */
 export function v2_transform(v, m) {}

 /**
  * Rotate clockwise. Angle in radians.
  * @public
  * @param {number[]} vector
  * @param {number} angle
  * @returns {number[]}
  */
  export function v2_rotate(v,a) {}

//--------------------------------------------------------------------------------
//-- 3 Vectors -------------------------------------------------------------------
//--------------------------------------------------------------------------------

 /**
  * Null 2-vector [0,0]
  * @public
  * @returns {number[]}
  */
  function v3_zero() {}

  /**
  * Random point on a unit sphere.
  * @public
  * @returns {number[]}
  */
  function v3_random() {}

  /**
  * Magnitude of vector.
  * @public
  * @param {number[]} vector
  * @returns {number}
  */
  function v3_magnitude(v) {}

  /**
  * Squared magnitude of vector.
  * @public
  * @param {number[]} vector
  * @returns {number}
  */
  function v3_sqrMag(v) {}

 /**
  * Normalized vector. (Error on magnitude 0)
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v3_normalize(v) {}

 /**
  * Absolute value of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v3_abs(v) {}

 /**
  * Ceiling of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v3_ceil(v) {}

 /**
  * Floor of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v3_floor(v) {}

 /**
  * Reciprocal of all elements.
  * @public
  * @param {number[]} vector
  * @returns {number[]}
  */
 export function v3_inverse(v) {}

 /**
  * Multiply all elements by a constant scale factor.
  * @public
  * @param {number[]} vector
  * @param number scale
  * @returns {number[]}
  */
 export function v3_scale(v,s) {
     return [v[0] * s, v[1] * s];
 }

 /**
  * Multiply individual elements of two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v3_multiply(a,b) {}

 /**
  * Add two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v3_add(a,b) {}

 /**
  * Subtract two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v3_sub(a,b) {}

 /**
  * Dot product of two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
 export function v3_dot(a,b) {}

  /**
  * Cross product of two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
   export function v3_cross(a,b) {}

 /**
  * Minimum of two vectors, compared element by element.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
 export function v3_min(a,b) {}

 /**
  * Maximum of two vectors, compared element by element.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number[]}
  */
 export function v3_max(a,b) {}

 /**
  * Angle in radian between two vectors.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @returns {number}
  */
 export function v3_angle(a,b) {}

 /**
  * Linear interpolation between two vectors
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @param {number} t value between 0 and 1
  * @returns {number[]}
  */
 export function v3_lerp(a,b,t) {
     return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
 }

 /**
  * Checks for vector equality within an epsilon.
  * @public
  * @param {number[]} vectorA
  * @param {number[]} vectorB
  * @param {number} [epsilon=0]
  * @returns {boolean}
  */
 export function v3_equals(a,b,e = 0) {}

  /**
  * Checks if vector is [0,0,0]
  * @public
  * @param {number[]} vector
  * @returns {boolean}
  */
 export function v3_isZero(v) {}

  /**
  * Manhattan distance of vector
  * @public
  * @param {number[]} vector
  * @returns {number}
  */
 export function v3_manhattan(a, b) {}

 /**
  * Multiplies vector by a 4x4 matrix (Treats the vector as [x,y,z,1] in homogenous coordinates)
  * @public
  * @param {number[]} vector
  * @param {number[]} matrix
  * @returns {number[]}
  */
export function v3_transform(v, m) {}

/**
  * Rotate around x axis. Angle in radians. Clockwise looking along axis
  * @public
  * @param {number[]} vector
  * @param {number} angle
  * @returns {number[]}
  */
 export function v3_rotateX(v,a) {}

/**
  * Rotate around y axis. Angle in radians. Clockwise looking along axis
  * @public
  * @param {number[]} vector
  * @param {number} angle
  * @returns {number[]}
  */
export function v3_rotateY(v,a) {}

/**
  * Rotate around z axis. Angle in radians. Clockwise looking along axis
  * @public
  * @param {number[]} vector
  * @param {number} angle
  * @returns {number[]}
  */
export function v3_rotateZ(v,a) {}

/**
  * Rotate by a quaternion
  * @public
  * @param {number[]} vector
  * @param {number[]} quaternion
  * @returns {number[]}
  */
export function v3_rotate(v, q) {}

//--------------------------------------------------------------------------------
//-- Quaternions -----------------------------------------------------------------
//--------------------------------------------------------------------------------

 /**
  * Identity quaternion
  * @public
  * @returns {number[]}
  */
 export function q_identity() {}

export function q_magnitude(q) {
    return Math.sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3]);
}

 /**
  * Normalize quaternion. (If you do a long series of quaternion operations, periodically renormalize to prevent drift.)
  * @public
  * @param {number[]} quaternion
  * @returns {number[]} quaternion
  */
export function q_normalize(q) {}

/**
  * Reverse the rotation.
  * @public
  * @param {number[]} quaternion
  * @returns {number[]} quaternion
  */
export function q_invert(q) {}

/**
  * Creates a quaternion for a rotation around an axis. The angle is clockwise in radians looking along the axis. The axis should be normalized.
  * @public
  * @param {number[]} axis
  * @param {number} angle
  * @returns {number[]} quaternion
  */
export function q_axisAngle(axis, angle) {}

// Given a forward vector and an up vector, generates the quaternion that will rotate
// the forward vector to look at the target.

/**
  * Given a forward vector, an up vector,  and a target vector, generates a quaternion that will rotate the forward vector to look at the target vector.
  * All vectors should be normalized.
  * @public
  * @param {number[]} forward
  * @param {number[]} up
  * @param {number[]} target
  * @returns {number[]} quaternion
  */
export function q_lookAt(f, u, t) {}

/**
  * Creates a quaternion from the given Euler angles. All angles are in radians.
  * @public
  * @param {number} x
  * @param {number} y
  * @param {number} z
  * @returns {number[]} quaternion
  */
export function q_euler(x, y ,z) {}

/**
  * Extracts the Euler angle around the x axis from a quaternion.
  * @public
  * @param {number[]} quaternion
  * @returns {number} angle
  */
export function q_pitch(q) {}

/**
  * Extracts the Euler angle around the y axis from a quaternion.
  * @public
  * @param {number[]} quaternion
  * @returns {number} angle
  */
export function q_yaw(q) {}

/**
  * Extracts the Euler angle around the z axis from a quaternion.
  * @public
  * @param {number[]} quaternion
  * @returns {number} angle
  */
export function q_roll(q) {}

/**
  * Combines two rotations. QuaternionA is applied before quaternionB.
  * @public
  * @param {number[]} quaternionA
  * @param {number[]} quaternionB
  * @returns {number[]} quaternion
  */
export function q_multiply(a, b) {}

/**
  * Interpolates between two rotations.
  * @public
  * @param {number[]} quaternionA
  * @param {number[]} quaternionB
  * @param {number} t value between 0 and 1
  * @returns {number[]} quaternion
  */
export function q_slerp(a,b,t) {}

 /**
  * Checks for quaternion equality within an epsilon.
  * @public
  * @param {number[]} quaternionA
  * @param {number[]} quaternionB
  * @param {number} [epsilon=0.0001]
  * @returns {boolean}
  */
export function q_equals(a,b,e = 0.0001) {}

  /**
  * Checks if quaternion is [0,0,0,1]
  * @public
  * @param {number[]} quaternion
  * @returns {boolean}
  */
export function q_isZero(q) {}

//--------------------------------------------------------------------------------
//-- 2x2 Matrices ----------------------------------------------------------------
//--------------------------------------------------------------------------------

 /**
  * Returns a 2x2 zero Matrix
  * @public
  * @returns {number[]} 2x2 Matrix
  */
export function m2_zero() {}

 /**
  * Returns a 2x2 identity matrix
  * @public
  * @returns {number[]} 2x2 Matrix
  */
export function m2_identity() {}

 /**
  * Returns a 2x2 matrix that will rotate a 2-vector clockwise. Angle is in radians.
  * @public
  * @param {number} angle
  * @returns {number[]} 2x2 Matrix
  */
export function m2_rotation(angle) {}

//--------------------------------------------------------------------------------
//-- 4x4 Matrices ----------------------------------------------------------------
//--------------------------------------------------------------------------------

 /**
  * Returns a 4x4 zero matrix
  * @public
  * @returns {number[]} 2x2 Matrix
  */
  export function m4_zero() {}

  /**
   * Returns a 4x4 identity matrix
   * @public
   * @returns {number[]} 4x4 Matrix
   */
 export function m4_identity() {}

/**
 * Creates a 4x4 transform matrix from a 3-vector translation.
 * @public
 * @param {number[]} translation
 * @returns {number[]} 4x4 Matrix
 */
 export function m4_translation(v) {}

/**
 * Extracts the translation from a 4x4 transform matrix.
 * @public
 * @param {number[]} matrix
 * @returns {number[]} 3-vector
 */
 export function m4_getTranslation(m) {}

/**
 * Creates a 4x4 transform matrix from a 3-vector scale, or a scale constant.
 * @public
 * @param {number[]|number} scale
 * @returns {number[]} 4x4 Matrix
 */
export function m4_scale(s) {}

/**
 * Creates a 4x4 rotation matrix around the given axis. Angle is in radians, and rotation is clockwise looking along axis.
 * @public
 * @param {number[]} axis
 * @param {number} angle
 * @returns {number[]} 4x4 Matrix
 */
export function m4_rotation(axis, angle) {}

/**
 * Creates a 4x4 rotation matrix around the x axis. Angle is in radians, and rotation is clockwise looking along axis.
 * @public
 * @param {number} angle
 * @returns {number[]} 4x4 Matrix
 */
export function m4_rotationX(a) {}

/**
 * Creates a 4x4 rotation matrix around the y axis. Angle is in radians, and rotation is clockwise looking along axis.
 * @public
 * @param {number} angle
 * @returns {number[]} 4x4 Matrix
 */
 export function m4_rotationY(a) {}

 /**
 * Creates a 4x4 rotation matrix around the z axis. Angle is in radians, and rotation is clockwise looking along axis.
 * @public
 * @param {number} angle
 * @returns {number[]} 4x4 Matrix
 */
export function m4_rotationZ(a) {}

/**
 * Creates a 4x4 rotation matrix from a quaternion.
 * @public
 * @param {number[]} rotation
 * @returns {number[]} 4x4 Matrix
 */
export function m4_rotationQ(q) {}

/**
 * Extracts the rotation quaternion from a 4x4 transform matrix.
 * @public
 * @param {number[]} matrix
 * @returns {number[]} Quaternion
 */
export function m4_getRotation(m) {}

/**
 * Creates a 4x4 transform matrix from a scale, a rotation, and a translation. The scale can be either a 3-vector or a scalar. The rotation is a quaternion.
 * @public
 * @param {number[]|number} scale
 * @param {number[]} rotation
 * @param {number[]} translation
 * @returns {number[]} 4x4 Matrix
 */
export function m4_scaleRotationTranslation(s, q, v) {}

/**
 * Creates a 4x4 perspective matrix from a field of view, an aspect ratio, and the near and far clip planes. The FOV is in radians.
 * @public
 * @param {number} fov
 * @param {number} aspect
 * @param {number} near
 * @param {number} far
 * @returns {number[]} 4x4 Matrix
 */
export function m4_perspective(fov, aspect, near, far) {}

/**
 * Returns the transpose of a 4x4 matrix
 * @public
 * @param {number[]} matrix
 * @returns {number[]} 4x4 Matrix
 */
export function m4_transpose(m) {}

/**
 * Returns the determinant of a 4x4 matrix
 * @public
 * @param {number[]} matrix
 * @returns {number} Determinant
 */
export function m4_determinant(m) {}

/**
 * Returns the inverse of a 4x4 matrix
 * @public
 * @param {number[]} matrix
 * @returns {number[]} 4x4 Matrix
 */
export function m4_invert(m) {}

/**
 * Multiply two 4x4 matrices
 * @public
 * @param {number[]} matrixA
 * @param {number[]} matrixB
 * @returns {number[]} 4x4 Matrix
 */
// A is applied before b
export function m4_multiply(a,b) {}

/**
 * Extracts the scaling/rotation components of a 4x4 transform matrix and performs an inverse/transpose operation on them.
 * This is the transform that should be applied to the surface normals of an object in a 3d rendered scene instead of the object's
 * regular 4x4 transform.
 * @public
 * @param {number[]} matrix
 * @returns {number[]} 4x4 Matrix
 */
export function m4_toNormal4(m) {}

