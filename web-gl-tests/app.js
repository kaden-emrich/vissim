// Kaden Emrich 
// https://www.youtube.com/watch?v=kB0ZVUrI4Aw&list=PLjcVFFANLS5zH_PeKC6I8p0Pt1hzph_rt

var vertexShaderText = 
[
'precision mediump float;', // specifies the precision of the float values (medium)
'',
'attribute vec2 vertPosition;', // attribute for the vertex position
'attribute vec3 vertColor;', // attribute for the vertex color
'varying vec3 fragColor;', // varying variable for the fragment color
'',
'void main()',
'{',
'   fragColor = vertColor;', // sets the fragment color to the vertex color
'   gl_Position = vec4(vertPosition, 0.0, 1.0);', // sets the position of the vertex (position, z, w)
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;', // specifies the precision of the float values (medium)
'',
'varying vec3 fragColor;', // varying variable for the fragment color
'', 
'void main()',
'{',
'   gl_FragColor = vec4(fragColor, 1.0);', // sets the color of the fragment (r, g, b, a)
'}'
].join('\n');

function InitDemo() {
    console.log("this is working");

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl'); // gets webgl context

    if(!gl) {
        console.log('WebGL not supported, falling back on experimental-WebGL'); // for Internet Explorer and Safari
        gl = canvas.getContext('experimental-webgl');
    }
    if(!gl) {
        alert('Your browser does not support webGL');
    }

    // gl.viewport(0, 0, canvas.width, canvas.height); // ensures that the WebGL viewport matches the size of the canvas

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    // Create shaders
    //
    var vertextShader = gl.createShader(gl.VERTEX_SHADER); // creates a blank vertex shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // creates a blank fragment shader

    gl.shaderSource(vertextShader, vertexShaderText); // sets the source code of the vertex shader
    gl.shaderSource(fragmentShader, fragmentShaderText); // sets the source code of the fragment shader

    gl.compileShader(vertextShader); // compiles the vertex shader
    if(!gl.getShaderParameter(vertextShader, gl.COMPILE_STATUS)) { // checks if the shader compiled successfully
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertextShader));
        return;
    }

    gl.compileShader(fragmentShader); // compiles the fragment shader
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { // checks if the shader compiled successfully
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram(); // creates a program (a combination of shaders)
    gl.attachShader(program, vertextShader); // attaches the vertex shader to the program
    gl.attachShader(program, fragmentShader); // attaches the fragment shader to the program
    gl.linkProgram(program); // links the shaders to the program
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) { // checks if the program linked successfully
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program); // validates the program (no clue why it works but it catches issues)
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) { // checks if the program validated successfully
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    // this is where thing get much hairier
    //
    var triangleVertices = // go counter clockwise
    [ // x, y       r, g, b
        0.0, 0.5,   1.0, 1.0, 0.0,
        -0.5, -0.5, 0.7, 0.0, 1.0,
        0.5, -0.5,  0.1, 1.0, 0.6
    ];

    var triangleVertexBufferObject = gl.createBuffer(); // creates a buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject); // binds the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); // puts the data into the buffer
    //                                 ^ webGL is wierd and you need to do this

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition'); // gets the location of the attribute in the program
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE, // is normalized (not relevent right now)
        5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
        0 // offset from the beginning of a single vertex to this attribute (not relevent right now)
    ); // sets the attribute pointer
    gl.vertexAttribPointer(
        colorAttribLocation, //attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // type of elements
        gl.FALSE, // is normalized (not relevent right now)
        5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute (not relevent right now)
    ); // sets the attribute pointer

    gl.enableVertexAttribArray(positionAttribLocation); // enables the attribute
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    // Main render loop
    //
    gl.useProgram(program); // uses the program
    gl.drawArrays(gl.TRIANGLES, 0, 3); // draws the triangles
}
