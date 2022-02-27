import Object, { OBJECT_TYPES } from "./object.js";

class Rectangle extends Object {
  /** @type {number} */
  #width;

  /** @type {number} */
  #height;

  /** @type {[number. number]} */
  #bottomLeft;

  /**
   * @param {number} width width of rect in clip space
   * @param {number} height height of rect in clip space
   * @param {[number, number]} bottomLeft the "bottom left" (anchor) of the rect
   * @param {[number,number,number,number?]} color color array in rgba
   */
  constructor(width, height, bottomLeft, color) {
    super(OBJECT_TYPES.RECT);

    this.#width = width;
    this.#height = height;
    this.#bottomLeft = bottomLeft;

    this.setControls(bottomLeft, null);

    this.updateSizing(width, height);

    this.setColor(color);
  }

  /**
   * Function to update sizing (width/height)
   * @param {number} width new width in clip space
   * @param {number} height new height in clip space
   */
  updateSizing(width, height) {
    this.#width = width;
    this.#height = height;

    this.setPoints(
      [
        this.anchorPoint,
        [this.anchorPoint[0] + width, this.anchorPoint[1]],
        [this.anchorPoint[0] + width, this.anchorPoint[1] + height],
        [this.anchorPoint[0], this.anchorPoint[1] + height],
      ].flat()
    );

    this.setControls(null, [
      this.anchorPoint[0] + width,
      this.anchorPoint[1] + height,
    ]);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {WebGLUniformLocation} uniformColor array of (r, g, b) or (r, g, b, a) values
   */
  render(gl, uniformColor) {
    super.render(gl, gl.TRIANGLE_FAN, 4, uniformColor);
  }

  pack() {
    return {
      type: "rect",
      width: this.#width,
      height: this.#height,
      bottomLeft: this.#bottomLeft,
      color: this.getColor(),
    };
  }
}

export default Rectangle;
