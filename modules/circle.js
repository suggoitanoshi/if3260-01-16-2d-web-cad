import Util from "../utils.js";
import Object, { OBJECT_TYPES } from "./object.js";

class Circle extends Object {
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
   * @public
   * @param {number[]} center array of length 2
   * @param {number[]} color array of (r, g, b) or (r, g, b, a)
   */
  constructor(center, color, canvas) {
    super(OBJECT_TYPES.POLY);
    var r = 0.01;

    this._center = Util.getCanvasCoordinate(center[0], center[1], canvas);

    this.setColor(color);
    var vertices = [];
    for (var i = 0; i <= 360; i++) {
      var temp = [
        this._center[0] + r * Math.cos((i * Math.PI * 2) / 180),
        this._center[1] + r * Math.sin((i * Math.PI * 2) / 180),
      ];
      vertices = vertices.concat(temp);
    }
    this.setPoints2(vertices);
    this._count = vertices.length / 2;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    super.render(gl, gl.TRIANGLE_FAN, this._count, uniformColor);
  }
}

export default Circle;
