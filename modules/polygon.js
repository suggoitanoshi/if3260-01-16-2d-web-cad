import Util from "../utils.js";
import Object, { OBJECT_TYPES } from "./object.js";

// TODO: Fix bug 1st click always not working
class Polygon extends Object {
  /**
   * Koordinat mouse
   * @public
   * @type {number[]} array of length 2
   */
  _center;

  /**
   * Jumlah vertex
   * @public
   * @type {number}
   */
  _count;

  /**
   * Apakah sudah selesai
   * @public
   * @type {boolean}
   */
  _finished;

  /**
   * @public
   * @param {number[]} center array of length 2
   * @param {number[]} color array of (r, g, b) or (r, g, b, a)
   */
  constructor(center, color, canvas) {
    super(OBJECT_TYPES.POLY);
    this._finished = false;
    this._center = Util.getCanvasCoordinate(center[0], center[1], canvas);

    this.setColor(color);
    this.setPoints2(this._center);
    this._count = 1;
  }

  updatePoints(vertex, canvas) {
    var vertices = this.getVertices();
    vertex = Util.getCanvasCoordinate(vertex[0], vertex[1], canvas);
    vertices[vertices.length - 2] = vertex[0];
    vertices[vertices.length - 1] = vertex[1];
    this.setPoints2(vertices);
  }

  addPoints(vertex, canvas) {
    var vertices = this.getVertices();
    var vert = Util.getCanvasCoordinate(vertex[0], vertex[1], canvas);
    vertices = vertices.concat(vert);
    this.setPoints2(vertices);
    this._count++;
  }

  setFinished() {
    this._finished = true;
  }

  isFinished() {
    return this._finished;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    var type = gl.TRIANGLE_FAN;
    if (this._count === 1) {
      type = gl.LINES;
    }
    super.render(gl, type, this._count, uniformColor);
  }
}

export default Polygon;
