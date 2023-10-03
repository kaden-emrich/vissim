class RectangularValue {

    constructor(x, y) {

        this.x = x;
        this.y = y;

    }// constructor

    toPolarValue() {

        var magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));

        var direction;

        if(this.x == 0) {

            if(this.y > 0) {

                direction = Math.PI / 2;

            }
            else {

                direction = 0 - (Math.PI / 2);

            }
        }
        else if(this.x > 0) {
            
            direction = Math.atan(this.y / this.x);

        }
        else {

            direction = Math.atan(this.y / this.x) + Math.PI;

        }

        return new PolarValue(direction, magnitude);

    }// toPolarValue()

}// class Point

class PolarValue {
    
    constructor(dir, mag) {

        this.direction = dir; // stored in radians
        this.magnitude = mag;

    }// constructor

    toRectangularValue() {

        var x = this.magnitude * Math.cos(this.direction);
        var y = this.magnitude * Math.sin(this.direction);

        return new RectangularValue(x, y);

    }// toRectangularValue()

    add(otherPolarValue) {
        
        var thisRect = this.toRectangularValue();
        var otherRect = otherPolarValue.toRectangularValue();

        var x = thisRect.x + otherRect.x;
        var y = thisRect.y + otherRect.y;

        var newValue = new RectangularValue(x, y).toPolarValue();

        this.direction = newValue.direction;
        this.magnitude = newValue.magnitude;

    }// add(otherPolarValue)

}// class PolarValue

class Particle {

    constructor(point, size, gameObj) {

        this.point = point;
        this.size = size;

        this.motion = new PolarValue(0, 0);
 
        this.id = null;
        this.gameObject = gameObj;

        if(this.gameObject) {

            this.id = this.gameObject.addEntity(this);

        }
        
    }// constructor

    tick() {

        this.point.x += this.motion.toRectangularValue().x;
        this.point.y += this.motion.toRectangularValue().y;

        if(this.point.y + this.size >= this.gameObject.canvas.height) {
            
            console.log("ahh");

            var mr = this.motion.toRectangularValue();
            mr.y = 0 - Math.abs(mr.y);

            this.motion = mr.toPolarValue();

        }

    }// update()

    draw(gfxContext) {

        gfxContext.beginPath();

        gfxContext.arc(this.point.x, this.point.y, this.size, 0, 2 * Math.PI);

        gfxContext.stroke();

    }// draw(gfxContext)

}// class Particle

var Game = Object();

Game.canvas = document.getElementById("game");

Game.gfx = Game.canvas.getContext('2d');

Game.canvas.width = 800;
Game.canvas.height = 800;
Game.canvas.style.backgroundColor = "grey";

Game.entities = Array();

Game.updateSpeed = 1000/60; // ms

Game.gravityAccel = 20;
Game.gravity = new PolarValue(Math.PI / 2, Game.gravityAccel / 60);

Game.addEntity = function(entity) {

    var id = this.entities.length;

    this.entities[id] = entity;

    return id;

}// Game.addEntity(entity)

Game.tick = function() {

    for(let i = 0; i < this.entities.length; i++) {

        this.entities[i].motion.add(Game.gravity);

        this.entities[i].tick();

    }

}// Game.tick()

Game.draw = function() {

    for(let i = 0; i < Game.entities.length; i++) {

        Game.entities[i].draw(Game.gfx);

    }

}// Game.draw();

Game.update = function() {

    Game.gfx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

    Game.tick();
    Game.draw();

}// Game.update();

Game.init = function() {

    Game.updateInterval = setInterval(Game.update, Game.updateSpeed);

}// Game.init()

Game.init();

function test1() {

    var t1 = new Particle(new RectangularValue(200, 200), 100, Game);
    //t1.motion.add(new PolarValue(Math.PI/4, 5));

}// test1()