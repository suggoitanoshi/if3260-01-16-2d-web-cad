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

    /* Binding for vertices */
    const vertices = [
      -0.5, -0.5,
      -0.5, 0.5,
      0.5, 0.5,
      0.5, -0.5
    ]
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    /* Color uniform location */
    const vColor = gl.getUniformLocation(program, 'vColor');

    let r = 0, g = 0, b = 0;
    let rSign = 1, gSign = 1, bSign = 1;

    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      r += 0.01*rSign;
      g += 0.001*gSign;
      b += 0.005*bSign;
      if(Math.abs(r) > 1) rSign *= -1;
      if(Math.abs(g) > 1) gSign *= -1;
      if(Math.abs(b) > 1) bSign *= -1;
      gl.uniform4f(vColor, r, g, b, 1);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      window.requestAnimationFrame(render);
    }
    render();
  });
})(); // IIFE
