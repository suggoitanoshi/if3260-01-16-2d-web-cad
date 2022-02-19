export const OBJECT_TYPES = {'LINE': 0, 'SQUARE': 1, 'RECT': 2, 'POLY': 3};

class Object {
  #type; // see constants OBJCET_TYPES
  #vertices; // vertices, should be in clip space but debatable
  #color; // quadruple of color (r,g,b,a)

  constructor(type){
    this.#type = type;
  }

  setColor(color){
    this.#color = color;
  }

  setPoints(vertices){
    this.#vertices = vertices;
  }


  render(gl, type, count, uniformColor){
    gl.uniform4f(uniformColor, ...this.#color); // set color for fragment shader
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW); // buffer the vertices
    gl.drawArrays(type, 0, count); // draw the vertices
  }
}

export default Object;