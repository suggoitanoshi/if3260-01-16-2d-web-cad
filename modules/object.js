export const OBJECT_TYPES = {
  LINE: 0,
  SQUARE: 1,
  RECT: 2,
  POLY: 3,
};

class Object {
  /**
   * @type {keyof typeof OBJECT_TYPES}
   */
  #type; // see constants OBJCET_TYPES

  /**
   * @public
   * @type {number[]} array of 2 elements
   */
  #vertices; // vertices, should be in clip space but debatable

  /**
   * @public
   * @type {number[]} array of 4 elements
   */
  #color; // quadruple of color (r,g,b,a)

  /**
   * @param {keyof typeof OBJECT_TYPES} type
   */
  constructor(type) {
    this.setType(type);
  }

  /**
   * @param {keyof typeof OBJECT_TYPES} type
   */
  setType(type) {
    this.#type = type;
  }

  /**
   * @param {number[]} color array of (r, g, b) or (r, g, b, a)
   */
  setColor(color) {
    // default value of a is 1
    if (color.length === 3) color = color.concat(1);

    this.#color = color;
  }

  getColor() {
    return this.#color;
  }

  /**
   * Function to set opacity
   * @param {number} opacity opacity [0..1] of the object
   */
  setOpacity(opacity){
    this.#color[3] = opacity;
  }

  /**
   * @param {number[]} vertices array of vertices
   */
  setPoints(vertices) {
    this.#vertices = vertices;
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {number} type WebGL Type
   * @param {number} count
   * @param {WebGLUniformLocation} uniformColor location of vColor
   */
  render(gl, type, count, uniformColor) {
    gl.uniform4f(uniformColor, ...this.#color); // set color for fragment shader
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.#vertices),
      gl.STATIC_DRAW
    ); // buffer the vertices
    gl.drawArrays(type, 0, count); // draw the vertices
  }
}

export default Object;
