var game = document.getElementById('game');
var ctx = game.getContext('2d');

var symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&?:;=+/\\<>';

var rainColor = "#00ff00";

var rainbow = false;

var fontSize = 10;
var columns;
var drops = [];
var hues = [];

function sizeScreen() {
  game.height = window.innerHeight;
  game.width = window.innerWidth;
  columns = game.width/fontSize;

  drops = [];
  for(let i = 0; i < columns; i++) {
      drops[i] = 1;
      hues[i] = 0;
  }
}

function importUrlVars() {
  var urlParams = new URLSearchParams(window.location.search);

  if(urlParams.get('color') != null) {
    rainColor =  "#" + urlParams.get('color');
    console.log('Setting rainColor to: ' + rainColor);
  }

  if(urlParams.get('rainbow') == 'true') {
    rainbow = true;
    console.log('Setting rainbow to: ' + rainbow);
  }

  if(urlParams.get('font-size') != null) {
    fontSize = parseInt(urlParams.get('font-size'));
    console.log('Setting fontSize to: ' + fontSize);
  }
}

function draw() {
  if(game.width != window.innerWidth) {
      sizeScreen();
  }
  else if(game.height != window.innerHeight) {
      sizeScreen();
  }

  
  ctx.font = (fontSize) + 'px monospace';
  ctx.fillStyle = 'rgba(0, 0, 0, .1)';
  ctx.fillRect(0, 0, game.width, game.height);

  for (var i = 0; i < drops.length; i++) {
    var text = symbols[Math.floor(Math.random() * symbols.length)];
    if(rainbow) {
      ctx.fillStyle = `hsl(${hues[i]}, 100%, 50%)`;
      if(hues[i] >= 360) {
        hues[i] = 0;
      }
      hues[i] += Math.random() * 5;
    }
    else {
      ctx.fillStyle = rainColor;
    }

    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    drops[i]++;

    if (drops[i] * fontSize > game.height && Math.random() > .95) {
      drops[i] = 0;
    }

  }
}
  

importUrlVars();
sizeScreen();
setInterval(draw, 20);