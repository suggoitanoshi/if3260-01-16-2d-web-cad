export const OBJECT_TYPES = {
  LINE: 0,
  SQUARE: 1,
  RECT: 2,
  POLY: 3,
};

class Object {
  /**
   * @type {keyof typeof OBJECT_TYPES}
   */
  #type; // see constants OBJCET_TYPES

  /**
   * @public
   * @type {number[]} array of 2 elements
   */
  #vertices; // vertices, should be in clip space but debatable
  get points(){ return this.#vertices; }

  /**
   * @public
   * @type {number[]} array of 4 elements
   */
  #color; // quadruple of color (r,g,b,a)

  /** @type {[number,number]} coordinate of control point in clip space */
  #handlePoint;
  get handlePoint(){ return this.#handlePoint; }

  /** @type {[number,number]} coordinate of anchor point in clip space */
  #anchorPoint;
  get anchorPoint(){ return this.#anchorPoint; }

  /** @type {number} */
  #controlSize = 0.05;
  /** @type {number} */
  #controlSizeHover = 0.09;

  /**
   * @param {keyof typeof OBJECT_TYPES} type
   */
  constructor(type) {
    this.setType(type);
  }

  /**
   * @param {keyof typeof OBJECT_TYPES} type
   */
  setType(type) {
    this.#type = type;
  }

  /**
   * @param {number[]} color array of (r, g, b) or (r, g, b, a)
   */
  setColor(color) {
    // default value of a is 1
    if (color.length === 3) color = color.concat(1);

    this.#color = color;
  }

  getColor() {
    return this.#color;
  }

  /**
   * Function to set opacity
   * @param {number} opacity opacity [0..1] of the object
   */
  setOpacity(opacity){
    this.#color[3] = opacity;
  }

  /**
   * @param {number[]} vertices array of vertices
   */
  setPoints(vertices) {
    this.#vertices = vertices;
  }

  move(deltaX, deltaY){
    this.#vertices = this.#vertices.map((v, i) => v + (i % 2 === 0 ? deltaX : deltaY));
    this.#anchorPoint[0] += deltaX;
    this.#anchorPoint[1] += deltaY;
  }

  /**
   * @param {[number,number]} anchor anchor point
   * @param {[number,number]} handle handle point
   */
  setControls(anchor, handle){
    this.#anchorPoint = anchor || this.#anchorPoint;
    this.#handlePoint = handle || this.#handlePoint;
  }

  /**
   * set vertices as is
   * @param {number[]} vertices array
   */
  setPoints2(vertices) {
    this.#vertices = vertices;
  }

  getVertices() {
    return this.#vertices;
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {number} type WebGL Type
   * @param {number} count
   * @param {WebGLUniformLocation} uniformColor location of vColor
   */
  render(gl, type, count, uniformColor) {
    gl.uniform4f(uniformColor, ...this.#color); // set color for fragment shader
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.#vertices),
      gl.STATIC_DRAW
    ); // buffer the vertices
    gl.drawArrays(type, 0, count); // draw the vertices
  }

  renderControl(gl, uniformColor, type){
    if(type !== 'move' && type !== 'resize') throw new Error();
    const center = type === 'move' ? this.#anchorPoint : this.#handlePoint;
    const n = 10;
    const controlPoints = Array(n).fill().map((_, i) => [
      center[0] + (this.#controlSize * Math.cos(i*2*Math.PI/n)),
      center[1] + (this.#controlSize * Math.sin(i*2*Math.PI/n))
    ]);
    controlPoints.push(controlPoints[0]);
    controlPoints.unshift(center);
    gl.uniform4f(uniformColor, ...this.#color.slice(0,3), .4);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(controlPoints.flat()),
      gl.STATIC_DRAW
    );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n+2);
  }

}

export default Object;
