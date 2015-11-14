/*************
** Settings **
*************/
// Startscreen of Play?
var ready = false;

// Sprite arrays
var playerSprites = ['images/char-boy.png',
                     'images/char-cat-girl.png',
                     'images/char-horn-girl.png',
                     'images/char-pink-girl.png',
                     'images/char-princess-girl.png'];
var powerUpSprites = ['images/gem-blue.png',
                      'images/gem-green.png',
                      'images/gem-orange.png',
                      'images/Heart.png',
                      'images/Star.png'
                      // 'images/Key.png',
                      // 'images/Rock.png',
                      ];

// Helper arrays
//TODO: Get highscores going
var highScores = [1003, 568, 12, 9];
var level = 'normal'; // Need default value
var buttons = []; // Used to pass buttons to checkButtonClick()


/*********************
** Helper Functions **
*********************/

// Get random integer from 0 to num-1
function getRandom(num) {
    return Math.floor(Math.random() * num);
}

// Check if our hero collides with given object
function checkCollisions(obj) {
    if (player.x + 30 < obj.x + obj.width &&
        player.x + player.width -30 > obj.x &&
        player.y < obj.y + obj.height &&
        player.y + player.height > obj.y + 14) {
            return true;
    }
    return false;
}

function getClickPosition(event) {
    // http://stackoverflow.com/questions/6148065/html5-canvas-buttons
    // removed lines I deemed unnecessary in this instance and condensed
    var x, y;
    if (event.x !== undefined && event.y !== undefined) {
        x = event.x;
        y = event.y;
    }
    mouseX = x - ctx.canvas.offsetLeft - window.pageXOffset;
    mouseY = y - ctx.canvas.offsetTop - window.pageYOffset;
    //All me
    var click= [mouseX, mouseY];
    checkButtonClick(buttons, click);
}

function checkButtonClick(buttons, click) {
    buttons.forEach(function(button) {
        if (button.x < click[0] &&
            click[0] < button.x + button.width &&
            button.y < click[1] &&
            click[1] < button.y + button.height) {
                switch (button.name) {
                    case 'Select Player' :
                        playerSelect();
                        break;
                    case 'Select Level' :
                        levelSelect();
                        break;
                    case 'Start Game' :
                        ready = true;
                        break;
                    case 'Easy' :
                        level = 'easy';
                        generateEnemies(level);
                        StartScreen();
                        break;
                    case 'Normal' :
                        level = 'normal';
                        generateEnemies(level);
                        StartScreen();
                        break;
                    case 'Hard' :
                        level = 'hard';
                        generateEnemies(level);
                        StartScreen();
                        break;
                    case 'New Game' :
                        location.reload();
                        break;
                    default :
                        player.sprite = playerSprites[button.name];
                        StartScreen();
                        break;
                }
        }
    });
}


/********************
** Character Class **
********************/
var Character = function() {
    this.width = 100;
    this.height = 80;
};

Character.prototype.place = function() {
    var row = getRandom(3); // get a number 0-2
    var col = getRandom(5); //get a number 0-4
    this.y = row === 0 ? 60 : 60 + 85 * row; // place enemy in a row
    if(this instanceof Enemy) {
        col = getRandom(10);
        this.x = col * -101; // place enemy in a column
    } else {
        this.x = col * 101; // place powerUp in a column
    }
};

/*********************
** Power Up Related **
*********************/
// TODO: Can this be prettier?
var PowerUp = function() {
    Character.call(this);
    this.sprite = powerUpSprites[getRandom(4)];
    //Randomly generate and remove powerups
    var time = getRandom(50000) + 10000;
    setTimeout(function() {
        powerUp.place();
        setTimeout(function() {
            powerUp = new PowerUp();
        }, getRandom(10000) + 5000 + time);
    }, time);

};

PowerUp.prototype = Object.create(Character.prototype);

PowerUp.prototype.constructor = Character;

PowerUp.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

PowerUp.prototype.apply = function() {
    switch (this.sprite) {
        case 'images/gem-blue.png' :
            powerUp = new PowerUp();
            player.addToScore(2);
            break;
        case 'images/gem-green.png' :
            powerUp = new PowerUp();
            player.addToScore(5);
            break;
        case 'images/gem-orange.png' :
            powerUp = new PowerUp();
            player.addToScore(10);
            break;
        case 'images/Heart.png' :
            powerUp = new PowerUp();
            player.addToLife(2);
            break;
        case 'images/Star.png' :
            //call invincibility method
            break;
        default :
            break;
    }
};

/******************
** Enemy Related **
******************/

// TODO: Make sure that enemies are spaced out, take a life
var Enemy = function() {
    Character.call(this);
    this.place();
    this.speed = this.getSpeed();
    this.sprite = 'images/enemy-bug.png'; // Image for enemies
};

Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.constructor = Character;

Enemy.prototype.getSpeed = function() {
    this.speed = getRandom(151)+150;
};

