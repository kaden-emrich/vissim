const gameFrame = document.getElementById('game');
const ctx = gameFrame.getContext("2d");

// gameFrame.style.width = "400px";
// gameFrame.style.height = "400px";

var scaleValue = 8;

importUrlVars();

var width = 100;
var height = 100;

// sizeScreen();
scaleScreen(scaleValue);

gameFrame.width = width;
gameFrame.height = height;

var cells = prepareCellArray(width, height);

function scaleScreen(v) {
    width = Math.floor(gameFrame.clientWidth / v);
    height = Math.floor(gameFrame.clientHeight / v);
}

function importUrlVars() {
    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.get('scaleValue') != null) {
        scaleValue = urlParams.get('scaleValue');
        console.log("URL setting scaleValue to: " + scaleValue);
    }
}

function prepareCellArray(width, height) {
    arr = Array();
    for(let i = 0; i < height; i++) {
        arr[i] = Array();
        for(let j = 0; j < width; j++) {
            arr[i][j] = 0;
            if(Math.floor(Math.random() * 100) == 0) {
                arr[i][j] = 1;
            }
        }
    }

    return arr;
}

function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    var loc = {
        x: Math.floor((evt.clientX - rect.left) * scaleX),   // scale mouse coordinates after they have
        y: Math.floor((evt.clientY - rect.top) * scaleY)     // been adjusted to be relative to element
    }

    console.log(loc);
    return loc;
}

function updateSand() {
    for(let i = cells.length - 1; i >= 0; i--) {
        for(let j = cells[i].length - 1; j >= 0; j--) {
            if(i < cells.length - 1 && cells[i][j] == 1) {
                if(cells[i+1] != undefined && cells[i+1][j] != undefined && cells[i+1][j] == 0) {
                    cells[i][j] = 0;
                    cells[i+1][j] = 1;
                }
                else if(j < cells[i].length - 1 && cells[i+1] != undefined && cells[i+1][j+1] != undefined && cells[i+1][j+1] == 0) {
                    cells[i][j] = 0;
                    cells[i+1][j+1] = 1;
                }
                else if(j > 0 && cells[i-1] != undefined && cells[i+1][j-1] != undefined && cells[i+1][j-1] == 0) {
                    cells[i][j] = 0;
                    cells[i+1][j-1] = 1;
                }
            }
        }
    }
}

function drawSand() {
    var imdat = ctx.createImageData(width, height);
    var data = imdat.data;

    var dataIndex = 0;
    for(let i = 0; i < cells.length; i++) {
        for(let j = 0; j < cells[i].length; j++) {
            if(cells[i][j] == 1) {
                data[dataIndex] = 255;
                data[dataIndex + 1] = 255;
                data[dataIndex + 2] = 255;
                data[dataIndex + 3] = 255;
            }
            else {
                data[dataIndex] = 0;
                data[dataIndex + 1] = 0;
                data[dataIndex + 2] = 0;
                data[dataIndex + 3] = 255;
            }
            
            dataIndex += 4;
        }
    }

    ctx .putImageData(imdat, 0, 0);
}

drawSand();

gameFrame.addEventListener('mousedown', (event) => {
    loc = getMousePos(gameFrame, event);
    cells[loc.y][loc.x] = 1;
}); 

var tickNum = -(width * 5);

function tick() {
    cells[0][Math.floor(Math.random() * width)] = 1;
    updateSand();
    drawSand();

    if(tickNum >= width) { 
        console.log('clearing last line'); // for debugging
        cells[height-1] = prepareCellArray(width, height)[height-1];
        tickNum = 0;
    }
    else {
        tickNum ++;
    }
}

setInterval(tick, 1000 / 30);