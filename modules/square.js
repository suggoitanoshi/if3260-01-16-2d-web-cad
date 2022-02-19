import Util from "../utils.js";
import Object, { OBJECT_TYPES } from "./object.js";

export default class Square extends Object {
  /**
   * @type {number}
   */
  _size;

  /**
   * @type {number[]} array of length 2
   */
  _bottomLeft;

  /**
   * @param {number} size in pixels
   * @param {number[]} bottomLeft array of length 2
   * @param {number[]} color array of 3 values (r, g, b) or 4 values (r, g, b, a)
   * @param {HTMLCanvasElement} canvas
   */
  constructor(size, bottomLeft, color, canvas) {
    super(OBJECT_TYPES.SQUARE);

    this._size = size;
    this._bottomLeft = bottomLeft;

    this.setColor(color);
    this.setPoints([
      ...bottomLeft,
      bottomLeft[0] + Util.scaleWidth(size, canvas),
      bottomLeft[1],
      bottomLeft[0] + Util.scaleWidth(size, canvas),
      bottomLeft[1] + Util.scaleHeight(size, canvas),
      bottomLeft[0],
      bottomLeft[1] + Util.scaleHeight(size, canvas),
    ]);
    this.setColor(color);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    super.render(gl, gl.TRIANGLE_FAN, 4, uniformColor);
  }
}
