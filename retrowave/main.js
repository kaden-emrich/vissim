const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

const numHorizontalLines = 5;
const numVerticalLines = 20;

const horizonLineMultiplier = 1/3;

let horizonPoint;

function getHorizonPoint() {
    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 3);
    return {
        x: x,
        y: y
    };
}

function draw() {
    let horizonLine = Math.floor(canvas.height / 3 + (canvas.height / 2)*horizonLineMultiplier);

    for(let i = 0; i < numHorizontalLines; i++) {
        const height = Math.floor(horizonLine + (horizonLine/numHorizontalLines)*i);
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(canvas.width, height)
        ctx.closePath();
        ctx.stroke();
    }

    for(let i = 0; i < numVerticalLines; i++) {
        const x = Math.floor((canvas.width*5)/(numVerticalLines-1)) * i - canvas.width*2;

        ctx.beginPath();
        ctx.moveTo(horizonPoint.x, horizonPoint.y);
        ctx.lineTo(x, canvas.height);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.clearRect(0, 0, canvas.width, horizonLine-1);
}

function init() {
    horizonPoint = getHorizonPoint(canvas);

    draw();
}

init();