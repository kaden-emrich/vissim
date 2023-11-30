var game = document.getElementById('game');
var ctx = game.getContext('2d');

var symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&?:;=+/\\<>';

var rainColor = "hsl(0, 100%, 50%)";
var hue = 0;

var fontSize = 10;
var columns;
var drops = [];

function sizeScreen() {
    game.height = window.innerHeight;
    game.width = window.innerWidth;
    fontSize = 10;
    columns = game.width/fontSize;

    drops = [];
    for(let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}

sizeScreen();

function draw() {
    if(game.width != window.innerWidth) {
        sizeScreen();
    }
    else if(game.height != window.innerHeight) {
        sizeScreen();
    }

    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, game.width, game.height);

    for (var i = 0; i < drops.length; i++) {
      var text = symbols[Math.floor(Math.random() * symbols.length)];
      ctx.fillStyle = rainColor;

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;

      if (drops[i] * fontSize > game.height && Math.random() > .95) {
        drops[i] = 0;
      }

    }
  }
  
  // Loop the animation
  setInterval(draw, 20);