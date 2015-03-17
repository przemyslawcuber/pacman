(function(){
	$(document).ready(function(){
		var Pacman = {};

// USER PROPERTIES
Pacman.User = {};
Pacman.User.position = null;
Pacman.User.prevPosition = null;
Pacman.User.Direction = {
	LEFT: 0,
	UP: 1,
	RIGHT: 2,
	DOWN: 3 
};
Pacman.User.direction = Pacman.User.Direction.LEFT;
Pacman.User.newDirection = Pacman.User.Direction.LEFT;
Pacman.User.score = null;
Pacman.User.eaten = null;
Pacman.User.lives = null;
Pacman.User.speed = 15;

Pacman.User.addScore = function(newScore) {
	var score = Pacman.User.score;
	score += newScore;
	if (score >= 10000 && score - newScore < 10000) {
		Pacman.User.lives += 1;
	}
};

Pacman.User.initUser = function() {
	Pacman.User.score = 0;
	Pacman.User.lives = 3;
	Pacman.User.newLevel();
};

Pacman.User.newLevel = function() {
	Pacman.User.defaultPosition();
	Pacman.User.prevPosition = Pacman.User.position; 
	Pacman.User.eaten = 0;
};

Pacman.User.calculateAngle = function(direction, position) { 
        if (direction == Pacman.User.Direction.RIGHT && (position.x % Pacman.gameMapBlockSizeX < Pacman.gameMapBlockSizeX / 2)) {
            return {"start":0.25, "end":1.75, "counterclockwise": false};
        } else if (direction === Pacman.User.Direction.DOWN && (position.y % Pacman.gameMapBlockSizeY < Pacman.gameMapBlockSizeY / 2)) { 
            return {"start":0.75, "end":2.25, "counterclockwise": false};
        } else if (direction === Pacman.User.Direction.UP && (position.y % Pacman.gameMapBlockSizeY < Pacman.gameMapBlockSizeY / 2)) { 
            return {"start":1.25, "end":1.75, "counterclockwise": true};
        } else if (direction === Pacman.User.Direction.LEFT && (position.x % Pacman.gameMapBlockSizeX < Pacman.gameMapBlockSizeX / 2)) {             
            return {"start":0.75, "end":1.25, "counterclockwise": true};
        }
        return {"start":0, "end":2, "direction": false};
    };

Pacman.User.draw = function() {	

	Pacman.contextPlayer.fillStyle = "#FFFF00";
	
	Pacman.contextPlayer.strokeStyle = "#FFFF00";
	Pacman.contextPlayer.lineWidth   = 1.5;
	Pacman.contextPlayer.lineCap     = "round";
	//Pacman.contextPlayer.beginPath();
	//Pacman.contextPlayer.moveTo(14*Pacman.gameMapBlockSizeX, 17 * Pacman.gameMapBlockSizeY);
	//Pacman.contextPlayer.lineTo(15*Pacman.gameMapBlockSizeX, 17 * Pacman.gameMapBlockSizeY);
	//Pacman.contextPlayer.lineTo(15*Pacman.gameMapBlockSizeX, 18 * Pacman.gameMapBlockSizeY);
	//Pacman.contextPlayer.lineTo(14*Pacman.gameMapBlockSizeX, 18 * Pacman.gameMapBlockSizeY);
	//Pacman.contextPlayer.lineTo(14*Pacman.gameMapBlockSizeX, 17 * Pacman.gameMapBlockSizeY);
	//Pacman.contextPlayer.stroke();

        	
	for (var i = 0; i < Pacman.gameWidth; i++){
		Pacman.contextPlayer.beginPath();
		Pacman.contextPlayer.moveTo(i*Pacman.gameMapBlockSizeX, 0);
		Pacman.contextPlayer.lineTo(i*Pacman.gameMapBlockSizeX, Pacman.gameHeight*Pacman.gameMapBlockSizeY);
		Pacman.contextPlayer.stroke();
	}
	
	for (var j = 0; j < Pacman.gameHeight; j++) {
		Pacman.contextPlayer.beginPath();
		Pacman.contextPlayer.moveTo(0, j*Pacman.gameMapBlockSizeY);
		Pacman.contextPlayer.lineTo(Pacman.gameWidth * Pacman.gameMapBlockSizeX, j*Pacman.gameMapBlockSizeY);
		Pacman.contextPlayer.stroke();	
	}

	var angle = Pacman.User.calculateAngle(Pacman.User.direction, Pacman.User.position);        
       
	Pacman.contextPlayer.beginPath();        

	Pacman.contextPlayer.moveTo(Pacman.User.position.x + Pacman.gameMapBlockSizeX / 2, Pacman.User.position.y + Pacman.gameMapBlockSizeY / 2);
        
    Pacman.contextPlayer.arc(Pacman.User.position.x + Pacman.gameMapBlockSizeX / 2, Pacman.User.position.y + Pacman.gameMapBlockSizeY / 2,
           6, Math.PI * angle.start, Math.PI * angle.end, angle.counterclockwise); 
        
    Pacman.contextPlayer.fill();    
};

Pacman.User.defaultPosition = function () {
	Pacman.User.position = {"x": 14 * Pacman.gameMapBlockSizeX, "y": 17 * Pacman.gameMapBlockSizeY}; 
};

Pacman.User.onWholeSquare = function (position) {
	return position.x % Pacman.gameMapBlockSizeX === 0 && position.y % Pacman.gameMapBlockSizeY === 0; 
};

Pacman.User.checkPosition = function(position) {
	return position.x >= 0 && position.x <= Pacman.canvas.width && position.y >= 0 && position.y <= Pacman.canvas.height; 
};

Pacman.User.nextSquare = function(position, direction) {
	var rest = position % Pacman.gameMapBlockSizeX;
	if (rest === 0) { 
		return position; 
	} else if (direction === Pacman.User.Direction.RIGHT || direction === Pacman.User.Direction.DOWN) { 
		return position + (Pacman.gameMapBlockSizeX - rest);
	} else {
	return position - rest;
	}
};

Pacman.User.positionToCoord = function(position) {
	return {
		"x" : Math.round(position.x / Pacman.gameMapBlockSizeX),
		"y" : Math.round(position.y / Pacman.gameMapBlockSizeY),
	};      
};

Pacman.User.nextPositionToCoord = function(position, direction) {
	var nextPosition = {};
	nextPosition.y = Pacman.User.nextSquare(position.y, direction);
	nextPosition.x = Pacman.User.nextSquare(position.x, direction);
	if (!Pacman.User.checkPosition(nextPosition)) {
		return null;
	} else {
		return Pacman.User.positionToCoord(nextPosition);
	}                 
};
    
Pacman.User.nextSquareContent = function(position, direction) {
	var nextPositionCoord = Pacman.User.nextPositionToCoord(position, direction);
	if (nextPositionCoord === null) {
		return false;
	} else {
		return Pacman.currentGameMap[nextPositionCoord.y][nextPositionCoord.x];
	}
	
};

Pacman.User.isOnSamePlane = function (newDirection, direction) { 
        return ((newDirection === Pacman.User.Direction.LEFT || newDirection === Pacman.User.Direction.RIGHT) && 
                (direction === Pacman.User.Direction.LEFT || direction === Pacman.User.Direction.RIGHT)) || 
            ((newDirection === Pacman.User.Direction.UP || newDirection === Pacman.User.Direction.DOWN) && 
             (direction === Pacman.User.Direction.UP || direction === Pacman.User.Direction.DOWN));
    };

Pacman.User.move = function() {

	var newPosition = null;
	var square = null;
	var newPositionToCoord = null;
	
	if (Pacman.User.newDirection !== Pacman.User.direction) {
		newPosition = Pacman.User.calculateNewPosition(Pacman.User.newDirection);
		if (Pacman.User.isOnSamePlane(Pacman.User.newDirection, Pacman.User.direction) || (Pacman.User.onWholeSquare(Pacman.User.position) && (Pacman.User.nextSquareContent(newPosition, Pacman.User.newDirection) === Pacman.EMPTY || Pacman.User.nextSquareContent(newPosition, Pacman.User.newDirection) === Pacman.PELLET || Pacman.User.nextSquareContent(newPosition, Pacman.User.newDirection) === Pacman.PILL))) {
			Pacman.User.direction = Pacman.User.newDirection;
		}
		/* 
		else {
			Pacman.User.newDirection = Pacman.User.direction;
		}
		*/
	}
	
	newPosition = Pacman.User.calculateNewPosition(Pacman.User.direction);
	
	if (Pacman.User.onWholeSquare(Pacman.User.position) && (Pacman.User.nextSquareContent(newPosition, Pacman.User.direction) === Pacman.WALL || Pacman.User.nextSquareContent(newPosition, Pacman.User.direction) === false)) {
		Pacman.User.position = Pacman.User.prevPosition;
		newPosition = Pacman.User.position;
	}
	
	if (newPosition.y === 224 && newPosition.x <= -16 && Pacman.User.newDirection === Pacman.User.Direction.LEFT) {
            newPosition = {"y": 224, "x": 440};
	}
	
	if (newPosition.y === 224 && newPosition.x >= 448 && Pacman.User.newDirection === Pacman.User.Direction.RIGHT) {
            newPosition = {"y": 224, "x": 0};
	}
	
	Pacman.User.position = newPosition;	
	
	var squareContent = Pacman.User.nextSquareContent(Pacman.User.position, Pacman.User.direction);

	if ((newPosition.x % Pacman.gameMapBlockSizeX === 2 || newPosition.y % Pacman.gameMapBlockSizeY === 2) &&
            (squareContent === Pacman.PELLET || squareContent === Pacman.PILL)) {
        var nextSquareCoord = Pacman.User.nextPositionToCoord(Pacman.User.position, Pacman.User.direction);
		Pacman.currentGameMap[nextSquareCoord.y][nextSquareCoord.x] = Pacman.EMPTY;
		Pacman.User.score += (squareContent === Pacman.PELLET) ? 10 : 50;            
        Pacman.User.eaten += 1;
            
		if (Pacman.User.eaten === 244) {
			//completedLevel();
			console.log("new level");
		}
            
		if (squareContent === Pacman.PILL) { 
			//eatenPill();
		}
	}  

	Pacman.User.prevPosition = Pacman.User.position; 
};

Pacman.User.calculateNewPosition = function(direction) {
	return {
            "x": Pacman.User.position.x + (direction === Pacman.User.Direction.LEFT && -2 || direction === Pacman.User.Direction.RIGHT && 2 || 0),
            "y": Pacman.User.position.y + (direction === Pacman.User.Direction.DOWN && 2 || direction === Pacman.User.Direction.UP    && -2 || 0)
	};
};

// END USER PROPERTIES
		
		
// DRAW MAP
		function drawMap() {
			Pacman.contextBackground.fillStyle = "#000";
			Pacman.contextBackground.fillRect(0, 0, Pacman.canvas.width, Pacman.canvas.height);

			drawWalls();
			
			
			for (var i = 0; i < Pacman.gameHeight; i++) {
		    	for (var j = 0; j < Pacman.gameWidth; j++) {	    	
			    	var map = Pacman.currentGameMap[i][j];
			    	
			    	if (map === Pacman.PILL) {
			    		Pacman.contextBackground.beginPath();
			    		// fillStyle - Sets or returns the color, gradient, or pattern used to fill the drawing
			    		Pacman.contextBackground.fillStyle = "#FFF";
	      				// arc - Creates an arc/curve (used to create circles, or parts of circles)
	      				Pacman.contextBackground.arc((j * Pacman.gameMapBlockSizeX) + Pacman.gameMapBlockSizeX / 2, (i * Pacman.gameMapBlockSizeY) + Pacman.gameMapBlockSizeY / 2, 6, 0, 2 * Math.PI, false);
	      				var canvas = document.getElementById('myCanvas');
      
		    			// fill - Fills the current drawing (path)
                    	Pacman.contextBackground.fill();
			    	} else if (map === Pacman.PELLET) {
			    		Pacman.contextBackground.beginPath();
			    		// fillStyle - Sets or returns the color, gradient, or pattern used to fill the drawing
			    		Pacman.contextBackground.fillStyle = "#FFF";
						Pacman.contextBackground.fillRect((j * Pacman.gameMapBlockSizeX) + (Pacman.gameMapBlockSizeX / 2.5), (i * Pacman.gameMapBlockSizeY) + (Pacman.gameMapBlockSizeY / 2.5), 
							Pacman.gameMapBlockSizeX / 6, Pacman.gameMapBlockSizeY / 6);
			    	} else
			    		continue;
					// closePath - Creates a path from the current point back to the starting point			    		
					Pacman.contextBackground.closePath();
				}
			}
		}
		
		function drawWalls() {

        	var p, line;
        
			// strokeStyle - sets or returns the color, gradient, or pattern used for strokes
        	Pacman.contextBackground.strokeStyle = "#0000FF";
			// lineWidth - sets or returns the current line width
        	Pacman.contextBackground.lineWidth   = 1.5;
			// lineCap - sets or returns the style of the end caps for a line
        	Pacman.contextBackground.lineCap     = "round";
        
        	for (var i = 0; i < Pacman.WALLS.length; i++) {
            	line = Pacman.WALLS[i];
	    		// beginPath - begins a path, or resets the current path
            	Pacman.contextBackground.beginPath();

            for (var j = 0; j < line.length; j++) {

                p = line[j];
                
                if (p.move) {
		  // moveTo - Moves the path to the specified point in the canvas, without creating a line
                    Pacman.contextBackground.moveTo(p.move[0] * Pacman.gameMapBlockSizeX, p.move[1] * Pacman.gameMapBlockSizeY);
                } else if (p.line) {
		  // lineTo - Adds a new point and creates a line from that point to the last specified point in the canvas
                    Pacman.contextBackground.lineTo(p.line[0] * Pacman.gameMapBlockSizeX, p.line[1] * Pacman.gameMapBlockSizeY);
                } else if (p.curve) {
		  // quadraticCurveTo - Creates a quadratic Bézier curve
                    Pacman.contextBackground.quadraticCurveTo(p.curve[0] * Pacman.gameMapBlockSizeX, 
                    					p.curve[1] * Pacman.gameMapBlockSizeY,
                                         p.curve[2] * Pacman.gameMapBlockSizeX, 
                                         p.curve[3] * Pacman.gameMapBlockSizeY);
                }
            }
            // stroke - Actually draws the path you have defined
            Pacman.contextBackground.stroke();
        }
		}
// END DRAW MAP
		
		$(document).keydown(function(event){
			/*
		 	* up - 38
		 	* down - 40
		 	* left - 37
		 	* right - 39
		 	* 
		 	* w - 87
		 	* a - 65
		 	* s - 83
		 	* d - 68 
		 	* 
		 	*/
			switch(event.which) {
				case 37: // left
				case 65: // a
					Pacman.User.newDirection = Pacman.User.Direction.LEFT;
				break;

				case 38: // up
				case 87: // w
					Pacman.User.newDirection = Pacman.User.Direction.UP;
				break;

				case 39: // right
				case 68: // d
					Pacman.User.newDirection = Pacman.User.Direction.RIGHT;
				break;

				case 40: // down
				case 83: // s
					Pacman.User.newDirection = Pacman.User.Direction.DOWN;
				break;

        		default: return; // exit this handler for other keys
    		}
		});
		
		function init() {
			Pacman.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
			Pacman.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
			Pacman.canvas = document.createElement("backgroundCanvas");
			Pacman.canvas.width = $("#backgroundCanvas").width();
			Pacman.canvas.height = $("#backgroundCanvas").height();
        	
        	Pacman.currentGameMap = $.extend(true, [], Pacman.MAP);
        	Pacman.gameWidth = Pacman.currentGameMap[0].length;
        	Pacman.gameHeight = Pacman.currentGameMap.length;
        	        	
        	Pacman.gameMapBlockSizeX = Pacman.canvas.width / Pacman.gameWidth;
        	Pacman.gameMapBlockSizeY = Pacman.canvas.height / Pacman.gameHeight;
        	
        	drawMap();
        	Pacman.User.initUser();
        	console.log("init");
        	Pacman.User.draw();
        	setInterval(function () {
    			Pacman.User.move();
			}, 1000 / 60);
        	loop();
		}
		
		function update() {
			//map.draw(ctx);
			//Pacman.User.move();
		}
		
		function render() {
			//Pacman.contextBackground.clearRect(0, 0, game.width, game.height);
			//Pacman.contextPlayer.clearRect(Pacman.User.position.x - 10, Pacman.User.position.y - 10, 20, 20);
			Pacman.contextPlayer.clearRect(Pacman.User.position.x - Pacman.gameMapBlockSizeX / 2, Pacman.User.position.y - Pacman.gameMapBlockSizeX / 2, Pacman.gameMapBlockSizeX * 2, Pacman.gameMapBlockSizeX * 2);

			//game.contextPlayer.drawImage...
			drawMap();
			Pacman.User.draw();
			console.log("render");
		}
		
		function loop() {
			requestAnimFrame(function(){
				loop();
			});
			update();
			render();
		}
		
		Pacman.WALL    = 0;
		Pacman.PELLET  = 1;
		Pacman.EMPTY   = 2;
		Pacman.BLOCK   = 3;
		Pacman.PILL    = 4;
		
		Pacman.MAP = [
			//		     5				5			|  5			  5				 5
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
			[0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0],
			[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
			[0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 2, 2, 2, 2, 2],
			[0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
			[0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
			[0, 4, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 4, 0],
			[0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
			[0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
			[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
			[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
			[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
	
	
		Pacman.WALLS = [
// 1 top
// 1 line
    [{"move": [3, 2.5]},
     {"curve": [2.5, 2.5, 2.5, 3]},
     {"line": [2.5, 4]},
     {"curve": [2.5, 4.5, 3, 4.5]},
     {"line": [5, 4.5]},
     {"curve": [5.5, 4.5, 5.5, 4]},
     {"line": [5.5, 3]},
     {"curve": [5.5, 2.5, 5, 2.5]},
     {"line": [3, 2.5]}],
     
     [{"move": [8, 2.5]},
	  {"curve": [7.5, 2.5, 7.5, 3]},
	  {"line": [7.5, 4]},
	  {"curve": [7.5, 4.5, 8, 4.5]},
	  {"line": [11, 4.5]},
	  {"curve": [11.5, 4.5, 11.5, 4]},
	  {"line": [11.5, 3]},
	  {"curve": [11.5, 2.5, 11, 2.5]},
	  {"line": [8, 2.5]}],
	  
	 [{"move": [17, 2.5]},
	  {"curve": [16.5, 2.5, 16.5, 3]},
	  {"line": [16.5, 4]},
	  {"curve": [16.5, 4.5, 17, 4.5]},
	  {"line": [20, 4.5]},
	  {"curve": [20.5, 4.5, 20.5, 4]},
	  {"line": [20.5, 3]},
	  {"curve": [20.5, 2.5, 20, 2.5]},
	  {"line": [17, 2.5]}],
	  
	 [{"move": [23, 2.5]},
	  {"curve": [22.5, 2.5, 22.5, 3]},
	  {"line": [22.5, 4]},
	  {"curve": [22.5, 4.5, 23, 4.5]},
	  {"line": [25, 4.5]},
	  {"curve": [25.5, 4.5, 25.5, 4]},
	  {"line": [25.5, 3]},
	  {"curve": [25.5, 2.5, 25, 2.5]},
	  {"line": [23, 2.5]}],     
     
     
// 2 top
	[{"move": [3, 6.5]},
     {"curve": [2.5, 6.5, 2.5, 7]},
     {"curve": [2.5, 7.5, 3, 7.5]},
     {"line": [5, 7.5]},
     {"curve": [5.5, 7.5, 5.5, 7]},
     {"curve": [5.5, 6.5, 5, 6.5]},
     {"line": [3, 6.5]}],


	[{"move": [8, 6.2]},
	{"curve": [8.5, 6.2, 8.5, 6.7]},
	{"line": [8.5, 8.7]},
	{"curve": [8.5, 9.2, 9, 9.2]},
	{"line": [11, 9.2]},
	{"curve": [11.5, 9.2, 11.5, 9.7]},
	{"curve": [11.5, 10.2, 11, 10.2]},
	{"line": [9, 10.2]},
	{"curve": [8.5, 10.2, 8.5, 10.7]},
	{"line": [8.5, 12.7]},
	{"curve": [8.5, 13.2, 8, 13.2]},
	{"curve": [7.5, 13.2, 7.5, 12.7]},
	{"line": [7.5, 6.7]},
	{"curve": [7.5, 6.2, 8, 6.2]}],
	
	[{"move": [11, 6.4]},
	{"line": [17, 6.4]},
	{"curve": [17.5, 6.4, 17.5, 6.9]},
	{"curve": [17.5, 7.4, 17, 7.4]},
	{"line": [15, 7.4]},
	{"curve": [14.5, 7.4, 14.5, 7.9]},
	{"line": [14.5, 9.9]},
	{"curve": [14.5, 10.4, 14, 10.4]},
	{"curve": [13.5, 10.4, 13.5, 9.9]},
	{"line": [13.5, 7.9]},
	{"curve": [13.5, 7.4, 13, 7.4]},
	{"line": [11, 7.4]},
	{"curve": [10.5, 7.4, 10.5, 6.9]},
	{"curve": [10.5, 6.4, 11, 6.4]}],
	
	
	[{"move": [20, 6.5]},
	{"curve": [19.5, 6.5, 19.5, 7]},
	{"line": [19.5, 9]},
	{"curve": [19.5, 9.5, 19, 9.5]},
	{"line": [17, 9.5]},
	{"curve": [16.5, 9.5, 16.5, 10]},
	{"curve": [16.5, 10.5, 17, 10.5]},
	{"line": [19, 10.5]},
	{"curve": [19.5, 10.5, 19.5, 11]},
	{"line": [19.5, 13]},
	{"curve": [19.5, 13.5, 20, 13.5]},
	{"curve": [20.5, 13.5, 20.5, 13]},
	{"line": [20.5, 7]},
	{"curve": [20.5, 6.5, 20, 6.5]}],
	
	
	[{"move": [8, 15.5]},
	 {"curve": [7.5, 15.5, 7.5, 16]},
	 {"line": [7.5, 19]},
	 {"curve": [7.5, 19.5, 8, 19.5]},
	 {"curve": [8.5, 19.5, 8.5, 19]},
	 {"line": [8.5, 16]},
	 {"curve": [8.5, 15.5, 8, 15.5]}],
	 
	[{"move": [20, 15.5]},
	 {"curve": [19.5, 15.5, 19.5, 16]},
	 {"line": [19.5, 19]},
	 {"curve": [19.5, 19.5, 20, 19.5]},
	 {"curve": [20.5, 19.5, 20.5, 19]},
	 {"line": [20.5, 16]},
	 {"curve": [20.5, 15.5, 20, 15.5]}],
	
	
	[{"move": [11, 18.5]},
	 {"curve": [10.5, 18.5, 10.5, 19]},
	 {"curve": [10.5, 19.5, 11, 19.5]},
	 {"line": [13, 19.5]},
	 {"curve": [13.5, 19.5, 13.5, 20]},
	 {"line": [13.5, 22]},
	 {"curve": [13.5, 22.5, 14, 22.5]},
	 {"curve": [14.5, 22.5, 14.5, 22]},
	 {"line": [14.5, 20]},
	 {"curve": [14.5, 19.5, 15, 19.5]},
	 {"line": [17, 19.5]},
	 {"curve": [17.5, 19.5, 17.5, 19]},
	 {"curve": [17.5, 18.5, 17, 18.5]},
	 {"line": [11, 18.5]}],
	 
	[{"move": [23, 6.5]},
	 {"curve": [22.5, 6.5, 22.5, 7]},
	 {"curve": [22.5, 7.5, 23, 7.5]},
	 {"line": [25, 7.5]},
	 {"curve": [25.5, 7.5, 25.5, 7]},
	 {"curve": [25.5, 6.5, 25, 6.5]},
	 {"line": [23, 6.5]}],
	
	
	
// middle
	[{"move": [15, 13]},
	{"line": [17.5, 13]},
	{"line": [17.5, 16]},
	{"line": [10.5, 16]},
	{"line": [10.5, 13]},
	{"line": [13, 13]}],
	
	[{"move": [15, 13.5]},
	{"line": [17, 13.5]},
	{"line": [17, 15.5]},
	{"line": [11, 15.5]},
	{"line": [11, 13.5]},
	{"line": [13, 13.5]}],

// top
	[{"move": [0, 13.3]}, 
     {"line": [5, 13.3]},
     {"curve": [5.5, 13.3, 5.5, 12.7]},
     {"line": [5.5, 9.9]},
     {"curve": [5.5, 9.4, 5, 9.4]},
     {"line": [1.2, 9.4]},
     {"curve": [0.6, 9.4, 0.6, 8.8]},
     {"line": [0.6, 1.2]},
     {"curve": [0.6, 0.7, 1.2, 0.7]},
     {"line": [13, 0.7]},
     {"curve": [13.5, 0.7, 13.5, 1.2]},
     {"line": [13.5, 4]},
     {"curve": [13.5, 4.5, 14, 4.5]},
     {"curve": [14.5, 4.5, 14.5, 4]},
     {"line": [14.5, 1.2]},
     {"curve": [14.5, 0.7, 15, 0.7]},
     {"line": [26.6, 0.7]},
     {"curve": [27.2, 0.7, 27.1, 1.2]},
     {"line": [27.1, 8.9]},
     {"curve": [27.1, 9.4, 26.6, 9.4]},
     {"line": [23, 9.4]},
     {"curve": [22.5, 9.4, 22.5, 9.9]},
     {"line": [22.5, 12.8]},
     {"curve": [22.5, 13.3, 23, 13.3]},
     {"line": [28, 13.3]}],

	
	[{"move": [0, 12.8]}, 
     {"line": [4.5, 12.8]},
     {"curve": [5, 12.8, 5, 12.3]},
     {"line": [5, 10.4]},
     {"curve": [5, 9.9, 4.5, 9.9]},
     {"line": [0.7, 9.9]},
     {"curve": [0.2, 9.9, 0.2, 9.4]},
     {"line": [0.2, 0.7]},
     {"curve": [0.2, 0.2, 0.7, 0.2]},
     {"line": [27.1, 0.2]},
     {"curve": [27.6, 0.2, 27.6, 0.7]},
     {"line": [27.6, 9.4]},
     {"curve": [27.6, 9.9, 27.1, 9.9]},
     {"line": [23.5, 9.9]},
     {"curve": [23, 9.9, 23, 10.4]},
     {"line": [23, 12.3]},
     {"curve": [23, 12.8, 23.5, 12.8]},
     {"line": [28, 12.8]}],

// down     
     [{"move": [0, 16.2]}, 
     {"line": [4.5, 16.2]},
     {"curve": [5, 16.2, 5, 16.7]},
     {"line": [5, 18.5]},
     {"curve": [5, 19, 4.5, 19]},
     {"line": [0.7, 19]},
     {"curve": [0.2, 19, 0.2, 19.5]}, 
     {"line": [0.2, 30]},
     {"curve": [0.2, 30.7, 1, 30.7]}, 
     {"line": [27, 30.7]},
     {"curve": [27.8, 30.7, 27.8, 29.8]},
     {"line": [27.8, 19.5]},
     {"curve": [27.8, 19, 27.3, 19]},
     {"line": [23.5, 19]},
     {"curve": [23, 19, 23, 18.5]},
     {"line": [23, 16.7]},
     {"curve": [23, 16.2, 23.5, 16.2]},
     {"line": [28, 16.2]}],
     
     
     
     [{"move": [0, 15.7]}, 
     {"line": [5, 15.7]},
     {"curve": [5.5, 15.7, 5.5, 16.2]},
     {"line": [5.5, 19]},
     {"curve": [5.5, 19.5, 5, 19.5]},
     {"line": [1.2, 19.5]},
     {"curve": [0.6, 19.5, 0.6, 20]}, 
     {"line": [0.6, 24]}, 
     {"curve": [0.6, 24.5, 1.4, 24.5]}, 
     {"line": [2.2, 24.5]},
     {"curve": [2.7, 24.5, 2.7, 25]},
     {"curve": [2.7, 25.5, 2.2, 25.5]},
     {"line": [1.1, 25.5]},
     {"curve": [0.6, 25.5, 0.6, 26]}, 
     {"line": [0.6, 29.7]},
     {"curve": [0.6, 30.3, 1.4, 30.3]}, 
     {"line": [26.6, 30.3]},
     {"curve": [27.4, 30.3, 27.4, 29.8]},
     {"line": [27.4, 26]},
     {"curve": [27.4, 25.5, 26.9, 25.5]},
     {"line": [25.8, 25.5]},
     {"curve": [25.3, 25.5, 25.3, 25]},
     {"curve": [25.3, 24.5, 25.8, 24.5]},
     {"line": [26.9, 24.5]},
     {"curve": [27.4, 24.5, 27.4, 24]},
     {"line": [27.4, 20]},
     {"curve": [27.4, 19.5, 26.8, 19.5]},
     {"line": [23, 19.5]},
     {"curve": [22.5, 19.5, 22.5, 19]},
     {"line": [22.5, 16.2]},
     {"curve": [22.5, 15.7, 23, 15.7]},
     {"line": [28, 15.7]}],
     
     
     
// down 2 line
	[{"move": [3, 21.5]},
	 {"curve": [2.5, 21.5, 2.5, 22]},
	 {"curve": [2.5, 22.5, 3, 22.5]},
	 {"line": [4, 22.5]},
	 {"curve": [4.5, 22.5, 4.5, 23]},
	 {"line": [4.5, 25]},
	 {"curve": [4.5, 25.5, 5, 25.5]},
	 {"curve": [5.5, 25.5, 5.5, 25]},
	 {"line": [5.5, 22]},
	 {"curve": [5.5, 21.5, 5, 21.5]},
	 {"line": [3, 21.5]}],
	 
	 
	[{"move": [8, 21.5]},
	 {"curve": [7.5, 21.5, 7.5, 22]},
	 {"curve": [7.5, 22.5, 8, 22.5]},
	 {"line": [11, 22.5]},
	 {"curve": [11.5, 22.5, 11.5, 22]},
	 {"curve": [11.5, 21.5, 11, 21.5]},
	 {"line": [8, 21.5]}],


	[{"move": [17, 21.5]},
	 {"curve": [16.5, 21.5, 16.5, 22]},
	 {"curve": [16.5, 22.5, 17, 22.5]},
	 {"line": [20, 22.5]},
	 {"curve": [20.5, 22.5, 20.5, 22]},
	 {"curve": [20.5, 21.5, 20, 21.5]},
	 {"line": [17, 21.5]}],
	 
	[{"move": [23, 21.5]},
	 {"curve": [22.5, 21.5, 22.5, 22]},
	 {"line": [22.5, 25]},
	 {"curve": [22.5, 25.5, 23, 25.5]},
	 {"curve": [23.5, 25.5, 23.5, 25]},
	 {"line": [23.5, 23]},
	 {"curve": [23.5, 22.5, 24, 22.5]},
	 {"line": [25, 22.5]},
	 {"curve": [25.5, 22.5, 25.5, 22]},
	 {"curve": [25.5, 21.5, 25, 21.5]},
	 {"line": [23, 21.5]}],

// down 1 line
     
    [{"move": [3, 27.5]},
	 {"curve": [2.5, 27.5, 2.5, 28]},
	 {"curve": [2.5, 28.5, 3, 28.5]},
	 {"line": [11, 28.5]},
	 {"curve": [11.5, 28.5, 11.5, 28]},
	 {"curve": [11.5, 27.5, 11, 27.5]},
	 {"line": [9, 27.5]},
	 {"curve": [8.5, 27.5, 8.5, 27]},
	 {"line": [8.5, 25]},
	 {"curve": [8.5, 24.5, 8, 24.5]},
	 {"curve": [7.5, 24.5, 7.5, 25]},
	 {"line": [7.5, 27]},
	 {"curve": [7.5, 27.5, 7, 27.5]},
	 {"line": [3, 27.5]}],
	 
	 [{"move": [11, 24.5]},
	 {"curve": [10.5, 24.5, 10.5, 25]},
	 {"curve": [10.5, 25.5, 11, 25.5]},
	 {"line": [13, 25.5]},
	 {"curve": [13.5, 25.5, 13.5, 26]},
	 {"line": [13.5, 28]},
	 {"curve": [13.5, 28.5, 14, 28.5]},
	 {"curve": [14.5, 28.5, 14.5, 28]},
	 {"line": [14.5, 26]},
	 {"curve": [14.5, 25.5, 15, 25.5]},
	 {"line": [17, 25.5]},
	 {"curve": [17.5, 25.5, 17.5, 25]},
	 {"curve": [17.5, 24.5, 17, 24.5]},
	 {"line": [11, 24.5]}],
	 
	 [{"move": [20, 24.5]},
	 {"curve": [19.5, 24.5, 19.5, 25]},
	 {"line": [19.5, 27]},
	 {"curve": [19.5, 27.5, 19, 27.5]},
	 {"line": [17, 27.5]},
	 {"curve": [16.5, 27.5, 16.5, 28]},
	 {"curve": [16.5, 28.5, 17, 28.5]},
	 {"line": [25, 28.5]},
	 {"curve": [25.5, 28.5, 25.5, 28]},
	 {"curve": [25.5, 27.5, 25, 27.5]},
	 {"line": [21, 27.5]},
	 {"curve": [20.5, 27.5, 20.5, 27]},
	 {"line": [20.5, 25]},
	 {"curve": [20.5, 24.5, 20 , 24.5]}],
     
];
	
		
		init();
	
	});
})();

// Shim by Paul Irish. Please don't sue.
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame	|| 
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 30);
		};
})();
