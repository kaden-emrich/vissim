class RectangularValue {

    constructor(x, y) {

        this.x = x;
        this.y = y;

    }// constructor

    getDistance(point) {

        var xDist = Math.abs(this.x - point.x);
        var yDist = Math.abs(this.y - point.y);

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

    }// getDistance(point)

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

    equals(otherRectangularValue) {

        if(this.x == otherRectangularValue.x && this.y == otherRectangularValue.y) {

            return true;

        }
        else {

            return false;

        }

    }

}// class Point

class PolarValue {
    
    constructor(dir, mag) {

        if(mag < 0) {

            mag = Math.abs(mag);
            dir += Math.PI;

        }

        while(dir > Math.PI * 2) {

            dir -= Math.PI * 2;

        }

        while(dir < Math.PI * (-2)) {

            dir += Math.PI * 2;

        }

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

    constructor(point, size, simObj) {

        this.point = point;
        this.size = size;

        this.color = "hsla(0, 0, 0, 0)";
        this.borderColor = "hsla(0, 0, 0, 1)";

        this.motion = new PolarValue(0, 0);
 
        this.id = null;
        this.simulationObject = simObj;

        if(this.simulationObject) {

            this.id = this.simulationObject.addEntity(this);

        }
        
    }// constructor

    updatePosition() {

        if(this.motion.magnitude > this.simulationObject.maxSpeed) {

            this.motion.magnitude = this.simulationObject.maxSpeed;

        }

        this.point.x += this.motion.toRectangularValue().x;
        this.point.y += this.motion.toRectangularValue().y;

    }// updatePosition()

    updateCollision() {

        var skipGravityDrag = false;

        // check wall collisions

        if(this.point.x + this.size >= this.simulationObject.canvas.width || this.point.x - this.size <= 0) {
            
            while(this.point.x + this.size >= this.simulationObject.canvas.width) {

                this.point.x -= 1;

            }

            while(this.point.x - this.size <= 0) {
                
                this.point.x += 1;

            }

            var rectangularMotion = this.motion.toRectangularValue();
            rectangularMotion.x = this.simulationObject.gravity.magnitude + (-1 * rectangularMotion.x);

            this.motion = rectangularMotion.toPolarValue();

        }

        if(this.point.y + this.size >= this.simulationObject.canvas.height || this.point.y - this.size <= 0) {

            while(this.point.y + this.size >= this.simulationObject.canvas.height) {

                this.point.y -= 1;

            }

            while(this.point.y - this.size <= 0) {
                
                this.point.y += 1;
            }

            if(this.motion.magnitude <= this.simulationObject.gravity.magnitude && Math.abs(this.simulationObject.gravity.magnitude) > 0) {

                this.motion.magnitude = 0;
                skipGravityDrag = true;

            }
            else {

                var rectangularMotion = this.motion.toRectangularValue();
                rectangularMotion.y = this.simulationObject.gravity.magnitude + (-1 * rectangularMotion.y);

                this.motion = rectangularMotion.toPolarValue();

            }

        }

        // check collisions with other entities
        for(let i = 0; i < this.simulationObject.entities.length; i++) {
            
            var otherEntity = this.simulationObject.entities[i];

            if(otherEntity != this && this.checkCollision(otherEntity)) {

                var updateVector = new PolarValue(new RectangularValue(otherEntity.point.x - this.point.x, otherEntity.point.y - this.point.y).toPolarValue().direction, 1);

                while(
                    this.checkCollision(otherEntity) && (
                        !(this.point.x + this.size >= this.simulationObject.canvas.width || this.point.x - this.size <= 0) && 
                        !(this.point.y + this.size >= this.simulationObject.canvas.height || this.point.y - this.size <= 0)
                        )
                    ) {
                    
                    if(!(this.point.x + this.size >= this.simulationObject.canvas.width || this.point.x - this.size <= 0)) {

                        this.point.x -= updateVector.toRectangularValue().x;

                    }

                    if(!(this.point.y + this.size >= this.simulationObject.canvas.height || this.point.y - this.size <= 0)) {

                        this.point.y -= updateVector.toRectangularValue().y;

                    }

                }

                while(
                    otherEntity.checkCollision(this) && (
                        !(otherEntity.point.x + otherEntity.size >= otherEntity.simulationObject.canvas.width || otherEntity.point.x - otherEntity.size <= 0) && 
                        !(otherEntity.point.y + otherEntity.size >= otherEntity.simulationObject.canvas.height || otherEntity.point.y - otherEntity.size <= 0)
                        )
                    ) {
                    
                    if(!(otherEntity.point.x + otherEntity.size >= otherEntity.simulationObject.canvas.width || otherEntity.point.x - otherEntity.size <= 0)) {

                        otherEntity.point.x += updateVector.toRectangularValue().x;

                    }

                    if(!(otherEntity.point.y + otherEntity.size >= otherEntity.simulationObject.canvas.height || otherEntity.point.y - otherEntity.size <= 0)) {

                        otherEntity.point.y += updateVector.toRectangularValue().y;

                    }

                }

                if(this.motion.magnitude < this.simulationObject.gravity.magnitude && otherEntity.motion.magnitude < this.simulationObject.gravity.magnitude) {

                    this.motion.magnitude = 0;
                    otherEntity.motion.magnitude = 0;
                    skipGravityDrag = true;
                    continue;

                }

                var previousForceTotal = this.motion.magnitude + otherEntity.motion.magnitude;

                var averageMagnitude = (this.motion.magnitude + otherEntity.motion.magnitude) / 2;
                var averageDirection = (this.motion.direction + otherEntity.motion.direction) / 2;

                var newSpeedVector = new PolarValue(0, 0);
                newSpeedVector.add(this.motion);
                newSpeedVector.add(otherEntity.motion);

                var directionDifference = updateVector.direction - newSpeedVector.direction;
                var offsetVectorMagnitude = Math.abs((averageMagnitude / 1) / Math.cos(directionDifference));

                var offsetVector = new PolarValue(updateVector.direction, offsetVectorMagnitude);

                otherEntity.motion.add(new PolarValue(offsetVector.direction, newSpeedVector.magnitude / 2));
                this.motion.add(new PolarValue(offsetVector.direction, (-1) * (previousForceTotal - otherEntity.motion.magnitude)));
                this.motion.magnitude = previousForceTotal - otherEntity.motion.magnitude;

                var newForceTotal = this.motion.magnitude + otherEntity.motion.magnitude;

                if(previousForceTotal != newForceTotal && (previousForceTotal >= newForceTotal + 0.001 || previousForceTotal <= newForceTotal - 0.001)) {

                    console.log("Net force error: " + previousForceTotal + " => " + newForceTotal); // for debugging
                    otherEntity.motion.magnitude = previousForceTotal - this.motion.magnitude;

                }

                // if(this.motion.magnitude < 1 && Math.abs(this.simulationObject.gravity.magnitude && otherEntity.motion.magnitude < 1 && Math.abs(otherEntity.simulationObject.gravity.magnitude) > 0) > 0) {

                //     this.motion.magnitude = 0;
                //     otherEntity.motion.magnitude = 0;
                //     skipGravityDrag = true;
                //     continue;

                // }

            }

        }

        // update drag
        if(this.simulationObject.dragValue) {

            this.motion.magnitude *= (1 - this.simulationObject.dragValue);
            
        }

        if(skipGravityDrag && Math.abs(this.simulationObject.gravity.magnitude) > 0) {

            return;

        }

        // update gravity

        if(this.simulationObject.gravity) {

            this.motion.add(this.simulationObject.gravity);

        }

    }// updateCollision()

    tick() {

        this.updatePosition();
        this.updateCollision();

    }// update()

    checkCollision(otherEntity) {

        if(otherEntity.id == this.id) {
            return false;
        }

        var minDist = this.size + otherEntity.size;

        if(this.point.getDistance(otherEntity.point) <= minDist) {

            return true;

        }

        return false;

    }// checkCollision(otherEntity)

    draw(gfxContext) {

        gfxContext.strokeStyle = this.borderColor;
        gfxContext.fillStyle = this.color;
        gfxContext.lineWidth = 3;

        // gfxContext.shadowColor = this.borderColor;
        // gfxContext.shadowBur = 10;

        gfxContext.beginPath();

        gfxContext.arc(Math.floor(this.point.x), Math.floor(this.point.y), this.size, 0, 2 * Math.PI);


        gfxContext.fill();
        gfxContext.stroke();
        
    }// draw(gfxContext)

}// class Particle

class Simulation {

