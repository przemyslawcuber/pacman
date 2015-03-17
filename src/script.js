;(function(){
	$(document).ready(function(){
		var Pacman = {};

var Direction = {
	LEFT: 0,
	UP: 1,
	RIGHT: 2,
	DOWN: 3 
};

var user = new User();
var ghosts = [];

Pacman.gamePaused = false;
Pacman.isCollison = false;
Pacman.ghostColours = ["#00FFDE", "#FF0000", "#FFB8DE", "#FFB847"];
Pacman.gameOver = false;
Pacman.gameStarted = false;
Pacman.ghostsMoveIntervalId = null;
Pacman.userMoveIntervalId = null;

Pacman.timer = null;
Pacman.countingdown = false;


Pacman.userMoveSpeed = 1000 / 60;
Pacman.ghostMoveSpeed = 1000 / 60;

Pacman.contextBackground = null;
Pacman.contextGhost = null;
Pacman.contextPlayer = null;

	Pacman.init = function() {
		Pacman.contextTable = document.getElementById("tableCanvas").getContext("2d");
		Pacman.tableCanvas = document.createElement("tableCanvas");
		Pacman.tableCanvas.width = $("#tableCanvas").width();
		Pacman.tableCanvas.height = $("#tableCanvas").height();
		Pacman.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		Pacman.contextGhost = document.getElementById("ghostCanvas").getContext("2d");
			Pacman.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
			Pacman.canvas = document.createElement("backgroundCanvas");
			Pacman.canvas.width = $("#backgroundCanvas").width();
			Pacman.canvas.height = $("#backgroundCanvas").height();
			
		if (
			document.fullscreenEnabled || 
			document.webkitFullscreenEnabled || 
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled
		) {
			var gameCanvas = document.getElementById("gameCanvas");
	
			// click event handler
			gameCanvas.onclick = function() {	
			// in full-screen?
			if (
				document.fullscreenElement ||
				document.webkitFullscreenElement ||
				document.mozFullScreenElement ||
				document.msFullscreenElement
			) {

				// exit full-screen
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
			else {
				// go full-screen
				if (gameCanvas.requestFullscreen) {
					this.requestFullscreen();
					gameCanvas.requestFullscreen();
				} else if (gameCanvas.webkitRequestFullscreen) {
					gameCanvas.webkitRequestFullscreen();
				} else if (gameCanvas.mozRequestFullScreen) {
					gameCanvas.mozRequestFullScreen();
				} else if (gameCanvas.msRequestFullscreen) {
					gameCanvas.msRequestFullscreen();
				}
			}
			};
		}
			
	Pacman.gamePaused = false;
	Pacman.gameOver = false;
	
	Pacman.contextBackground.clearRect(0, 0, Pacman.canvas.width, Pacman.canvas.height);
	Pacman.contextGhost.clearRect(0, 0, Pacman.canvas.width, Pacman.canvas.height);
	Pacman.contextPlayer.clearRect(0, 0, Pacman.canvas.width, Pacman.canvas.height);
	
	Pacman.currentGameMap = $.extend(true, [], Pacman.MAP);
	Pacman.gameWidth = Pacman.currentGameMap[0].length;
	Pacman.gameHeight = Pacman.currentGameMap.length;
        	        	
	Pacman.gameMapBlockSizeX = Pacman.canvas.width / Pacman.gameWidth;
	Pacman.gameMapBlockSizeY = Pacman.canvas.height / Pacman.gameHeight;
        	
	drawMap();
	
	user = new User();
	ghosts = [];
	user.init();
	user.draw();
        	
	for (i = 0; i < Pacman.ghostColours.length; i += 1) {
		ghosts[i] = new Ghost();
		ghosts[i].init(Pacman.ghostColours[i]);
		ghosts[i].draw();
	}
	
	if (Pacman.ghostsMoveIntervalId !== null || Pacman.userMoveIntervalId !== null) {
		clearInterval(Pacman.ghostsMoveIntervalId);
		clearInterval(Pacman.userMoveIntervalId);
	}
};

Pacman.newGame = function() {
	Pacman.init();
	
	Pacman.ghostsMoveIntervalId = setInterval(function () {
		if (!Pacman.gamePaused && !Pacman.gameOver && Pacman.gameStarted) {
			for (i = 0; i < ghosts.length; i += 1) {
				ghosts[i].move();
			}
		}
	}, Pacman.ghostMoveSpeed);
	
	Pacman.userMoveIntervalId = setInterval(function () {
		if (!Pacman.gamePaused && !Pacman.gameOver && Pacman.gameStarted) {
			user.move();
		}
	}, Pacman.userMoveSpeed);
	
	
	var d = new Date();
	var n = d.getTime(); 
	Pacman.timer = n;
	Pacman.countingdown = true;
	
	setTimeout(function(){
		Pacman.timer = null;
		Pacman.countingdown = false;
		Pacman.gameStarted = true;
	}, 5000);
};

Pacman.drawCountingdown = function() {
	if (Pacman.countingdown) {
		var d = new Date();
		var time = d.getTime();
		var seconds = 5 - parseInt((time - Pacman.timer) / 1000);
		Pacman.contextTable.fillStyle = "#FFFF00";
		Pacman.contextTable.font = "30px GoodDog";
		Pacman.contextTable.fillText("Starting in " + seconds, 150, Pacman.canvas.height / 2 + 20);
	}
};

Pacman.drawTable = function() {
	// top
	Pacman.contextTable.fillStyle = "#000";
	Pacman.contextTable.fillRect(0, 0, Pacman.canvas.width, 34);
	
	Pacman.contextTable.fillStyle = "#FFFF00";
	Pacman.contextTable.font = "25px GoodDog";
	
  	Pacman.contextTable.fillText("Score: " + user.score, 40, 25);
  	Pacman.contextTable.fillText("Level: " + user.level, 300, 25);
  	
  	//bottom
  	Pacman.contextTable.fillStyle = "#000";
	Pacman.contextTable.fillRect(0, 530, Pacman.canvas.width, 560);
	
	// draw pacman
	var x = 30;
	for (i = 0; i < user.lives; i++) {
		user.drawOnTable(x * (i + 1));
	}
};

Pacman.gameOverAnimation = function() {
	Pacman.contextTable.fillStyle = "#FFFF00";
	Pacman.contextTable.font = "60px GoodDog";
	
  	Pacman.contextTable.fillText("Game Over", 110, Pacman.canvas.height / 2);
};

Pacman.completedLevel = function() {
	Pacman.init();
};

Pacman.gamePausedText = function() {
	if (Pacman.gamePaused) {
		Pacman.contextTable.fillStyle = "#FFFF00";
		Pacman.contextTable.font = "60px GoodDog";
  		Pacman.contextTable.fillText("Paused", 135, Pacman.canvas.height / 2 + 10);
	}
};

// START GHOST
function Ghost() {
	position: null;
	direction: null;
	newDirection: null;
	eaten: null;
	eatable: null;
	eatenEffectTime: 5;
	colour = null;
	collision: false;
	speed: 2;
};

Ghost.prototype.init = function(ghostColour) {
	this.colour = ghostColour;
	this.eaten = false;
	this.eatenEffectTime = 5;
	this.eatable = false;
	this.position = {"x": 10 * Pacman.gameMapBlockSizeX, "y": 11 * Pacman.gameMapBlockSizeY};
	this.direction = this.getRandomDirection();
	this.newDirection = this.getRandomDirection();
	this.collision = false;
	this.speed = 2;
};

Ghost.prototype.getRandomDirection = function() {
	var newDirection = (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) 
            ? [Direction.UP, Direction.DOWN] : [Direction.LEFT, Direction.RIGHT];
	return newDirection[Math.floor(Math.random() * 2)];
};

Ghost.prototype.draw = function() {	
	Pacman.contextGhost.clearRect(this.position.x - Pacman.gameMapBlockSizeX / 2, this.position.y - Pacman.gameMapBlockSizeX / 2, Pacman.gameMapBlockSizeX * 2, Pacman.gameMapBlockSizeX * 2);
	
	var blockSize = Pacman.gameMapBlockSizeX;
	var top  = (this.position.y/Pacman.gameMapBlockSizeY) * blockSize,
            left = (this.position.x/Pacman.gameMapBlockSizeX) * blockSize;
	
        
        var tl = left + blockSize;
        var base = top + blockSize - 3;
        var inc = blockSize / 10;

        var high = 0 % 10 > 5 ? 3  : -3;
        var low  = 0 % 10 > 5 ? -3 : 3;

		if (this.eaten) {
			Pacman.contextGhost.fillStyle = "#222";
		} else {
			Pacman.contextGhost.fillStyle = (this.eatable === true) ? "#0000BB" : this.colour;
		}
        Pacman.contextGhost.beginPath();

        Pacman.contextGhost.moveTo(left, base);

        Pacman.contextGhost.quadraticCurveTo(left, top, left + (blockSize/2),  top);
        Pacman.contextGhost.quadraticCurveTo(left + blockSize, top, left+blockSize,  base);
        
        Pacman.contextGhost.quadraticCurveTo(tl-(inc*1), base+high, tl - (inc * 2),  base);
        Pacman.contextGhost.quadraticCurveTo(tl-(inc*3), base+low, tl - (inc * 4),  base);
        Pacman.contextGhost.quadraticCurveTo(tl-(inc*5), base+high, tl - (inc * 6),  base);
        Pacman.contextGhost.quadraticCurveTo(tl-(inc*7), base+low, tl - (inc * 8),  base); 
        Pacman.contextGhost.quadraticCurveTo(tl-(inc*9), base+high, tl - (inc * 10), base); 

        Pacman.contextGhost.closePath();
        Pacman.contextGhost.fill();

        Pacman.contextGhost.beginPath();
        Pacman.contextGhost.fillStyle = "#FFF";
        Pacman.contextGhost.arc(left + 6,top + 6, blockSize / 6, 0, 300, false);
        Pacman.contextGhost.arc((left + blockSize) - 6,top + 6, blockSize / 6, 0, 300, false);
        Pacman.contextGhost.closePath();
        Pacman.contextGhost.fill();

        Pacman.contextGhost.beginPath();
        Pacman.contextGhost.fillStyle = "#000";
        Pacman.contextGhost.arc(left+6, top+6, blockSize / 15, 0, 300, false);
        Pacman.contextGhost.arc((left+blockSize)-6, top+6, blockSize / 15, 0, 300, false);
        Pacman.contextGhost.closePath();
        Pacman.contextGhost.fill();
};

Ghost.prototype.move = function() {
	var newPosition = null;
	
	if (this.newDirection !== this.direction) {
		newPosition = this.calculateNewPosition(this.newDirection);
		if ((this.onWholeSquare(this.position) && 
				(this.nextSquareContent(newPosition, this.newDirection) === Pacman.EMPTY ||
				this.nextSquareContent(newPosition, this.newDirection) === Pacman.PELLET ||  
				this.nextSquareContent(newPosition, this.newDirection) === Pacman.PILL))) {
			this.direction = this.newDirection;
		}
	}

	newPosition = this.calculateNewPosition(this.direction);	
	
	if (this.onWholeSquare(this.position) && (this.nextSquareContent(newPosition, this.direction) === Pacman.WALL || this.nextSquareContent(newPosition, this.direction) === false || this.nextSquareContent(newPosition, this.direction) === Pacman.GHOSTBLOCK)) {
		this.newDirection = this.getRandomDirection();
		return this.move();
	}

	this.position = newPosition;
        
	this.newDirection = this.getRandomDirection();
};

Ghost.prototype.calculateNewPosition = function(direction) {
	return {
            "x": this.position.x + (direction === Direction.LEFT && -this.speed || direction === Direction.RIGHT && this.speed || 0),
            "y": this.position.y + (direction === Direction.DOWN && this.speed || direction === Direction.UP    && -this.speed || 0)
	};
};

Ghost.prototype.onWholeSquare = function (position) {
	return position.x % Pacman.gameMapBlockSizeX === 0 && position.y % Pacman.gameMapBlockSizeY === 0; 
};

Ghost.prototype.nextSquareContent = function(position, direction) {
	var nextPositionCoord = this.nextPositionToCoord(position, direction);
	if (nextPositionCoord === null) {
		return false;
	} else {
		return Pacman.currentGameMap[nextPositionCoord.y][nextPositionCoord.x];
	}
};

Ghost.prototype.nextPositionToCoord = function(position, direction) {
	var nextPosition = {};
	nextPosition.y = this.nextSquare(position.y, direction);
	nextPosition.x = this.nextSquare(position.x, direction);
	if (!this.checkPosition(nextPosition)) {
		return null;
	} else {
		return this.positionToCoord(nextPosition);
	}                 
};

Ghost.prototype.checkPosition = function(position) {
	return position.x >= 0 && position.x <= Pacman.canvas.width && position.y >= 0 && position.y <= Pacman.canvas.height; 
};

Ghost.prototype.nextSquare = function(position, direction) {
	var rest = position % Pacman.gameMapBlockSizeX;
	if (rest === 0) { 
		return position; 
	} else if (direction === Direction.RIGHT || direction === Direction.DOWN) { 
		return position + (Pacman.gameMapBlockSizeX - rest);
	} else {
	return position - rest;
	}
};

Ghost.prototype.positionToCoord = function(position) {
	return {
		"x" : Math.round(position.x / Pacman.gameMapBlockSizeX),
		"y" : Math.round(position.y / Pacman.gameMapBlockSizeY),
	};      
};


// END GHOST




function User () {
	position: null;
	prevPosition: null;
	direction: Direction.LEFT;
	newDirection: Direction.LEFT;
	score: null;
	eaten: null;
	lives: null;
	speed: 2;
	underPillEffect: false;
	pillEffectTime: 5;
	dying: false;
	level: false;
};
 
User.prototype.addScore = function(newScore) {
    var score = this.score;
	score += newScore;
	if (score >= 10000 && score - newScore < 10000) {
		this.lives += 1;
	}
};

User.prototype.getPosition = function() {
	return this.position;
};

User.prototype.init = function() {
	this.level = 1;
	this.direction = Direction.LEFT;
	this.newDirection = Direction.LEFT;
	this.score = 0;
	this.lives = 3;
	this.newLevel();
	this.speed = 2;
	this.underPillEffect = false;
	this.pillEffectTime = 5;
	this.defaultPosition();
};

User.prototype.newLevel = function() {
	this.defaultPosition();
	this.prevPosition = this.position; 
	this.eaten = 0;
};

User.prototype.calculateAngle = function(direction, position) { 
	if (direction == Direction.RIGHT && (position.x % Pacman.gameMapBlockSizeX < Pacman.gameMapBlockSizeX / 2)) {
		return {"start":0.25, "end":1.75, "counterclockwise": false};
	} else if (direction === Direction.DOWN && (position.y % Pacman.gameMapBlockSizeY < Pacman.gameMapBlockSizeY / 2)) { 
		return {"start":0.75, "end":2.25, "counterclockwise": false};
	} else if (direction === Direction.UP && (position.y % Pacman.gameMapBlockSizeY < Pacman.gameMapBlockSizeY / 2)) { 
		return {"start":1.25, "end":1.75, "counterclockwise": true};
	} else if (direction === Direction.LEFT && (position.x % Pacman.gameMapBlockSizeX < Pacman.gameMapBlockSizeX / 2)) {             
		return {"start":0.75, "end":1.25, "counterclockwise": true};
	}
	return {"start":0, "end":2, "direction": false};
};

User.prototype.draw = function() {
	Pacman.contextPlayer.clearRect(this.prevPosition.x - Pacman.gameMapBlockSizeX / 2, this.prevPosition.y - Pacman.gameMapBlockSizeX / 2, Pacman.gameMapBlockSizeX * 2, Pacman.gameMapBlockSizeX * 2);

	Pacman.contextPlayer.fillStyle = "#FFFF00";
	
	Pacman.contextPlayer.lineWidth   = 1.5;
	Pacman.contextPlayer.lineCap     = "round";

	var angle = this.calculateAngle(this.direction, this.position);        
       
	Pacman.contextPlayer.beginPath();        

	Pacman.contextPlayer.moveTo(this.position.x + Pacman.gameMapBlockSizeX / 2, this.position.y + Pacman.gameMapBlockSizeY / 2);
        
    Pacman.contextPlayer.arc(this.position.x + Pacman.gameMapBlockSizeX / 2, this.position.y + Pacman.gameMapBlockSizeY / 2,
           8, Math.PI * angle.start, Math.PI * angle.end, angle.counterclockwise); 
        
    Pacman.contextPlayer.fill();
};

User.prototype.drawOnTable = function(x) {
	Pacman.contextTable.fillStyle = "#FFFF00";
	
	Pacman.contextTable.lineWidth   = 1.5;
	Pacman.contextTable.lineCap     = "round";
       
	Pacman.contextTable.beginPath();        

	Pacman.contextTable.moveTo(x, 545);
    
    Pacman.contextTable.arc(x, 545, 8, Math.PI * 0.25, Math.PI * 1.75, false); 
        
    Pacman.contextTable.fill();
};

User.prototype.defaultPosition = function () {
	this.position = {"x": 14 * Pacman.gameMapBlockSizeX, "y": 23 * Pacman.gameMapBlockSizeY}; 
};

User.prototype.onWholeSquare = function (position) {
	return position.x % Pacman.gameMapBlockSizeX === 0 && position.y % Pacman.gameMapBlockSizeY === 0; 
};

User.prototype.checkPosition = function(position) {
	return position.x >= 0 && position.x <= Pacman.canvas.width && position.y >= 0 && position.y <= Pacman.canvas.height; 
};

User.prototype.nextSquare = function(position, direction) {
	var rest = position % Pacman.gameMapBlockSizeX;
	if (rest === 0) { 
		return position; 
	} else if (direction === Direction.RIGHT || direction === Direction.DOWN) { 
		return position + (Pacman.gameMapBlockSizeX - rest);
	} else {
	return position - rest;
	}
};

User.prototype.positionToCoord = function(position) {
	return {
		"x" : Math.round(position.x / Pacman.gameMapBlockSizeX),
		"y" : Math.round(position.y / Pacman.gameMapBlockSizeY),
	};      
};

User.prototype.nextPositionToCoord = function(position, direction) {
	var nextPosition = {};
	nextPosition.y = this.nextSquare(position.y, direction);
	nextPosition.x = this.nextSquare(position.x, direction);
	if (!this.checkPosition(nextPosition)) {
		return null;
	} else {
		return this.positionToCoord(nextPosition);
	}                 
};

User.prototype.nextSquareContent = function(position, direction) {
	var nextPositionCoord = this.nextPositionToCoord(position, direction);
	if (nextPositionCoord === null) {
		return false;
	} else {
		return Pacman.currentGameMap[nextPositionCoord.y][nextPositionCoord.x];
	}
};

User.prototype.isOnSamePlane = function (newDirection, direction) { 
	return ((newDirection === Direction.LEFT || newDirection === Direction.RIGHT) && 
			(direction === Direction.LEFT || direction === Direction.RIGHT)) || 
			((newDirection === Direction.UP || newDirection === Direction.DOWN) && 
			(direction === Direction.UP || direction === Direction.DOWN));
};

User.prototype.move = function() {
	var newPosition = null,
		square = null,
		newPositionToCoord = null;
		
	if (this.newDirection !== this.direction) {
		newPosition = this.calculateNewPosition(this.newDirection);
		if (this.isOnSamePlane(this.newDirection, this.direction) || 
				(this.onWholeSquare(this.position) && 
				(this.nextSquareContent(newPosition, this.newDirection) === Pacman.EMPTY || 
				this.nextSquareContent(newPosition, this.newDirection) === Pacman.PELLET ||
				this.nextSquareContent(newPosition, this.newDirection) === Pacman.GHOSTBLOCK || 
				this.nextSquareContent(newPosition, this.newDirection) === Pacman.PILL))) {
			this.direction = this.newDirection;
		}
	}
	
	newPosition = this.calculateNewPosition(this.direction);
	
	if (this.onWholeSquare(this.position) && (this.nextSquareContent(newPosition, this.direction) === Pacman.WALL || this.nextSquareContent(newPosition, this.direction) === false)) {
		this.position = this.prevPosition;
		newPosition = this.position;
	}
	
	if (newPosition.y === 224 && newPosition.x <= -Pacman.gameMapBlockSizeX + 2 && this.newDirection === Direction.LEFT) {
            newPosition = {"y": 224, "x": 440};
	}
	
	if (newPosition.y === 224 && newPosition.x >= 448 && this.newDirection === Direction.RIGHT) {
            newPosition = {"y": 224, "x": 0};
	}
	
	this.position = newPosition;	
	
	var squareContent = this.nextSquareContent(this.position, this.direction);

	if ((newPosition.x % Pacman.gameMapBlockSizeX === 2 || newPosition.y % Pacman.gameMapBlockSizeY === 2) &&
            (squareContent === Pacman.PELLET || squareContent === Pacman.PILL)) {
        var nextSquareCoord = this.nextPositionToCoord(this.position, this.direction);
		
// ACTIVATE PILL
		if (Pacman.currentGameMap[nextSquareCoord.y][nextSquareCoord.x] === Pacman.PILL) {
			this.underPillEffect = true;
			for (i = 0; i < ghosts.length; i++) {
				ghosts[i].eatable = true;
			}
			
		clearInterval(Pacman.ghostsMoveIntervalId);
		Pacman.ghostMoveSpeed = 1000 / 30;
        	
		Pacman.ghostsMoveIntervalId = setInterval(function () {
			if (!Pacman.gamePaused && !Pacman.gameOver && Pacman.gameStarted) {
				for (i = 0; i < ghosts.length; i += 1) {
					ghosts[i].move();
				}
			}
		}, Pacman.ghostMoveSpeed);
			
			setTimeout(function(){
				for (i = 0; i < ghosts.length; i++) {
					ghosts[i].eatable = false;
				}
				clearInterval(Pacman.ghostsMoveIntervalId);
				Pacman.ghostMoveSpeed = 1000 / 60;
				
				Pacman.ghostsMoveIntervalId = setInterval(function () {
					if (!Pacman.gamePaused && !Pacman.gameOver && Pacman.gameStarted) {
						for (i = 0; i < ghosts.length; i += 1) {
							ghosts[i].move();
						}
					}
				}, Pacman.ghostMoveSpeed);
				
				user.underPillEffect = false;
			}, 1000 * this.pillEffectTime);
		}
		
		Pacman.currentGameMap[nextSquareCoord.y][nextSquareCoord.x] = Pacman.EMPTY;

		this.score += (squareContent === Pacman.PELLET) ? 10 : 50;            
        this.eaten += 1;
        
		if (this.eaten === 244) {
			Pacman.completedLevel();
		}
	}  

	this.prevPosition = this.position; 
};

User.prototype.calculateNewPosition = function(direction) {
	return {
            "x": this.position.x + (direction === Direction.LEFT && -this.speed || direction === Direction.RIGHT && this.speed || 0),
            "y": this.position.y + (direction === Direction.DOWN && this.speed || direction === Direction.UP    && -this.speed || 0)
	};
};
		
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
					user.newDirection = Direction.LEFT;
				break;

				case 38: // up
				case 87: // w
					user.newDirection = Direction.UP;
				break;

				case 39: // right
				case 68: // d
					user.newDirection = Direction.RIGHT;
				break;

				case 40: // down
				case 83: // s
					user.newDirection = Direction.DOWN;
				break;
				
				case 80: // (p) - pause
					Pacman.gamePaused = (Pacman.gamePaused === false) ? true : false;
				break;
				
				case 78: // (n) - 78
					Pacman.newGame();
				break;

        		default:
        		return; // exit this handler for other keys
    		}
		});
		
		function init () {			
			Pacman.init();
			
    		loop();
		}
		
		function update() {
			// check collision
			for (i = 0; i < ghosts.length; i++) {
				if ((Math.sqrt(Math.pow(ghosts[i].position.x - user.position.x, 2) + Math.pow(ghosts[i].position.y - user.position.y, 2))) < Pacman.gameMapBlockSizeX) {
					if (user.underPillEffect) {
						if (!ghosts[i].eaten) {
							ghosts[i].eaten = true;
							var eatenGhost = ghosts[i]; 
							setTimeout(function(){
								eatenGhost.eaten = false;
							}, 1000 * ghosts[i].eatenEffectTime);
							console.log("eat ghost");
						}
					} else {
						if (!ghosts[i].collision) {
							ghosts[i].collision = true;
							user.lives -= 1;
							console.log(user.lives);
							if (user.lives <= 0) {
								Pacman.gameOver = true;
								Pacman.gameOverAnimation();
							}
						}
					}
				} else {
					ghosts[i].collision = false;
				}
			}
		}
		
		function render() {
			if (!Pacman.gameOver && !Pacman.gamePaused) {
				Pacman.contextTable.clearRect(0, 30, 448, 530);
			}
			Pacman.gamePausedText();
			Pacman.drawCountingdown();
			Pacman.drawTable();
			drawMap();
			user.draw();
			for (i = 0; i < ghosts.length; i += 1) {
				ghosts[i].draw();
			}
			
			if (!Pacman.gameStarted && !Pacman.countingdown) {
				Pacman.contextTable.fillStyle = "#FFFF00";
				Pacman.contextTable.font = "25px GoodDog";
	
  				Pacman.contextTable.fillText("PRESS N TO START A NEW GAME", 20, Pacman.canvas.height / 2);
			}
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
		Pacman.USERBLOCK   = 3;
		Pacman.PILL    = 4;
		Pacman.GHOSTBLOCK   = 5;
		
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
			[2, 2, 2, 2, 2, 5, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 5, 2, 2, 2, 2, 2],
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
