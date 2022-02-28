import Util from "./utils.js";

class CanvasWrapper {
  /** @type {HTMLCanvasElement} */
  #canvas;
  /** @type {WebGLRenderingContext} */
  #gl;
  /** @type {WebGLProgram} */
  #program;
  /** */

  get gl() {
    return this.#gl;
  }
  get width() {
    return this.#canvas.width;
  }
  get height() {
    return this.#canvas.height;
  }
  get program() {
    return this.#program;
  }

  /**
   * Constructor for canvas wrapper
   * @param {number} width requested width for canvas
   * @param {number} height requested height for canvas
   * @param {HTMLCanvasElement} element canvas element to attach
   */
  constructor(width, height, element) {
    /* Sanity check */
    if (!width) throw new Error("Must specify width!");
    if (!height) throw new Error("Must specify height!");
    if (!element) throw new Error("Must specify element!");

    this.#canvas = element;
    this.#canvas.width = width;
    this.#canvas.height = height;
  }

  /**
   * Function to initialize GL
   * @param {string} vertSource Vertex shader source
   * @param {string} fragSource Fragment shader source
   * @returns {WebGLRenderingContext} the canvas' GL context
   */
  initializeGL(vertSource, fragSource) {
    const gl = (this.#gl = this.#canvas.getContext("webgl"));
    gl.viewport(0, 0, this.width, this.height);
    gl.clearColor(0, 0, 0, 0);

    const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = Util.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragSource
    );
    const program = (this.#program = Util.createProgram(
      gl,
      vertexShader,
      fragmentShader
    ));
    gl.useProgram(program);

    return gl;
  }

  /**
   * Function to translate canvas space coordinate to clip space coordinate
   * @param {number} x x coordinate in canvas space
   * @param {number} y y coordinate in canvas space
   * @returns {[number, number]} x, y in clip space
   */
  canvasToClip(x, y) {
    return Util.getCanvasCoordinate(x, y, this.#canvas);
  }
}

export default CanvasWrapper;