    constructor(canvas) {

        this.canvas = canvas;

        this.gfx = canvas.getContext('2d');

        this.gfx.lineWidth = 20;

        //this.canvas.style.backgroundColor = "grey";

        this.entities = Array();

        this.updateSpeed = 1000 / 60; // ms

        this.gravity = new PolarValue(Math.PI / 2, 0 / 60); // gravity is still very broken

        this.dragValue = 0.0;

        this.maxSpeed = this.canvas.height / 2;

        this.updateCanvasSize();

    }// constructor(canvas)

    addEntity(entity) {

        var id = this.entities.length;

        this.entities[id] = entity;

        return id;

    }// addEntity(entity)

    tick() {

        for(let i = 0; i < this.entities.length; i++) { 

            this.entities[i].updateCollision();

        }

        for(let i = 0; i < this.entities.length; i++) { 

            this.entities[i].updatePosition();

        }

        for(let i = 0; i < this.entities.length; i++) { 

            this.entities[i].updateCollision();

        }

    }// tick()

    draw() {

        for(let i = 0; i < this.entities.length; i++) {

            this.entities[i].draw(this.gfx);

        }

    }// draw()

    updateCanvasSize() {

        this.canvas.width = (this.canvas.height / window.innerHeight) * window.innerWidth;

        this.canvas.style.height = window.innerHeight + "px";

        this.canvas.style.width = window.innerWidth + "px";

    }// updateCanvasSize()

