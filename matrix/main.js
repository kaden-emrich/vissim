var game = document.getElementById('game');
var ctx = game.getContext('2d');

var symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&?:;=+/\\<>';

var rainColor = "#00ff00";

var rainbow = false;

var colorStyle = 'default';

var fallGradiant = [100, 30, 20, 100]; // hue values
// var springGradiant = [45, 140, 300, 330];

var gradiantColors = fallGradiant;

var fontSize = 10;
var delay = 20;
var columns;
var firstDrops = [];
var drops = [];
var hues = [];

function sizeScreen() {
  game.height = window.innerHeight;
  game.width = window.innerWidth;
  columns = game.width/fontSize;

  drops = [];
  firstDrops = Array(Math.floor(columns)).fill(true);
  for(let i = 0; i < columns; i++) {
      drops[i] = 1;
      hues[i] = 0;

      if(colorStyle == 'gradiant') {
        hues[i] = Math.random()
      }
  }
}

function importUrlVars() {
  var urlParams = new URLSearchParams(window.location.search);

  if(urlParams.get('color') != null) {
    rainColor =  "#" + urlParams.get('color');
    console.log('Setting rainColor to: ' + rainColor);
  }

  if(urlParams.get('rainbow') == 'true') {
    colorStyle = 'rainbow'
    console.log('Setting colorStyle to: rainbow');
  }

  if(urlParams.get('font-size') != null) {
    fontSize = parseInt(urlParams.get('font-size'));
    console.log('Setting fontSize to: ' + fontSize);
  }

  if(urlParams.get('delay') != null) {
    delay = parseInt(urlParams.get('delay'));
    console.log('Setting delay to: ' + delay);
  }

  if(urlParams.get('color-style') != null) {
    colorStyle = urlParams.get('color-style');
    console.log('Setting colorStyle to: ' + colorStyle);

    if(colorStyle == 'fall') {
      colorStyle = 'gradiant';
      gradiantColors = fallGradiant;
    }
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
    if(colorStyle == 'rainbow') {
      ctx.fillStyle = `hsl(${hues[i]}, 100%, 50%)`;
      if(hues[i] >= 360) {
        hues[i] = 0;
      }
      hues[i] += Math.random() * 5;
    }
    else if(colorStyle == 'gradiant') {
      if(hues[i] >= 1) {
        hues[i] = 0;
      }

      ctx.fillStyle = `hsl(${multiValueLerp(gradiantColors, hues[i])}, 100%, 50%)`;

      hues[i] += Math.random()/50;
    }
    else {
      ctx.fillStyle = rainColor;
    }

    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    drops[i]++;

    if(drops[i] * fontSize > game.height) {
      if(firstDrops[i] == true) {
        if(Math.random() > (1 - fontSize / window.innerHeight)) {
          drops[i] = 0;
          firstDrops[i] = false;
        }
      }
      else if(Math.random() > (.95)) {
        drops[i] = 0;
      }
    }
  }
}
  

importUrlVars();
sizeScreen();
setInterval(draw, delay);