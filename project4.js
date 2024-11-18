var gl, program;

var points = [];
var colors = [];
var normals = [];
var textureCoordsArray = [];

var textures = [];
var sounds = [];

var modelViewMatrix;
var projectionMatrixLoc;
var modelViewMatrixLoc;
var modelViewStack = [];

var r = 20;
var zoom = 150;
var lr = 120;
var ud = 30;

var lightPosition = vec4(0.5, 0.5, 0.5, 0);
var lightAmbient, lightDiffuse, lightSpecular;
var materialAmbient, materialDiffuse, materialSpecular;
var materialShininess;

var castleW = 110;


var index = 0;
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);


var y_max =10;
var y_min = -10;
var x_max = 16;
var x_min = -16;
var near = -150;
var far = 150;
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 25,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 30/180 * Math.PI,
    theta : 120/180 * Math.PI,
    radius : 20,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

function main()
{
    gl = WebGLUtils.setupWebGL(document.getElementById("gl-canvas"));
    gl.enable(gl.DEPTH_TEST);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
   
    GenerateCube(8,8,vec4(0,1,0,1)); //+36
    GenerateCylinder(20,100,100, vec4(0,0,0,1)); //+1,200
    GenerateCar(8,8,vec4(0.0, 0.0, 0.8, 1.0)); //+36
    GenerateCar(8,8,vec4(0.0, 0.0, 0.6, 1.0)); //+36
    GenerateCylinder(20,100,100, vec4(0,0,0,1)); //+1,200
    GenerateCube(8,8,vec4(0,0,0,1)); //+36
    GenerateCone(vec4(0,0,0,1)) //+600
    console.log(points.length);
    console.log(colors.length);
    tetrahedron(va, vb, vc, vd, 3,vec4(0,0,0,1) ); //+12,288
    console.log(points.length);
    console.log(colors.length);
    GenerateHouse(vec4(1,0,0,1) );

    GenerateCylinder(20,100,100, vec4(1,0,1,1)); //+1200
    GenerateCube(8,8,vec4(0,0,1,1)); //+36

    //GenerateCube(8, 8,vec4(1,0,0,1)) ; //600-636 +36
    //tetrahedron(va, vb, vc, vd, 5); //+12,288
    /*
    GenerateCone(); //0-600 +600
    console.log(points.length);
    GenerateCube(8, 8); //600-636 +36
    console.log(points.length);
    GenerateCylinder(20,100,100);//636-1836 +1,200
    console.log(points.length);
    GenerateBuilding();//1838-1884 +46
    console.log(points.length);
    */
    //tetrahedron(va, vb, vc, vd, 5); //+12,288
    //console.log(points.length);
    /*
    GenerateCone(); //0-600
    console.log(points.length);
    GenerateCube(8, 8); //600-636
    console.log(points.length);
    GenerateCylinder(20,100,100);//636-1836
    console.log(points.length);
    GenerateBuilding();//1838-1884
    console.log(points.length);
    */
    init();
    
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    /*
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(1.0, AllInfo.zoomFactor - 1.0);
        } else {
            AllInfo.zoomFactor += 1.0;
        }
        render();
    });

    //************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in AllInfo. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            
            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
            //AllInfo.translateY = Math.max(AllInfo.translateY, 1);
        } else if (AllInfo.mouseDownLeft) {
            var test = AllInfo.theta
            console.log(test);
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;
            
            
            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
            /*
            if(AllInfo.theta<1.6){
            AllInfo.theta = Math.max(AllInfo.theta, .5);
            }
            else{
                AllInfo.theta = Math.min(AllInfo.theta, 1.6);
            }   
            
        }
        render();
    });
    */
    //openNewTexture("brick.jpg");
    openNewTexture("grass.png");
   //openNewTexture("shingles.jpg");
    //openNewTexture("metal.jpg");
    //openNewTexture("banner.jpg");
    //openNewTexture("flag.jpg");

    //sounds.push(new Audio("door.mp3"));
    
    window.onkeydown = function(event)
    {
        switch(event.keyCode)
        {
            case 37:
                lr += 18;
                break;
            case 38:
                if (ud < 81)
                    ud += 9;
                break;
            case 39:
                lr -= 18;
                break;
            case 40:
                if (ud > 9)
                    ud -= 9;
                break;
            case 65:
                if (gateAnim) { sounds[0].pause(); }
                else { sounds[0].play(); }
                gateAnim = !gateAnim;
                flagAnim = true;
                break;
            case 66:
                gateAnim = false;
                flagAnim = false;
                sounds[0].pause();
                sounds[0].currentTime = 0;
                gateMov = 0;
                gateDir = 1;
                flagMov = 0;
                flagDir = 1;
                lr = 120;
                ud = 30;
        }
    };
    
    render();
}

