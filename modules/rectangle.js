import Object, { OBJECT_TYPES } from "./object.js";

class Rectangle extends Object{
  #handle;
  #width;
  #height;
  #bottomLeft;

  constructor(width, height, bottomLeft, color){
    super(OBJECT_TYPES.RECT);
    this.#width = width;
    this.#height = height;
    this.#bottomLeft = bottomLeft
    this.setColor(color);
    this.setPoints([
      ...bottomLeft,
      bottomLeft[0]+width, bottomLeft[1],
      bottomLeft[0]+width, bottomLeft[1]+height,
      bottomLeft[0], bottomLeft[1]+height
    ]);
    this.#handle = [bottomLeft[0]+width, bottomLeft[1]+height];
  }

  render(gl, uniformColor){
    super.render(gl, gl.TRIANGLE_FAN, 4, uniformColor);
  }
}

export default Rectangle;