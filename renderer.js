import shapes from "./modules/shapes.js";
import Util from "./utils.js";

(() => {
  document.addEventListener("DOMContentLoaded", async (_e) => {
    // Needed, prevent lookup before DOM ready
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("#canvas");

    const gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    /* Initialize canvas */
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0, 0, 0, 1);

    /* Initialize shader */
    let vertexShaderSource = "";
    let fragmentShaderSource = "";
    try {
      vertexShaderSource = await fetch("vert_shader.glsl").then((data) =>
        data.text()
      );
      fragmentShaderSource = await fetch("frag_shader.glsl").then((data) =>
        data.text()
      );
    } catch (e) {
      return;
    }

    const vertexShader = Util.createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = Util.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    const program = Util.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    const vColor = gl.getUniformLocation(program, "vColor");

    const randomClipSpace = Util.randomClipSpace;

    /* Depth test to avoid rendering overlapped shapes */
    //gl.enable(gl.DEPTH_TEST);

    const rects = Array(6)
      .fill()
      .map((_, i) =>
        i % 2
          ? new shapes.Rectangle(
              randomClipSpace(),
              randomClipSpace(),
              [randomClipSpace(), randomClipSpace()],
              [Math.random(), Math.random(), Math.random(), 1]
            )
          : new shapes.Square(
              160,
              [randomClipSpace(), randomClipSpace()],
              [Math.random(), Math.random(), Math.random(), 1],
              canvas
            )
      );

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      rects.forEach((v) => v.render(gl, vColor));
    };

    const poly = document.getElementById("polygon");
    const rectangle = document.getElementById("rectangle");
    const square = document.getElementById("square");
    function log(msg) {
      console.log(msg);
    }
    let mode = 0;
    poly.addEventListener("click", () => {
      mode = 0;
      log(mode);
    });
    rectangle.addEventListener("click", () => {
      mode = 1;
      log(mode);
    });
    square.addEventListener("click", () => {
      mode = 2;
      log(mode);
    });

    canvas.addEventListener("click", (ev) => {
      if (mode == 2) {
        rects.push(
          new shapes.Square(
            320,
            Util.getCanvasCoordinate(ev, canvas),
            [randomClipSpace(), randomClipSpace(), randomClipSpace()],
            canvas
          )
        );
      }

      render();
    });

    render();
  });
})(); // IIFE