function GenerateCube(rx, ry, color)
{
    var cube = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];
    quad(cube[1], cube[0], cube[3], cube[2], 0, 0, rx, ry, color); // front
    quad(cube[2], cube[3], cube[7], cube[6], 0, 0, rx, ry, color); // right
    quad(cube[3], cube[0], cube[4], cube[7], 0, 0, rx, ry, color); // bottom
    quad(cube[6], cube[5], cube[1], cube[2], 0, 0, rx, ry, color); // top
    quad(cube[4], cube[5], cube[6], cube[7], 0, 0, rx, ry, color); // back
    quad(cube[5], cube[4], cube[0], cube[1], 0, 0, rx, ry, color); // left
}
function GenerateCar(rx,ry,color){
    var cube = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.3, -0.5, -0.3, 1.0),   // Adjusted top-front-left
        vec4(-0.3, 0.5, -0.3, 1.0),    // Adjusted top-front-right
        vec4(0.3, 0.5, -0.3, 1.0),  // Adjusted top-back-left
        vec4(0.3, -0.5, -0.3, 1.0)   
    ];
    quad(cube[1], cube[0], cube[3], cube[2], 0, 0, rx, ry, color); // front
    quad(cube[2], cube[3], cube[7], cube[6], 0, 0, rx, ry, color); // right
    quad(cube[3], cube[0], cube[4], cube[7], 0, 0, rx, ry, color); // bottom
    quad(cube[6], cube[5], cube[1], cube[2], 0, 0, rx, ry, color); // top
    quad(cube[4], cube[5], cube[6], cube[7], 0, 0, rx, ry, color); // back
    quad(cube[5], cube[4], cube[0], cube[1], 0, 0, rx, ry, color); // left
}
function GenerateCone(color) {
    // Define the base circle radius and apex point
    var radius = 0.5;
    var height = 1.0;
    var slices = 100;  // Number of slices for the cone base
    var baseCenter = vec4(0, -0.5, 0, 1);  // Center of the base circle
    var apex = vec4(0, height - 0.5, 0, 1); // Apex of the cone

    // Initialize base vertices
    var baseVertices = [];
    var angleStep = 360 / slices;

    // Create vertices around the base
    for (var i = 0; i < slices; i++) {
        var angle = radians(i * angleStep);
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);
        baseVertices.push(vec4(x, baseCenter[1], z, 1.0));
    }

    // Create triangles between the base and the apex
    for (var i = 0; i < slices; i++) {
        var nextIndex = (i + 1) % slices;  // Loop back to the start after the last vertex
        var v1 = baseVertices[i];
        var v2 = baseVertices[nextIndex];

        // Connect each base segment to the apex
        triangle(v1, v2, apex, color);
    }

    // Optionally, draw the base of the cone
    for (var i = 0; i < slices; i++) {
        var nextIndex = (i + 1) % slices;
        triangle(baseCenter, baseVertices[i], baseVertices[nextIndex],color);
    }
}
function GenerateCylinder(radius, height, slices, color) {
    var baseCenter = vec4(0, 0, 0, 1);       // Center of the base circle
    var topCenter = vec4(0, height, 0, 1);   // Center of the top circle
    var baseVertices = [];
    var topVertices = [];
    var angleStep = 360 / slices;

    // Generate vertices for the base and top circles
    for (var i = 0; i < slices; i++) {
        var angle = radians(i * angleStep);
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);
        
        // Bottom circle vertices
        baseVertices.push(vec4(x, 0, z, 1));
        
        // Top circle vertices (extruded upwards by 'height')
        topVertices.push(vec4(x, height, z, 1));
    }

    // Generate side faces by connecting base and top vertices
    for (var i = 0; i < slices; i++) {
        var nextIndex = (i + 1) % slices;  // Wrap around for the last face

        var base1 = baseVertices[i];
        var base2 = baseVertices[nextIndex];
        var top1 = topVertices[i];
        var top2 = topVertices[nextIndex];

        // Create quad for each side face of the cylinder
        quad(base1, base2, top2, top1, 0,0,0,0,color);
    }

    // Generate the base and top faces of the cylinder
    for (var i = 0; i < slices; i++) {
        var nextIndex = (i + 1) % slices;

        // Connect each base vertex to the center to form triangles
        triangle(baseCenter, baseVertices[i], baseVertices[nextIndex], color);

        // Connect each top vertex to the center to form triangles
        triangle(topCenter, topVertices[nextIndex], topVertices[i], color);
    }
}

