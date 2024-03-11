const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

var dotSize = 5;
var minDist = 100;
var dotDist = 20;
var returnDist = 1000;

let mouseMultiplier = 10;

var dots = [];

var doReturn = true;

var mouse = {
    x : -1000,
    y : -1000
};

document.onmousemove = (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;  
}

function calcPhys(dotIndex) {
    let dot = dots[dotIndex];

    let nextX = dot[0];
    let nextY = dot[1];

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

        let offsetDist = lerp(mDist, 0, dist/mDist);

        
        let xOffset = Math.cos(dir) * offsetDist;
        let yOffset = Math.sin(dir) * offsetDist;

        nextX = nextX + xOffset;
        nextY = nextY + yOffset;
    }

    for(let i = 0; i < dots.length; i++) {
        if(i == dotIndex) continue;

        let xDist = dots[i][0] - dot[0];
        let yDist = dots[i][1] - dot[1];

        let dist = Math.sqrt(xDist*xDist + yDist*yDist);

        if(dist < dotDist) {
            let dir = xDist == 0 ? 
                yDist > 0 ? 
                    90 : -90
                : xDist > 0 ?
                    Math.atan(yDist / xDist) + Math.PI : Math.atan(yDist / xDist);

            let offsetDist = lerp(dotDist, 0, dist/dotDist);

            // dir += isMouseColide ? 0 : (Math.random() * 2 - 1); // adds a little randomness to avoid the dots getting stuck

            let xOffset = Math.cos(dir) * offsetDist;
            let yOffset = Math.sin(dir) * offsetDist;

            nextX = nextX + xOffset;
            nextY = nextY + yOffset;
        }
    }

    if(doReturn) {
        let xDist = dot[2] - dot[0];
        let yDist = dot[3] - dot[1];

        let dist = Math.sqrt(xDist*xDist + yDist*yDist);

        let t = dist > returnDist ? 1 : dist / returnDist;

        nextX = lerp(nextX, dot[2], t);
        nextY = lerp(nextY, dot[3], t);   
    }

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

    for(let y = dotSize; y < canvas.height; y += dotDist * 1.5) {
        for(let x = dotSize; x < canvas.width; x += dotDist * 1.5) {
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