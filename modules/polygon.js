import Object, { OBJECT_TYPES } from "./object.js";

// ! NOT YET FINISHED
class Polygon extends Object {
  /**
   * @type {number[]} array of length 2
   */
  #handle;

  /**
   * @type {number}
   */
  #width;

  /**
   * @public
   * @type {number}
   */
  #height;

  /**
   * @public
   * @type {number[]} array of length 2
   */
  #bottomLeft;

  /**
   * @public
   * @param {number} width
   * @param {number} height
   * @param {number[]} bottomLeft array of length 2
   * @param {number[]} color array of (r, g, b) or (r, g, b, a)
   */
  constructor(width, height, bottomLeft, color) {
    super(OBJECT_TYPES.RECT);

    this.#width = width;
    this.#height = height;
    this.#bottomLeft = bottomLeft;

    this.setColor(color);

    this.setPoints([
      ...bottomLeft,
      bottomLeft[0] + width,
      bottomLeft[1],
      bottomLeft[0] + width,
      bottomLeft[1] + height,
      bottomLeft[0],
      bottomLeft[1] + height,
    ]);

    this.#handle = [bottomLeft[0] + width, bottomLeft[1] + height];
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    super.render(gl, gl.TRIANGLE_FAN, 4, uniformColor);
  }
}

export default Polygon;
