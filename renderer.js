import shapes from "./modules/shapes.js";
import Util from "./utils.js";

(() => {
  document.addEventListener("DOMContentLoaded", async (_e) => {
    var isDragging = false;
    var isDown = false;

    // Needed, prevent lookup before DOM ready
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("#canvas");

    /**
     * @type {HTMLFormElement}
     */
    const form = document.forms["form"];

    /**
     * @type {HTMLInputElement}
     */
    const color = form["color"];

    /**
     * @type {HTMLSelectElement}
     */
    const select = form["shape"];

    const gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }

    /* Initialize canvas */
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0, 0, 0, 0);

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

    const objects = [];

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      objects.forEach((v) => {
        if (v instanceof shapes.Square) {
          v.render(gl, vColor);
        } else if (v instanceof shapes.Rectangle) {
          v.render(gl, vColor);
        }
      });
    };

    canvas.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (select.value === "Square") {
        objects.push(
          new shapes.Square(
            [ev.clientX, ev.clientY],
            [ev.clientX, ev.clientY],
            [...Util.convertToRGB(color.value), 0.3],
            canvas
          )
        );
      }

      isDown = true;
      isDragging = true;
    });

    canvas.addEventListener("mouseup", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      isDown = false;
      isDragging = false;

      const drawnObject = objects[objects.length - 1];
      if (drawnObject instanceof shapes.Square) {
        drawnObject.setOpacity(1);
      }
      render();
    });

    canvas.addEventListener("mouseenter", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      isDown = isDragging;
    });

    canvas.addEventListener("mouseleave", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      isDown = false;
    });

    canvas.addEventListener("mousemove", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!isDragging) return;

      const drawnObject = objects[objects.length - 1];

      if (drawnObject instanceof shapes.Square) {
        drawnObject.setEnd([ev.clientX, ev.clientY]);
      }

      render();
    });

    render();
  });
})(); // IIFE