    update() {

        this.updateCanvasSize();

        this.tick();

        this.gfx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();

    }// update()

    start() {

        this.updateCanvasSize();
        this.updateInterval = setInterval(() => { this.update(); }, this.updateSpeed);

    }// init()

}// class Simulation

var game;

function test1() {

    game = new Simulation(document.getElementById('game'));
    game.start();

    var t1 = new Particle(new RectangularValue(280, 400), 50, game);
    var t2 = new Particle(new RectangularValue(100, 100), 50, game);
    var t3 = new Particle(new RectangularValue(250, 150), 50, game);
    var t4 = new Particle(new RectangularValue(400, 400), 50, game);

    t1.color = "red";
    t2.color = "yellow";
    t3.color = "green";
    t4.color = "blue";

    t1.motion.add(new PolarValue(Math.PI / 3, 10));
    t3.motion.add(new PolarValue(-1 * Math.PI / 2, 10))

}// test1()

function test2() {

    game = new Simulation(document.getElementById('game'));
    game.start();

    var t1 = new Particle(new RectangularValue(300, 400), 50, game);
    var t2 = new Particle(new RectangularValue(275, 100), 50, game);

    t1.color = "red";
    t2.color = "blue";

    t1.motion.add(new PolarValue(-1 * Math.PI / 2, 5));
    //t2.motion.add(new PolarValue(Math.PI / 2, 5));

}


function ball1() {

    game = new Simulation(document.getElementById('game'));
    game.start();

    var t1 = new Particle(new RectangularValue(game.canvas.width / 2, game.canvas.height / 2), 50, game);
    t1.motion.add(new PolarValue(Math.PI / 3, 10));

}

function stressTest(simObj, size, amount, maxSpeed) {

    game.maxSpeed = maxSpeed;

    for(let i = 0; i < amount; i++) {

        let next = new Particle(new RectangularValue(size + (Math.random() * (simObj.canvas.width - size*2)), size + (Math.random() * (simObj.canvas.height - size*2))), size, simObj);

        next.motion.add(new PolarValue(Math.random() * Math.PI * 2, Math.random() * maxSpeed));

        let colorHue = Math.floor(Math.random() * 255);

        next.color = "hsla(" + colorHue + ", 75%, 50%, 0.1)";
        next.borderColor = next.color = "hsla(" + colorHue + ", 60%, 50%, 0.3)";

    }

}// stressTest(simObj, size, amount, maxSpeed)

function stressTest1() {

    game = new Simulation(document.getElementById('game'));
    // game.gravity.magnitude = 2/3;
    // game.dragValue = 0.02;

    stressTest(game, 50, 10, 10);

    game.start();

}// stressTest1()
