const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

var dotSize = 10;
var defaultDist = 100;
var explodeDist = 400;
var implodeDist = 100;
var minDist = defaultDist;
var dotDist = 15;
var returnDist = 1000;

var defaultReturnValue = 0.01;
var implodeReturnValue = 0.2;
var explodeReturnValue = 0.005;
var returnValue = defaultReturnValue;

var pushFloor = 0.7;

var mouseMultiplier = 10;
var spacingMultiplier = 1.2;

var dots = [];

var doReturn = true;
var doDotRepel = false;

var ignoreMouse = false;

var colorMode = 'green';

var dotColor = "#ffffff";

var mouse = {
    x : -1000,
    y : -1000
};

function toggleMouse() {
    ignoreMouse = !ignoreMouse;
}

document.addEventListener('keypress', (event) => {
    if(event.key == 'i' || event.key == 'I') {
        toggleMouse();
    }
})

function handleMouseMove(x, y) {
    mouse.x = x;
    mouse.y = y;

    if(
        x <= 5 ||
        x >= window.innerWidth - 5 ||
        y <= 5 ||
        y >= window.innerHeight - 5
    ) {
        mouse.x = -1000;
        mouse.y = -1000;
    }
    else {
        mouse.x = x;
        mouse.y = y;
    }
}

function explode() {
    returnValue = explodeReturnValue;
    minDist = explodeDist;
}
function implode() {
    returnValue = implodeReturnValue;
    minDist = implodeDist;
}
function replode() {
    returnValue = defaultReturnValue;
    minDist = defaultDist;
}

function updateMouse(event) {
    handleMouseMove(event.clientX, event.clientY);
}

document.addEventListener('mousemove', updateMouse);

document.addEventListener('mousedown', () => {
    if (event.button === 2) {
        // Right mouse button was pressed, call your function here
        implode();
    }
    else {
        explode();
    }
});
document.addEventListener('mouseup', replode);
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Listen for the message event
window.addEventListener('message', function(event) {
    // Check if the message is a mousemove event
    if(event.data.type === 'mousemove') {
        // Handle the mouse movement
        handleMouseMove(event.data.clientX, event.data.clientY);
    }
    else if(event.data.type === 'explode') {
        explode();
    }
    else if(event.data.type === 'implode') {
        implode();
    }
    else if(event.data.type === 'replode') {
        replode();
    }
});

function calcDist(dot) {
    const xDist = dot[2] - dot[0];
    const yDist = dot[3] - dot[1];

    return Math.sqrt(xDist*xDist + yDist*yDist);
}

function getColor(dot) {

    const dist = calcDist(dot);
    let a;

    switch(colorMode) {
        case 'negitive':
            a = dist > defaultDist ? 1 : dist / defaultDist;
            return `hsl(0, 0%, ${Math.floor(100 - a*100)}%)`;
            break;
        case 'brightness':
            a = dist > defaultDist ? 1 : dist / defaultDist;
            return `hsl(0, 0%, ${Math.floor(a*100)}%)`;
            break;
        case 'transparency':
            a = dist > defaultDist ? 1 : dist / defaultDist;
            return `rgba(255,255,255,${a})`;
            break;
        case 'green':
            a = dist > defaultDist ? 1 : dist / defaultDist;
            return `rgba(${Math.floor(100 * (1-a))},255,${Math.floor(100 * (1-a))},${lerp(0.0, 1, a)})`;
            break;
        case 'hue':
            a = dist > defaultDist * 1.5 ? 1 : dist / (defaultDist * 1.5);
            return `hsl(${a*300}, 100%, 50%)`;
            break;
        case 'white':
        default:
            return '#ffffff';
            break;
    }
}

