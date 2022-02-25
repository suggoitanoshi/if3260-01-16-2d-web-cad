import Util from "./utils.js";
import Object, { OBJECT_TYPES } from "./object.js";

export default class Square extends Object {
  /**
   * @type {number[]}
   */
  _start;

  /**
   * @type {HTMLCanvasElement}
   */
  _cnv;

  /**
   * @param {number[]} start real (x, y) HTML Elements in canvas, taken from clientX and clientY
   * @param {number[]} end real (x, y) HTML Elements in canvas, taken from clientX and clientY
   * @param {number[]} color array of 3 elements [r, g, b] or 4 elements [r, g, b, a]
   * @param {HTMLCanvasElement} canvas the canvas this square is in
   */
  constructor(start, end, color, canvas) {
    super(OBJECT_TYPES.SQUARE);

    this._cnv = canvas;

    this._start = start;

    this.setColor(color);
    this.setEnd(end);
  }

  /**
   * @param {number[]} end real (x, y) HTML Elements in canvas, taken from clientX and clientY
   */
  setEnd(end) {
    /**
     * @type {number}
     */
    var deltaX;

    /**
     * @type {number}
     */
    var deltaY;

    const minimumSides = Math.min(
      Math.abs(this._start[0] - end[0]),
      Math.abs(this._start[1] - end[1])
    );

    const quadrans = [end[0] - this._start[0], end[1] - this._start[1]];

    if (quadrans[0] >= 0 && quadrans[1] >= 0) {
      deltaX = deltaY = minimumSides;
    } else if (quadrans[0] >= 0 && quadrans[1] < 0) {
      deltaY = -minimumSides;
      deltaX = minimumSides;
    } else if (quadrans[0] < 0 && quadrans[1] >= 0) {
      deltaY = minimumSides;
      deltaX = -minimumSides;
    } else {
      deltaY = deltaX = -minimumSides;
    }

    this.setPoints(
      [
        this._start,
        [this._start[0] + deltaX, this._start[1]],
        [this._start[0] + deltaX, this._start[1] + deltaY],
        [this._start[0], this._start[1] + deltaY],
      ]
        .map(([x, y]) => Util.getCanvasCoordinate(x, y, this._cnv))
        .flat()
    );

    this.setControls(
      [this.points[0], this.points[1]],
      [this.points[4], this.points[5]]
    );
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    super.render(gl, gl.TRIANGLE_FAN, 4, uniformColor);
  }
}