function quad(a, b, c, d, ox, oy, rx, ry, color)
{
    points.push(a);
    points.push(b);
    points.push(c);
    points.push(a);
    points.push(c);
    points.push(d);

    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    textureCoordsArray.push(vec2(ox, oy));
    textureCoordsArray.push(vec2(ox, ry));
    textureCoordsArray.push(vec2(rx, ry));
    textureCoordsArray.push(vec2(ox, oy));
    textureCoordsArray.push(vec2(rx, ry));
    textureCoordsArray.push(vec2(rx, oy));

    var t1 = subtract(b, a);
    var t2 = subtract(d, a);
    var normal = normalize(vec3(cross(t1, t2)));
    for (var i = 0; i < 6; i++)
        normals.push(normal);
}

function triangle(a, b, c,color)
{
    points.push(a);
    points.push(b);
    points.push(c);

    colors.push(color);
    colors.push(color);
    colors.push(color);
    textureCoordsArray.push(vec2(0, 0));
    textureCoordsArray.push(vec2(0, 1));
    textureCoordsArray.push(vec2(1, 1));

    var t1 = subtract(b, a);
    var t2 = subtract(c, b);
    var normal = normalize(vec3(cross(t1, t2)));
    for (var i = 0; i < 3; i++)
        normals.push(normal);
}
function sphereTriangle(a,b,c,color){
    points.push(a);
    points.push(b);
    points.push(c);

    colors.push(color);
    colors.push(color);
    colors.push(color);

    textureCoordsArray.push(vec2(0, 0));
    textureCoordsArray.push(vec2(0, 1));
    textureCoordsArray.push(vec2(1, 1));
    var t1 = subtract(b, a);
    var t2 = subtract(c, b);
    var normal = normalize(vec3(cross(t1, t2)));
    for (var i = 0; i < 3; i++)
        normals.push(normal);
    index +=3;
}
function divideTriangle(a, b, c, count, color) {
    if ( count > 0 ) {
                
        var ab = normalize(mix( a, b, 0.5), true);
        var ac = normalize(mix( a, c, 0.5), true);
        var bc = normalize(mix( b, c, 0.5), true);
                                
        divideTriangle( a, ab, ac, count - 1 ,color);
        divideTriangle( ab, b, bc, count - 1,color );
        divideTriangle( bc, c, ac, count - 1,color );
        divideTriangle( ab, bc, ac, count - 1 , color);
    }
    else { // draw tetrahedron at end of recursion
        sphereTriangle( a, b, c, color);
    }
}
function tetrahedron(a, b, c, d, n, color) {
    divideTriangle(a, b, c, n, color);
    divideTriangle(d, c, b, n, color);
    divideTriangle(a, d, b, n, color);
    divideTriangle(a, c, d, n, color);
}
function pentagon(a, b, c, d, e, color)
{
    points.push(a);
    points.push(b);
    points.push(c);
    points.push(a);
    points.push(c);
    points.push(d);
    points.push(a);
    points.push(d);
    points.push(e);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    colors.push(color);
    var rx = 100/15;
    var ry = 80/15;
    textureCoordsArray.push(vec2(rx * a[0], ry * a[1]));
    textureCoordsArray.push(vec2(rx * b[0], ry * b[1]));
    textureCoordsArray.push(vec2(rx * c[0], ry * c[1]));
    textureCoordsArray.push(vec2(rx * a[0], ry * a[1]));
    textureCoordsArray.push(vec2(rx * c[0], ry * c[1]));
    textureCoordsArray.push(vec2(rx * d[0], ry * d[1]));
    textureCoordsArray.push(vec2(rx * a[0], ry * a[1]));
    textureCoordsArray.push(vec2(rx * d[0], ry * d[1]));
    textureCoordsArray.push(vec2(rx * e[0], ry * e[1]));

    var t1 = subtract(b, a);
    var t2 = subtract(d, a);
    var normal = normalize(vec3(cross(t1, t2)));
    for (var i = 0; i < 9; i++)
        normals.push(normal);
}