Enemy.prototype.update = function(dt) {
    // Update the enemy position, Parameter: dt, time delta between ticks
    // Move enemy if out of bounds
    if (this.x < ctx.canvas.width) {
        this.x += this.speed * dt; //dt smooths perf across cpus
    } else {
        this.place();
        this.getSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

function generateEnemies(level) {
    // Clear previous enemies
    allEnemies = [];
    // Generate enemies based on level
    var numberEnemies = level === 'easy' ? 3 : level === 'hard' ? 7 : 5;
    for (var i = 0; i < numberEnemies; i++) {
        allEnemies.push(new Enemy());
    }
}

/*******************
** Player related **
*******************/
var Player = function() {
    Character.call(this);
    this.reset();
    this.score = 0;
    this.lives = 1;
    this.sprite = playerSprites[0];
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.constructor = Character;

Player.prototype.update = function() {
    // Reset when the player hits the water
    if (this.y < 0) {
        player.reset();
        player.addToScore(1);
        // TODO: Add a short congratulations message
    }
};

Player.prototype.reset = function() {
        this.x = 202;
        this.y = 410;
};

Player.prototype.render = function() {
    // TODO: Edit player for powerup states?
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    // TODO: Refactor in case we add more columns
    switch (key) {
        case 'up':
            if (this.y > 0) {
                this.y -= 83;
            }
            break;
        case 'down':
            if (this.y < 410) {
                this.y += 83;
            }
            break;
        case 'left':
            if (this.x > 0) {
                this.x -= 101;
            }
            break;
        case 'right':
            if (this.x < ctx.canvas.width - 101) {
                this.x += 101;
            }
            break;
        default:
            break;
    }
};

Player.prototype.addToScore = function(points) {
    this.score += points;
};

Player.prototype.addToLife = function(lives) {
    this.lives += lives;
    if (this.lives === 0) {
        //gameOver();
        ready = false;
    }
};

/*****************
** Start Screen **
*****************/
//Used for buttons and high scores
var textStyle = function() {
    ctx.font = '24pt Impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
};

// Used for score board and end screen
var largeTextStyle = function() {
    ctx.font = '36pt Impact';
    ctx.textAlign = 'start';
    ctx.fillStyle = 'blue';
    ctx.strokeColor = 'black';
    ctx.lineWidth = 3;
};

var clearButtons = function() {
    ctx.fillStyle = 'rgba(155, 145, 145, 0.5)';
    ctx.clearRect(0, 250, 505, 450);
    ctx.fillRect(0, 250, 505, 450);
};

var Button = function(text, xstart, ystart, col) {
    this.name = text;
    this.width = ctx.canvas.width/col-30;
    this.height = ctx.canvas.height/6;
    this.x = xstart;
    this.y = ystart;

    //Make Button
    ctx.fillStyle = 'orange';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    textStyle();

    //Create Text
    ctx.strokeText(text, xstart + this.width/2, ystart + 65);
    ctx.fillText(text, xstart + this.width/2, ystart + 65);
};

var clearScreen = function() {
    // Reset
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //Background
    ctx.fillStyle = 'rgba(155, 145, 145, 0.5)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

var StartScreen = function() {
    clearScreen();
    highScores();

    // Make Select Buttons
    this.levelButton = new Button('Select Level', 20, 350, 2);
    this.playerButton = new Button('Select Player', 263, 350, 2);
    this.startButton = new Button('Start Game', 141, 500, 2);

    // Assign buttons for checkButtonClick
    buttons = [
        this.levelButton,
        this.playerButton,
        this.startButton
    ];
};

var highScores = function() {
// Hi Scores Box
    ctx.fillStyle = 'orange';
    ctx.fillRect(10, 10, ctx.canvas.width - 20, ctx.canvas.height / 3);

    textStyle();
    //Hi-Scores
    ctx.strokeText('Hi-Scores', ctx.canvas.width/2, 40);
    ctx.fillText('Hi-Scores', ctx.canvas.width/2, 40);
};

var levelSelect = function() {
    clearButtons();

    // Create the level buttons
    this.easy = new Button('Easy', 20, 350, 3);
    this.normal = new Button('Normal', 182, 350, 3);
    this.hard = new Button('Hard', 345, 350, 3);

    // Assign for buttonClickCheck()
    buttons = [this.easy, this.normal, this.hard];
};

var playerSelect = function() {
    clearButtons();

    // Initial Position
    var x = 0;
    var y = 350;
    buttons = [];

    // Draw each Character
    playerSprites.forEach(function(player, index) {
        buttons.push(new Button(index, x + 15, y, 5));
        ctx.drawImage(Resources.get(player), x, y - 40);
        x += 101;
    });
};

/***************
** End Screen **
***************/
var endScreen = function() {
    clearScreen();
    highScores();

    largeTextStyle();
    ctx.textAlign = 'center';

    ctx.fillText('Game Over', 250, 325);
    ctx.strokeText('Game Over', 250, 325);
    // Draw player score
    ctx.fillText('Your Score: ' + player.score, 250, 425);
    ctx.strokeText('Your Score: ' + player.score, 250, 425);
    // Notify if high score
    // New Game Button
    this.newGame = new Button('New Game', 15, 500, 1);

    buttons = [this.newGame];
};

/****************
** Score Board **
****************/

var ScoreBoard = function() {
    // Reset the canvas
    ctx.clearRect(0, 585, 505, 100);
    // Draw the background
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 585, 505, 100);

    largeTextStyle();

    //Draw the score
    ctx.fillText('Score: ' + player.score, 250, 655);
    ctx.strokeText('Score: ' + player.score, 250, 655);
    //Draw the remaining lives
    ctx.fillText('Lives: ' + player.lives, 20, 655);
    ctx.strokeText('Lives: ' + player.lives, 20, 655);
};

/******************
** Instantiation **
******************/
var allEnemies = [];
var player = new Player();
var powerUp = new PowerUp();
var startScreen;
generateEnemies(level);
// console.log(ScoreBoard);

// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});