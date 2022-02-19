import Rectangle from "./modules/rectangle.js";

(() => {
  document.addEventListener('DOMContentLoaded', async (_e) => { // Needed, prevent lookup before DOM ready
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    if(!gl){
      return;
    }

    /* Initialize canvas */
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0, 0, 0, 1);

    /* Initialize shader */
    let vertexShaderSource, fragmentShaderSource;
    try{
      vertexShaderSource = await fetch('vert_shader.glsl').then(data => data.text());
      fragmentShaderSource = await fetch('frag_shader.glsl').then(data => data.text());
    }
    catch(e){
      return;
    }
    const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = Util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = Util.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    const vColor = gl.getUniformLocation(program, 'vColor');

    const randomClipSpace = Util.randomClipSpace;

    const rects = Array(5).fill().map(() => new Rectangle(randomClipSpace(), randomClipSpace(), [randomClipSpace(), randomClipSpace()], [Math.random(), Math.random(), Math.random(), 1]))

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      rects.forEach(v => v.render(gl, vColor));
    }
    render();
  });
})(); // IIFE