function GenerateHouse(color)
{
    var Building = [
        vec4(0, 0.5, 0.5, 1),
        vec4(-0.5, 0.1, 0.5, 1),
        vec4(-0.5, -0.5, 0.5, 1),
        vec4(0.5, -0.5, 0.5, 1),
        vec4(0.5, 0.1, 0.5, 1),
        vec4(0, 0.5, -0.5, 1),
        vec4(-0.5, 0.1, -0.5, 1),
        vec4(-0.5, -0.5, -0.5, 1),
        vec4(0.5, -0.5, -0.5, 1),
        vec4(0.5, 0.1, -0.5, 1)
    ];
    quad(Building[0], Building[4], Building[9], Building[5], 0, 0, 2, 2, color); // right roof
    quad(Building[5], Building[6], Building[1], Building[0], 0, 0, 2, 2, color); // left roof
    quad(Building[4], Building[3], Building[8], Building[9], 0, 0, 8, 4,color); // right side
    quad(Building[6], Building[7], Building[2], Building[1], 0, 0, 8, 4,color); // left side
    quad(Building[3], Building[2], Building[7], Building[8], 0, 0, 1, 1,color); // bottom
    pentagon(Building[0], Building[1], Building[2], Building[3], Building[4],color); // front face
    pentagon(Building[5], Building[6], Building[7], Building[8], Building[9],color); // back face
}

function init()
{
    /*
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    /*
    var vTextureCoord = gl.getAttribLocation(program, "vTextureCoord");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoordsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vTextureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTextureCoord);
  */
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
}