function calcPhys(dotIndex) {
    let dot = dots[dotIndex];

    let nextX = dot[0];
    let nextY = dot[1];
    
    if(doDotRepel) {
        for(let i = 0; i < dots.length; i++) {
            if(i == dotIndex) continue;

            let xDist = dots[i][0] - dot[0];
            let yDist = dots[i][1] - dot[1];

            let dist = Math.sqrt(xDist*xDist + yDist*yDist);

            if(dist < dotDist) {
                const dir = xDist == 0 ? 
                    yDist > 0 ? 
                        90 : -90
                    : xDist > 0 ?
                        Math.atan(yDist / xDist) + Math.PI : Math.atan(yDist / xDist);

                
                // let offsetDist = lerp(dotDist, 0, 1);
                const offsetDist = lerp(dotDist, 0, dist/dotDist);

                // dir += isMouseColide ? 0 : (Math.random() * 2 - 1); // adds a little randomness to avoid the dots getting stuck

                const xOffset = Math.cos(dir) * offsetDist;
                const yOffset = Math.sin(dir) * offsetDist;

                nextX = nextX + xOffset;
                nextY = nextY + yOffset;
            }
        }
    } 

    if(doReturn) {
        const xDist = dot[2] - dot[0];
        const yDist = dot[3] - dot[1];

        const dist = Math.sqrt(xDist*xDist + yDist*yDist);

        // const t = dist > returnDist ? 1 : dist / returnDist;
        const t = returnValue;

        nextX = snapLerpB(nextX, dot[2], t, 0.1);
        nextY = snapLerpB(nextY, dot[3], t, 0.1);
    }

    if(!ignoreMouse) {
        let xDist = mouse.x - dot[0];
        let yDist = mouse.y - dot[1];

        let dist = Math.sqrt(xDist*xDist + yDist*yDist);

        let isMouseColide = false;

        let smoothMouse = (lastMouseDiff + mouseDiff) / 2;
        // let t = mouseDiff > mouseMultiplier ? 1 : mouseDiff / mouseMultiplier;
        // let t = smoothMouse > mouseMultiplier ? 1 : smoothMouse / mouseMultiplier;
        // var mDist = lerp(0, minDist, t);
        
        var mDist = minDist;

        if(dist < mDist) {
            let isMouseColide = true;

            let dir = xDist == 0 ? 
                yDist > 0 ? 
                    90 : -90
                : xDist > 0 ?
                    Math.atan(yDist / xDist) + Math.PI : Math.atan(yDist / xDist);

            // let offsetDist = lerp(mDist, 0, dist/mDist);
            // let offsetDist = lerp(mDist, 0, 0.9);
            let offsetDist = lerp(mDist, 0, lerp(pushFloor, 1, dist/mDist));

            
            let xOffset = Math.cos(dir) * offsetDist;
            let yOffset = Math.sin(dir) * offsetDist;

            nextX = nextX + xOffset;
            nextY = nextY + yOffset;
        }
    }

    if(!doReturn) {
        if(nextX - dotSize < 0) {
            nextX = 0 + dotSize + (Math.random()); // adds a little randomness to avoid the dots getting stuck
        }
        else if(nextX + dotSize > canvas.width) {
            nextX = canvas.width - dotSize - (Math.random());
        }
        if(nextY - dotSize < 0) {
            nextY = 0 + dotSize + (Math.random());
        }
        else if(nextY + dotSize > canvas.height) {
            nextY = canvas.height - dotSize - (Math.random());
        }
    }
    dots[dotIndex][0] = nextX;
    dots[dotIndex][1] = nextY;
}

function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function clearFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFrame() {
    dots.forEach((dot) => {
        // ctx.fillStyle = dotColor;
        ctx.fillStyle = getColor(dot);
        ctx.beginPath();
        ctx.arc(dot[0], dot[1], dotSize, 0, Math.PI*2);
        // ctx.closePath();
        ctx.fill();
    });
}

var lastMouseX = mouse.x;
var lastMouseY = mouse.y;
var mouseXDiff = 0;
var mouseYDiff = 0;
var mouseDiff = 0;
var lastMouseDiff = 0;
function renderFrame(timeStamp) {
    mouseXDiff = lastMouseX - mouse.x;
    mouseYDiff = lastMouseY - mouse.y;
    mouseDiff = Math.sqrt(mouseXDiff*mouseXDiff + mouseYDiff*mouseYDiff);
    
    // console.log(mouseDiff); // for debugging

    for(let i = 0; i < dots.length; i++) {
        calcPhys(i);
    }

    sizeCanvas();
    drawFrame();


    lastMouseX = mouse.x;
    lastMouseY = mouse.y;
    lastMouseDiff = mouseDiff;
    window.requestAnimationFrame(renderFrame);
}

function randomScreenCord() {
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height);

    return [x, y];
}

function genRandDots(numDots) {
    dots = [];

    for(let i = 0; i < numDots; i++) {
        dots.push(randomScreenCord());
    }
}

function genDots() {
    dots = [];

    var yDotOffset = ((window.innerHeight - dotSize * 2) % (dotDist * spacingMultiplier)) / 2;
    var xDotOffset = ((window.innerWidth - dotSize * 2) % (dotDist * spacingMultiplier)) / 2;

    if(yDotOffset < dotSize) {
        yDotOffset = dotSize;
    }
    if(xDotOffset < dotSize) {
        xDotOffset = dotSize;
    }

    for(let y = yDotOffset; y < canvas.height; y += dotDist * spacingMultiplier) {
        for(let x = xDotOffset; x < canvas.width; x += dotDist * spacingMultiplier) {
            dots.push([x, y, x, y]);
        }
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    genDots();

    renderFrame();
    // drawFrame();
}

init();

addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    genDots();
});