import Object, { OBJECT_TYPES } from "./object.js";

class Line extends Object {
  /** @type {[number,number]} */
  #start;
  /** @type {[number,number]} */
  #end;

  get end(){ return this.#end; }

  /**
   * @public
   * @param {[number,number]} start start of line segment in clip coordinates
   */
  constructor(start, color) {
    super(OBJECT_TYPES.LINE);
    this.#start = start;

    this.setColor(color);
  }

  /**
   * @param {[number,number]} end 
   */
  setEnd(end){
    this.#end = end;
    this.setPoints([...this.#start, ...this.#end]);
    this.setControls(this.#start, this.#end);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    super.render(gl, gl.LINE_STRIP, 2, uniformColor);
  }
}

export default Line;
