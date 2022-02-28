import Util from "./utils.js";
import Object, { OBJECT_TYPES } from "./object.js";

class Polygon extends Object {
  /**
   * Mouse coordinate on canvas
   * @public
   * @type {number[]} array of length 2
   */
  _center;

  /**
   * Vertex count for rendering
   * @public
   * @type {number}
   */
  _count;

  /**
   * Polygon finished status
   * @public
   * @type {boolean}
   */
  _finished;

  /**
   * @public
   * @param {[number, number]} center array of length 2
   * @param {[number, number, number, number]} color array of (r, g, b) or (r, g, b, a)
   */
  constructor(center, color) {
    super(OBJECT_TYPES.POLY);
    this._finished = false;
    this._center = center;
    this.anchorPoint = this._center;
    this.handlePoint = this._center;

    this.setColor(color);
    this.setPoints2(this._center);
    this._count = 1;
  }

  /**
   * Update points, for "animating"
   * @param {number[]} vertex
   * @param {canvas} canvas
   */
  updatePoints(vertex, canvas) {
    var vertices = this.getVertices();
    vertex = Util.getCanvasCoordinate(vertex[0], vertex[1], canvas);
    vertices[vertices.length - 2] = vertex[0];
    vertices[vertices.length - 1] = vertex[1];
    this.setPoints2(vertices);
  }

  /**
   * Add points to polygon
   * @param {[number, number]} vertex
   */
  addPoints(vertex) {
    var vertices = this.getVertices();
    vertices = vertices.concat(vertex);
    this.setPoints2(vertices);
    this._count++;

    if (vertex[0] < this.anchorPoint[0])
      this.anchorPoint = [vertex[0], this.anchorPoint[1]];
    if (vertex[1] < this.anchorPoint[1])
      this.anchorPoint = [this.anchorPoint[1], vertex[1]];

    if (vertex[0] > this.handlePoint[0])
      this.handlePoint = [vertex[0], this.handlePoint[1]];
    if (vertex[1] > this.handlePoint[1])
      this.handlePoint = [this.handlePoint[1], vertex[1]];
  }

  /**
   * Set polygon as finished
   */
  setFinished() {
    this._finished = true;
  }

  /**
   * Check if polygon is finished or not
   * @returns boolean
   */
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

  pack() {
    return {
      type: "poly",
      center: this._center,
      vertices: this.getVertices(),
      color: this.getColor(),
    };
  }
}

export default Polygon;
