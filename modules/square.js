import Util from "./utils.js";
import Object, { OBJECT_TYPES } from "./object.js";

export default class Square extends Object {
  /**
   * @type {number[]}
   */
  _start;

  /**
   * @type {number[]}
   */
  _end;

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
    const minimumSides = Math.min(
      Math.abs(this._start[0] - end[0]),
      Math.abs(this._start[1] - end[1])
    );

    if (minimumSides === 0) {
      this._end = this._start;
      this.setPoints([
        ...this._start,
        ...this._start,
        ...this._start,
        ...this._start,
      ]);
    }

    const quadrans = [end[0] - this._start[0], end[1] - this._start[1]];

    /**
     * @type {number[]}
     */
    let endCoordinate = [];

    /**
     * @type {number[][]}
     */
    let endPoints = [];

    if (quadrans[0] > 0) {
      // draw from left to right
      if (quadrans[1] > 0) {
        // you could say that we draw from bottom-left to top-right
        endCoordinate = [
          this._start[0] + minimumSides,
          this._start[1] + minimumSides,
        ];
        endPoints = [
          this._start,
          [this._start[0] + minimumSides, this._start[1]],
          this._end,
          [this._start[0], this._start[1] + minimumSides],
        ];
      } else {
        // you could say that we draw from top-left to bottom-right
        endCoordinate = [
          this._start[0] + minimumSides,
          this._start[1] - minimumSides,
        ];

        endPoints = [
          this._start,
          [this._start[0], this._start[1] - minimumSides],
          this._end,
          [this._start[0] + minimumSides, this._start[1]],
        ];
      }
    } else {
      // draw from right to left
      if (quadrans[1] > 0) {
        // draw from bottom-right to top-left
        endCoordinate = [
          this._start[0] - minimumSides,
          this._start[1] + minimumSides,
        ];

        endPoints = [
          this._start,
          [this._start[0], this._start[1] + minimumSides],
          this._end,
          [this._start[0] - minimumSides, this._start[1]],
        ];
      } else {
        // draw from top-right to bottom-left
        endCoordinate = [
          this._start[0] - minimumSides,
          this._start[1] - minimumSides,
        ];

        endPoints = [
          this._start,
          [this._start[0] - minimumSides, this._start[1]],
          this._end,
          [this._start[0], this._start[1] - minimumSides],
        ];
      }
    }

    this._end = endCoordinate;

    this.setPoints(
      endPoints
        .map(([x, y]) => Util.getCanvasCoordinate(x, y, this._cnv))
        .flat()
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
