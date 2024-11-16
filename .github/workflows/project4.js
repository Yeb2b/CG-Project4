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
var gateTowerW = 40;
var gateTowerH = 60;

var index = 0;
var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var gateAnim = false;
var gateMov = 0;
var gateDir = 1;
var gateStep = (gateTowerH / 2) / 300;
var flagAnim = false;
var flagDir = 1;
var flagMov = 0;

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
    GenerateBuilding(vec4(1,0,0,1) );
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
    /*
    GenerateTower();
    GenerateCube(15, 3); // side and back walls
    GenerateCube(0.5, 0.5); // parapet
    GenerateCube(0.33, 0.33); // parapet gap
    GenerateCube(6, 3); // front walls
    GenerateGateTower();
    GenerateCube(1.1 * gateTowerW / 15, 0.1 * gateTowerH / 15); // top of gate tower
    GenerateCube(0.33, 0.33);
    GenerateCube(0.33, 0.16);
    GenerateCube(1, 1); // portcullis bars
    GenerateBuilding();
    GenerateFlag();
    */
    SendData();
    
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

function altQuad(a, b, c, d)
{
    points.push(a);
    points.push(b);
    points.push(c);
    points.push(a);
    points.push(c);
    points.push(d);

    var rx = gateTowerW/15;
    var ry = gateTowerH/15;
    textureCoordsArray.push(vec2(rx * a[0], ry * a[1]));
    textureCoordsArray.push(vec2(rx * b[0], ry * b[1]));
    textureCoordsArray.push(vec2(rx * c[0], ry * c[1]));
    textureCoordsArray.push(vec2(rx * a[0], ry * a[1]));
    textureCoordsArray.push(vec2(rx * c[0], ry * c[1]));
    textureCoordsArray.push(vec2(rx * d[0], ry * d[1]));

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

function GenerateTower()
{
    var tower = [
        vec4(0, -0.5, 0, 1),
        vec4(0.25, -0.5, 0, 1),
        vec4(0.25, 0.25, 0, 1),
        vec4(0.30, 0.25, 0, 1),
        vec4(0, 0.5, 0, 1)
    ];
    var slices = 100;
    var prev1, prev2;
    var curr1, curr2;
    var offset = 0;

    for (var i = 0; i < 4; i++)
    {
        prev1 = tower[i];
        prev2 = tower[i+1];
        var r = rotate(360 / slices, 0, 1, 0);
        for (var j = 1; j <= slices; j++)
        {
            curr1 = multiply(r, prev1);
            curr2 = multiply(r, prev2);
            quad(prev1, prev2, curr2, curr1, offset, 0, 0.05, 3);
            prev1 = curr1;
            prev2 = curr2;
            offset += 0.05;
        }
    }
}

function GenerateGateTower()
{
    var GateTower = [
        vec4(-0.25, -0.5, 0.5, 1),
        vec4(-0.5, -0.5, 0.5, 1),
        vec4(-0.5, 0.5, 0.5, 1),
        vec4(0.5, 0.5, 0.5, 1),
        vec4(0.5, -0.5, 0.5, 1),
        vec4(0.25, -0.5, 0.5, 1)
    ];
    var slices = 45;
    var length;
    var step = Math.PI / slices;
    for (var i = 0; i <= slices; i++)
        GateTower.push(vec4(0.25*Math.cos(i*step), 0.25*Math.sin(i*step) - 0.25, 0.5, 1));
    var numPoints = GateTower.length;
    for (i = 0; i < numPoints; i++)
        GateTower.push(vec4(GateTower[i][0], GateTower[i][1], GateTower[i][2] - 1));
    for (i = 0; i < numPoints - 1 ; i++)
    {
        length = Math.sqrt(Math.pow(GateTower[i+1][0] - GateTower[i][0], 2) +
            Math.pow(GateTower[i+1][1] - GateTower[i][1], 2));
        quad(GateTower[i], GateTower[i + 1], GateTower[i + 1 + numPoints], GateTower[i + numPoints],
            0, 0, gateTowerW/15, 4 * length);
    }
    quad(GateTower[51], GateTower[0], GateTower[52], GateTower[103], 0, 0, gateTowerW/15, 1);

    altQuad(GateTower[2], GateTower[1], GateTower[0], GateTower[51]);
    for (i = 51; i > 29; i -= 2)
        altQuad(GateTower[2], GateTower[i], GateTower[i-1], GateTower[i-2]);
    altQuad(GateTower[2], GateTower[29], GateTower[28], GateTower[3]);
    for (i = 28; i > 6; i -= 2)
        altQuad(GateTower[3], GateTower[i], GateTower[i-1], GateTower[i-2]);
    altQuad(GateTower[3], GateTower[6], GateTower[5], GateTower[4]);
}

function GenerateBuilding(color)
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

function GenerateFlag()
{
    var Flag = [
        vec4(-0.05, 0.5, 0.05, 1),
        vec4(-0.05, -0.5, 0.05, 1),
        vec4(0.05, -0.5, 0.05, 1),
        vec4(0.05, 0.3, 0.05, 1),
        vec4(0.5, 0.4, 0.05, 1),
        vec4(0.05, 0.5, 0.05, 1)
    ];
    for (var i = 0; i < 6; i++)
        Flag.push(vec4(Flag[i][0], Flag[i][1], -0.05, 1));
    for (i = 0; i < 5; i++)
        quad(Flag[i+6], Flag[i+7], Flag[i+1], Flag[i], 0, 0, 1, 1);
    quad(Flag[11], Flag[6], Flag[0], Flag[5]);
    quad(Flag[0], Flag[1], Flag[2], Flag[5], 0, 0, 1, 1);
    quad(Flag[11], Flag[8], Flag[7], Flag[6], 0, 0, 1, 1);
    triangle(Flag[3], Flag[4], Flag[5]);
    triangle(Flag[11], Flag[10], Flag[9]);
}

function SendData()
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
    DrawBuilding(100, 80, 120, 0, 0,-80);
    //DrawBuilding(72, 80, 60, 0, 0, 70);
    //DrawTower(10, 80, 40, 40);
    //drawCone();
    //drawCylinder();
    DrawCar();
    drawFlag();
    //DrawBuilding();
    //DrawSolidSphere(10);
    /*
    DrawTower(20, 60, castleW, castleW);
    DrawTower(20, 60, castleW, -castleW);
    DrawTower(20, 60, -castleW, castleW);
    DrawTower(20, 60, -castleW, -castleW);

    DrawWall(38, 10, 2*castleW, 0, 0, 0);
    DrawWall(38, 10, 2*castleW, 1, 0, 0);
    DrawWall(38, 10, 2*castleW, 2, 0, 0);

    var frontL = castleW - gateTowerW/2;
    DrawWall(38, 10, frontL, -1, castleW - frontL/2, 108);
    DrawWall(38, 10, frontL, -1, -(castleW - frontL/2), 108);
    DrawGateTower(gateTowerW, gateTowerH);

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
function DrawTower(d, h, x, z)
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(1, 1, 1, 1);
    lightSpecular = vec4(1, 1, 1, 1);
    materialAmbient = vec4(0.2, 0.2, 0.2, 1);
    materialDiffuse = vec4(0.4, 0.4, 0.4, 1);
    materialSpecular = vec4(0.6, 0.6, 0.6, 1);
    materialShininess = 9;
    //SetupLightingMaterial();

    modelViewStack.push(modelViewMatrix);
    var s = scale4(2*d, h, 2*d);
    var t = translate(x, h/2, z);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();

    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays(gl.TRIANGLES, 36, 1800); //cylinder
    //gl.uniform1i(gl.getUniformLocation(program, "texture"), 2);
    gl.drawArrays(gl.TRIANGLES, 1836, 600); //cone
}

function DrawWall(h, w, l, turns, z, offset)
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(1, 1, 1, 1);
    lightSpecular = vec4(1, 1, 1, 1);
    materialAmbient = vec4(0.2, 0.2, 0.2, 1);
    materialDiffuse = vec4(0.4, 0.4, 0.4, 1);
    materialSpecular = vec4(0.6, 0.6, 0.6, 1);
    materialShininess = 9;
    SetupLightingMaterial();

    modelViewStack.push(modelViewMatrix);
    var s = scale4(w, h, l);
    var r = rotate(turns * 90, 0, 1, 0);
    var t = translate(castleW, h/2, z);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, r), t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    gl.drawArrays(gl.TRIANGLES, 2436 + offset, 36);

    var parapetH = 5;
    var parapetLowH = 3;
    var parapetW = 1;
    var parapetL = 10;
    var parapetGapL = 4;
    for (var i = 0; i < l/parapetL; i++)
    {
        modelViewStack.push(modelViewMatrix);
        s = scale4(parapetW, parapetH, parapetL - parapetGapL);
        t = translate(castleW + w/2 - parapetW/2, h + parapetH/2,
            z - l/2 + (parapetL - parapetGapL)/2 + i*parapetL);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, r), t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        modelViewMatrix = modelViewStack.pop();
        gl.drawArrays(gl.TRIANGLES, 2472, 36);

        modelViewStack.push(modelViewMatrix);
        s = scale4(parapetW, parapetLowH, parapetGapL);
        t = translate(castleW + w/2 - parapetW/2, h + parapetLowH/2,
            z - l/2 + parapetL - parapetGapL/2 + i*parapetL);
        modelViewMatrix = mult(mult(mult(modelViewMatrix, r), t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        modelViewMatrix = modelViewStack.pop();
        gl.drawArrays(gl.TRIANGLES, 2508, 36);
    }
}

function DrawGateTower(w, h)
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(1, 1, 1, 1);
    lightSpecular = vec4(1, 1, 1, 1);
    materialAmbient = vec4(0.2, 0.2, 0.2, 1);
    materialDiffuse = vec4(0.4, 0.4, 0.4, 1);
    materialSpecular = vec4(0.6, 0.6, 0.6, 1);
    materialShininess = 9;
    SetupLightingMaterial();

    modelViewStack.push(modelViewMatrix);
    var s = scale4(w, h, w);
    var t1 = translate(0, h/2, castleW);
    modelViewMatrix = mult(mult(modelViewMatrix, t1), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 2580, 462);

    modelViewStack.push(modelViewMatrix);
    var r = rotate(180, 0, 1, 0);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t1), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 2892, 150);

    modelViewStack.push(modelViewMatrix);
    s = scale4(1.1 * w, 0.1 * h, 1.1 * w);
    t1 = translate(0, 1.05*h, castleW);
    modelViewMatrix = mult(mult(modelViewMatrix, t1), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 3042, 36);

    var t2;
    for (var i = 0; i < 4; i++)
    {
        r = rotate(i * 90, 0, 1, 0);
        for (var j = 0; j <5; j++)
        {
            modelViewStack.push(modelViewMatrix);
            s = scale4(w/10 , h/10, w/10);
            t1 = translate(w/2, 0, -w/2 + j * w/5);
            t2 = translate(0, 1.15 * h, castleW);
            modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, t2), r), t1), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            modelViewMatrix = modelViewStack.pop();
            gl.drawArrays(gl.TRIANGLES, 3078, 36);

            modelViewStack.push(modelViewMatrix);
            s = scale4(w/10, h/20, w/10);
            t1 = translate(w/2, 0, -0.4 * w + j * w/5);
            t2 = translate(0, 1.125 * h, castleW);
            modelViewMatrix = mult(mult(mult(mult(modelViewMatrix, t2), r), t1), s);
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
            modelViewMatrix = modelViewStack.pop();
            gl.drawArrays(gl.TRIANGLES, 3114, 36);
        }
    }
}

function DrawPortcullis(w, h)
{
    lightAmbient = vec4(0.1, 0.1, 0.1, 1);
    lightDiffuse = vec4(0.4, 0.4, 0.4, 1);
    lightSpecular = vec4(0.2, 0.2, 0.2, 1);
    materialAmbient = vec4(0.2, 0.2, 0.2, 1);
    materialDiffuse = vec4(0.4, 0.4, 0.4, 1);
    materialSpecular = vec4(1, 1, 1, 1);
    materialShininess = 9;
    SetupLightingMaterial();
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);

    var s = scale4(w/30, h, w/60);
    for (var i = 1; i < 10; i++)
    {
        modelViewStack.push(modelViewMatrix);
        var t = translate(-w/2 + i * w/10, h/2 + gateMov*gateStep, castleW);
        modelViewMatrix = mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        modelViewMatrix = modelViewStack.pop();
        gl.drawArrays(gl.TRIANGLES, 3150, 36);
    }
    s = scale4(w, w/30, w/60);
    for (i = 1; i < 12; i++)
    {
        modelViewStack.push(modelViewMatrix);
        t = translate(0, i * h/12 + gateMov*gateStep, castleW);
        modelViewMatrix = mult(mult(modelViewMatrix, t), s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        modelViewMatrix = modelViewStack.pop();
        gl.drawArrays(gl.TRIANGLES, 3150, 36);
    }
}

function DrawBuilding(h, w, l, x, y, z)
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

function DrawBanner()
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(1, 1, 1, 1);
    lightSpecular = vec4(1, 1, 1, 1);
    materialAmbient = vec4(0.2, 0.2, 0.2, 1);
    materialDiffuse = vec4(0.4, 0.4, 0.4, 1);
    materialSpecular = vec4(0.6, 0.6, 0.6, 1);
    materialShininess = 9;
    SetupLightingMaterial();

    modelViewStack.push(modelViewMatrix);
    var s = scale4(gateTowerW/2, gateTowerW/2, 0.5);
    var t = translate(0, 0.8 * gateTowerH, castleW + gateTowerW/2 + 0.25);
    modelViewMatrix = mult(mult(modelViewMatrix, t), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.drawArrays(gl.TRIANGLES, 3156, 30);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4);
    gl.drawArrays(gl.TRIANGLES, 3150, 6);
}

function DrawFlag(x, z)
{
    lightAmbient = vec4(0.4, 0.4, 0.4, 1);
    lightDiffuse = vec4(1, 1, 1, 1);
    lightSpecular = vec4(1, 1, 1, 1);
    materialAmbient = vec4(0.2, 0.2, 0.2, 1);
    materialDiffuse = vec4(0.4, 0.4, 0.4, 1);
    materialSpecular = vec4(0.6, 0.6, 0.6, 1);
    materialShininess = 9;
    SetupLightingMaterial();

    modelViewStack.push(modelViewMatrix);
    var s = scale4(20, 40, 20);
    var r = rotate(90 + flagMov, 0, 1, 0);
    var t = translate(x, 60, z);
    modelViewMatrix = mult(mult(mult(modelViewMatrix, t), r), s);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    modelViewMatrix = modelViewStack.pop();
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    gl.drawArrays(gl.TRIANGLES, 3234, 48);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
    gl.drawArrays(gl.TRIANGLES, 3282, 6);
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
    var s = scale4(50,20,20);
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
