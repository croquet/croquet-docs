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

/**
 * Null 2-vector [0,0]
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
 * Cross product of two vectors
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
 * Minimum of two vectors (x compared to x, y compared to y)
 * @public
 * @param {number[]} vectorA
 * @param {number[]} vectorB
 * @returns {number}
 */
export function v2_min(a,b) {}

/**
 * Maximum of two vectors (x compared to x, y compared to y)
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

//Clockwise in radians
export function v2_rotate(v,a,c) {
    const sinA = Math.sin(a);
    const cosA = Math.cos(a);
    if (c) {
        const vc = v2_sub(v, c);
        return v2_add(c, [cosA*vc[0] - sinA*vc[1], sinA*vc[0] + cosA*vc[1]]);
    }
    return [cosA*v[0] - sinA*v[1], sinA*v[0] + cosA*v[1]];
}

export function v2_transform(v, m) {
    const x = v[0], y = v[1];
    return ([
        m[0] * x + m[2] * y,
        m[1] * x + m[3] * y
    ]);
}

