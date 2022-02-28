import Line from "./line.js";
import Polygon from "./polygon.js";
import Rectangle from "./rectangle.js";
import Square from "./square.js";

function save(objects) {
  var tmp = [];
  objects.map((v) => {
    tmp.push(v.pack());
  });
  var text = JSON.stringify(tmp, null, 2);
  var filename = "webgl";
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function load(text, canvas) {
  const file = JSON.parse(text);
  var objects = [];
  try {
    file.map((v) => {
      switch (v.type) {
        case "line":
          var tmp = new Line(v.start, v.color);
          tmp.setEnd(v.end);
          objects.push(tmp);
          break;
        case "poly":
          var tmp = new Polygon(v.center, v.color);
          for (var i = 0; i < v.vertices.length; i += 2) {
            tmp.addPoints([v.vertices[i], v.vertices[i + 1]]);
          }
          tmp.setFinished();
          objects.push(tmp);
          break;
        case "rect":
          var tmp = new Rectangle(v.width, v.height, v.bottomLeft, v.color);
          objects.push(tmp);
          break;
        case "square":
          var tmp = new Square(v.start, v.end, v.color, canvas);
          objects.push(tmp);
          break;
        default:
          throw "not a valid type";
      }
    });
  } catch (error) {
    console.error(error);
  }
  return objects;
}

export { save, load };