function SetupLightingMaterial()
{
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

function openNewTexture(picName)
{
    var i = textures.length;
    textures[i] = gl.createTexture();
    textures[i].image = new Image();
    textures[i].image.src = picName;
    textures[i].image.onload = function() { loadNewTexture(i); }
}

function loadNewTexture(index)
{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, textures[index]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textures[index].image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);
var eye = vec3(2, 2, 2);

var eyeX=2, eyeY=3, eyeZ=3; // default eye position input values
function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clearColor(0.28, 0.5, 0.7, 1.0);
    var projectionMatrix = ortho(-zoom, zoom, -zoom, zoom, -1000, 1000);
   /*
   projectionMatrix = ortho( x_min*AllInfo.zoomFactor - AllInfo.translateX,
    x_max*AllInfo.zoomFactor - AllInfo.translateX,
    y_min*AllInfo.zoomFactor - AllInfo.translateY,
    y_max*AllInfo.zoomFactor - AllInfo.translateY,
    near, far);
    */
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    
    var eye = vec3(
        r * Math.cos(ud/180 * Math.PI) * Math.cos(lr/180 * Math.PI),
        r * Math.sin(ud/180 * Math.PI),
        r * Math.cos(ud/180 * Math.PI) * Math.sin(lr/180 * Math.PI)
    );
    modelViewMatrix = lookAt(eye, [0, 0, 0], [0, 1, 0]);
    /*
    eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi)*Math.sin(AllInfo.theta),
    AllInfo.radius*Math.sin(AllInfo.phi)*Math.sin(AllInfo.theta),
    AllInfo.radius*Math.cos(AllInfo.theta));
    modelViewMatrix = lookAt(eye, at, up);
    */
    gl.disable(gl.DEPTH_TEST); 
    //DrawSky();
    gl.enable(gl.DEPTH_TEST); 
    DrawGround();
    //drawCylinder();
    DrawHouse(100, 80, 120, 0, 0,-80);
    DrawStairsAndPorch();
    //DrawBuilding(72, 80, 60, 0, 0, 70);
    //DrawTower(10, 80, 40, 40);
    //drawCone();
    //drawCylinder();
    DrawCar();
    drawFlag();
    //DrawBuilding();
    //DrawSolidSphere(10);
    /*
    if (gateAnim) {
        if (gateMov < 0 || gateMov > 210) {
            gateDir *= -1;
            gateMov += gateDir;
            gateAnim = !gateAnim;
            sounds[0].pause();
            sounds[0].currentTime = 0;
        }
        else { gateMov += gateDir; }
    }
    DrawPortcullis(gateTowerW/2, gateTowerH/2);
    DrawBuilding(100, 80, 120, 0, 0, -20);
    DrawBuilding(80, 64, 128, 0, 0, -20);
    DrawTower(10, 80, 40, 40);
    DrawTower(20, 120, 40, -20);
    DrawTower(10, 80, 40, -80);
    DrawTower(10, 80, -40, 40);
    DrawTower(20, 140, -40, -20);
    DrawTower(10, 80, -40, -80);
    DrawBanner();

    if (flagAnim) {
        if (flagMov > 20 || flagMov < -20) {
            flagDir *= -1;
            flagMov += flagDir * 5;
        }
        else { flagMov += flagDir * 5; }
    }
    DrawFlag(castleW, castleW);
    DrawFlag(castleW, -castleW);
    DrawFlag(-castleW, castleW);
    DrawFlag(-castleW, -castleW);
    */
    requestAnimFrame(render);
}

function DrawGround()
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(0.2, 0.2, 0.2, 1);
    lightSpecular = vec4(0.2, 0.2, 0.2, 1);
    materialAmbient = vec4(0, 1, 0, 1);
    materialDiffuse = vec4(0, 1, 0, 1);
    materialSpecular = vec4(0, 1, 0, 1);
    materialShininess = 6;
    //SetupLightingMaterial();
    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    modelViewStack.push(modelViewMatrix);
    var s = scale4(10*castleW, 0.1, 10*castleW);
    var t = translate(0, 0, 0);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function DrawSky(){
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(0.2, 0.2, 0.2, 1);
    lightSpecular = vec4(0.2, 0.2, 0.2, 1);
    materialAmbient = vec4(0, 1, 0, 1);
    materialDiffuse = vec4(0, 1, 0, 1);
    materialSpecular = vec4(0, 1, 0, 1);
    materialShininess = 6;
    //SetupLightingMaterial();
    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    modelViewStack.push(modelViewMatrix);
    var s = scale4(.1, 10*castleW, 10*castleW);
    var t = translate(0, 1, 0);
    var r = rotate(90,0,0,1);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, r),t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 36, 72);
}

function DrawHouse(h, w, l, x, y, z)
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(1, 1, 1, 1);
    lightSpecular = vec4(1, 1, 1, 1);
    materialAmbient = vec4(0.6, 0.6, 0.6, 1);
    materialDiffuse = vec4(0.6, 0.6, 0.6, 1);
    materialSpecular = vec4(0.6, 0.6, 0.6, 1);
    materialShininess = 9;
    //SetupLightingMaterial();

    modelViewStack.push(modelViewMatrix);
    var s = scale4(w, h, l);
    var t = translate(x, h/2 + y, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();

    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays(gl.TRIANGLES, 3912, 12);
   // gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays(gl.TRIANGLES, 3924, 36);
}

function scale4(a, b, c)
{
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function multiply(m, v)
{
    return vec4(
        m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2] + m[0][3]*v[3],
        m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2] + m[1][3]*v[3],
        m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2] + m[2][3]*v[3],
        m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2] + m[3][3]*v[3]
    );
}

