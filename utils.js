const Util = {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {number} type
   * @param {number} source
   * @returns {WebGLShader}
   */
  createShader: (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  },

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {WebGLShader} vertexShader
   * @param {WebGLShader} fragmentShader
   * @returns
   */
  createProgram: (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  },

  randomClipSpace: () => Math.random() * 2 - 1,

  /**
   * @param {number} x
   * @param {HTMLCanvasElement} canvas
   */
  scaleWidth: (x, canvas) => (x * 2) / canvas.clientWidth,

  /**
   *
   * @param {number} y
   * @param {HTMLCanvasElement} canvas
   */
  scaleHeight: (y, canvas) => (y * 2) / canvas.clientHeight,

  /**
   *
   * @param {MouseEvent} ev
   * @param {HTMLCanvasElement} canvas
   */
  scaleClick: (ev, canvas) => [
    -1 + Util.scaleWidth(ev.clientX - canvas.offsetLeft, canvas),
    1 - Util.scaleHeight(ev.clientY - canvas.offsetTop, canvas),
  ],
};

export default Util;
