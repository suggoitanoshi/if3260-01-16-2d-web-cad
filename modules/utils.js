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
  scaleWidth: (x, canvas) => (x * 2) / canvas.width,

  /**
   *
   * @param {number} y
   * @param {HTMLCanvasElement} canvas
   */
  scaleHeight: (y, canvas) => (y * 2) / canvas.height,

  /**
   * @param {number} x
   * @param {number} y
   * @param {HTMLCanvasElement} canvas
   */
  getCanvasCoordinate: (x, y, canvas) => [
    -1 + Util.scaleWidth(x - canvas.offsetLeft, canvas),
    1 - Util.scaleHeight(y - canvas.offsetTop, canvas),
  ],

  /**
   * @param {string} colorHexa
   * @returns {[number, number, number]} RGB Value
   */
  convertToRGB: (colorHexa) => {
    const RGB = colorHexa.slice(1);

    const R = RGB.slice(0, 2);
    const G = RGB.slice(2, 4);
    const B = RGB.slice(4, 6);

    return [
      parseInt(R, 16) / 255,
      parseInt(G, 16) / 255,
      parseInt(B, 16) / 255,
    ];
  },

  /**
   * @param {[number, number]} a point a
   * @param {[number, number]} b point b
   */
  euclidDist: (a, b) => {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
  },
};

export default Util;