function drawCone(){
    modelViewStack.push(modelViewMatrix);
    var s = scale4(20, 20, 20);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, index, 600);
}

function drawCylinder(){
    modelViewStack.push(modelViewMatrix);
    var s = scale4(1, 1, 1);
    var t = translate(0,0,0)
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 36, 1200);
}
function drawCube(){
    modelViewStack.push(modelViewMatrix);
    //var s = scale4(100,50,100);
    //modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 1236, 36);
    modelViewMatrix = modelViewStack.pop();
}
function drawFlag(){
    modelViewStack.push(modelViewMatrix);
    var s = scale4(1/10, 1, 1/10);
    var t = translate(-120,0,250)
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 1308, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(1/10, 1, 1/10);
    var t = translate(-120,0,250)
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 1308, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(1/10, 1, 1/10);
    var t = translate(-120,0,250)
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 1308, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(50, 30, 0);
    var t = translate(-145,85,250);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2508, 36);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(4.0, 9, 4.0);
    var t = translate(-120,104,250);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    //modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 2544, 600);
    modelViewMatrix = modelViewStack.pop();
    var radius = 1;
    gl.enable(gl.DEPTH_TEST);
	modelViewStack.push(modelViewMatrix);
	var s=scale4(radius, radius, radius);   // scale to the given radius
    var t = translate(-120,109,250);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

 	// draw unit radius sphere
        for(var i=0; i<index; i+=3){
            gl.drawArrays( gl.TRIANGLES, i+3144, 3 );
        }
	modelViewMatrix=modelViewStack.pop();
	gl.disable(gl.DEPTH_TEST);
}

function DrawSolidSphere(radius)
{
    gl.enable(gl.DEPTH_TEST);
	modelViewStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

 	// draw unit radius sphere
        for(var i=0; i<index; i+=3){
            gl.drawArrays( gl.TRIANGLES, i+36, 3 );
        }
	modelViewMatrix=modelViewStack.pop();
	gl.disable(gl.DEPTH_TEST);
}
function DrawCar(){
    modelViewStack.push(modelViewMatrix);
    var r= rotate(90,1,0,0);
    var t = translate(0,30,-15);
    var s = scale4(50,18,20);
    modelViewMatrix = mult(modelViewMatrix,r);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 1236, 36);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var r= rotate(90,1,0,0);
    var t = translate(0,30,-10);
    var s = scale4(75,20,10);
    modelViewMatrix = mult(modelViewMatrix,r);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 1272, 36);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var r= rotate(90,1,0,0);
    var t = translate(15,22,-5);
    var s = scale4(1/4,1/30,1/5);
    modelViewMatrix = mult(modelViewMatrix,r);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var r= rotate(90,1,0,0);
    var t = translate(15,36,-5);
    var s = scale4(1/4,1/30,1/5);
    modelViewMatrix = mult(modelViewMatrix,r);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var r= rotate(90,1,0,0);
    var t = translate(-20,22,-5);
    var s = scale4(1/4,1/30,1/5);
    modelViewMatrix = mult(modelViewMatrix,r);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var r= rotate(90,1,0,0);
    var t = translate(-20,36,-5);
    var s = scale4(1/4,1/30,1/5);
    modelViewMatrix = mult(modelViewMatrix,r);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 36, 1200);
    modelViewMatrix = modelViewStack.pop();


}
function DrawStairsAndPorch(){
    modelViewStack.push(modelViewMatrix);
    var t = translate(-20,0,-40);
    var s = scale4(1,1/2,1);
    modelViewMatrix = mult(modelViewMatrix,t);
    modelViewMatrix = mult(modelViewMatrix,s);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 3960, 1200);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(35, 10, 30);
    var t = translate(-60,0,-80);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 5160, 36);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(25, 10, 30);
    var t = translate(-60,5,-80);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 5160, 36);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(15, 10, 30);
    var t = translate(-60,10,-80);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 5160, 36);
    modelViewMatrix = modelViewStack.pop();
    modelViewStack.push(modelViewMatrix);
    var s = scale4(10, 10, 30);
    var t = translate(-55,15,-80);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 5160, 36);
    modelViewMatrix = modelViewStack.pop();
}