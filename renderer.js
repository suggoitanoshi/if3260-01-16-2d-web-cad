import CanvasWrapper from "./modules/canvas.js";
import shapes from "./modules/shapes.js";
import Util from "./modules/utils.js";

(() => {
  document.addEventListener("DOMContentLoaded", async (_e) => {
    var isDragging = false;

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

    const canvasWrapper = new CanvasWrapper(640, 480, canvas);

    /* Initialize shader */
    let vertexShaderSource, fragmentShaderSource;
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
    const gl = canvasWrapper.initializeGL(
      vertexShaderSource,
      fragmentShaderSource
    );
    const program = canvasWrapper.program;

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
        v.render(gl, vColor);
        if (mode !== "create") v.renderControl(gl, vColor, mode);
      });
    };

    let mode = "create";
    let dragObject = null;

    document.addEventListener("mouseup", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!isDragging) return;
      dragObject = null;
      isDragging = false;

      const drawnObject = objects[objects.length - 1];
      drawnObject.setOpacity(1);
      render();
    });

    canvas.addEventListener("mousedown", (ev) => {
      const drawnObject = objects[objects.length - 1];
      ev.preventDefault();
      ev.stopPropagation();

      if (mode === "create") {
        if (select.value === "Square") {
          objects.push(
            new shapes.Square(
              [ev.pageX, ev.pageY],
              [ev.pageX, ev.pageY],
              [...Util.convertToRGB(color.value), 0.6],
              canvas
            )
          );
        } else if (select.value === "Rectangle") {
          objects.push(
            new shapes.Rectangle(
              0,
              0,
              canvasWrapper.canvasToClip(ev.pageX, ev.pageY),
              [...Util.convertToRGB(color.value), 0.6]
            )
          );
        } else if (select.value === "Polygon") {
          /* IF POLYGON */
          if (drawnObject instanceof shapes.Polygon) {
            if (!drawnObject.isFinished()) {
              drawnObject.addPoints([ev.pageX, ev.pageY], canvas);
            } else {
              objects.push(
                new shapes.Polygon(
                  [ev.pageX, ev.pageY],
                  [...Util.convertToRGB(color.value), 1],
                  canvas
                )
              );
            }
          } else {
            objects.push(
              new shapes.Polygon(
                [ev.pageX, ev.pageY],
                [...Util.convertToRGB(color.value), 1],
                canvas
              )
            );
          }
        } else if (select.value === "Line") {
          const clipCoord = canvasWrapper.canvasToClip(ev.pageX, ev.pageY);
          objects.push(
            new shapes.Line(clipCoord, [...Util.convertToRGB(color.value), 1])
          );
        }
      } else if (mode === "move") {
        const points = objects
          .map((v) => {
            return {
              obj: v,
              dist: Util.euclidDist(
                v.anchorPoint,
                canvasWrapper.canvasToClip(ev.pageX, ev.pageY)
              ),
            };
          })
          .filter((v) => v.dist <= 0.05)
          .sort((a, b) => a.dist - b.dist);
        dragObject = points?.[0]?.obj;
      } else if (mode === "resize") {
        const points = objects
          .map((v) => {
            return {
              obj: v,
              dist: Util.euclidDist(
                v.handlePoint,
                canvasWrapper.canvasToClip(ev.pageX, ev.pageY)
              ),
            };
          })
          .filter((v) => v.dist <= 0.05)
          .sort((a, b) => a.dist - b.dist);
        dragObject = points?.[0]?.obj;
      } else if (mode === "recolor") {
        const points = objects
          .map((v) => {
            return {
              obj: v,
              dist: Util.euclidDist(
                v.handlePoint,
                canvasWrapper.canvasToClip(ev.pageX, ev.pageY)
              ),
            };
          })
          .filter((v) => v.dist <= 0.05)
          .sort((a, b) => a.dist - b.dist);
        dragObject = points?.[0]?.obj;

        dragObject.setColor(Util.convertToRGB(color.value));
      }

      isDragging = true;
      render();
    });

    canvas.addEventListener("mousemove", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!isDragging) return;
      else {
        if (mode === "create" || mode === "resize") {
          let drawnObject;
          if (mode === "create") drawnObject = objects[objects.length - 1];
          else if (mode === "resize") {
            if (!dragObject) return;
            drawnObject = dragObject;
          }

          if (drawnObject instanceof shapes.Square) {
            drawnObject.setEnd([ev.pageX, ev.pageY]);
          } else if (drawnObject instanceof shapes.Polygon) {
            if (mode === "create") {
              drawnObject.updatePoints([ev.pageX, ev.pageY], canvas);
            } else {
              const [clipX, clipY] = canvasWrapper.canvasToClip(
                ev.pageX,
                ev.pageY
              );
              const [anchorX, anchorY] = drawnObject.anchorPoint;
              const [sizeX, sizeY] = [
                (clipX - anchorX) / (drawnObject.handlePoint[0] - anchorY),
                (clipY - anchorY) / (drawnObject.handlePoint[1] - anchorY),
              ];
              drawnObject.scale(sizeX, sizeY);
            }
          } else if (drawnObject instanceof shapes.Rectangle) {
            const clipCoords = canvasWrapper.canvasToClip(ev.pageX, ev.pageY);
            drawnObject.updateSizing(
              clipCoords[0] - drawnObject.anchorPoint[0],
              clipCoords[1] - drawnObject.anchorPoint[1]
            );
          } else if (drawnObject instanceof shapes.Line) {
            const [clipX, clipY] = canvasWrapper.canvasToClip(
              ev.pageX,
              ev.pageY
            );
            drawnObject.setEnd([clipX, clipY]);
          }
        } else if (mode === "move") {
          if (!dragObject) return;
          const clipCoords = canvasWrapper.canvasToClip(ev.pageX, ev.pageY);
          dragObject.move(
            clipCoords[0] - dragObject.anchorPoint[0],
            clipCoords[1] - dragObject.anchorPoint[1]
          );
        }
      }
      render();
    });

    const modeIndicator = document.querySelector(".mode");
    ["create", "move", "resize", "recolor"].forEach((v) => {
      document.querySelector(`.${v}`).addEventListener("click", (e) => {
        mode = v;
        modeIndicator.innerText = v;
        render();
      });
    });

    canvas.addEventListener("dblclick", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const drawnObject = objects[objects.length - 1];
      if (drawnObject instanceof shapes.Polygon) {
        drawnObject.setFinished();
      }
    });

    const clear = document.getElementById("Clear");
    clear.addEventListener("click", () => {
      objects.length = 0;
      render();
    });

    render();
  });
})();
