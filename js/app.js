/*************
** Settings **
*************/
var ready = false;
var playerSprite = 'images/char-boy.png';
//For when I add player select - Do I want to use Selector.png?
var playerSprites = ['images/char-boy.png',
                     'images/char-cat-girl.png',
                     'images/char-horn-girl.png',
                     'images/char-pink-girl.png',
                     'images/char-princess-girl.png'];
var powerUpSprites = ['images/gem-blue.png',
                      'images/gem-green.png',
                      'images/gem-orange.png',
                      'images/heart.png',
                      'images/key.png',
                      'images/rock.png',
                      'images/star.png'];
var highScores = [1003, 568, 12, 9];
var levels = ['easy', 'medium', 'hard'];

// Get random integer from 0 to num-1
function getRandom(num) {
    return Math.floor(Math.random() * num);
}

function checkCollisions(obj) {
    if (player.x < obj.x + obj.width &&
        player.x + player.width > obj.x &&
        player.y < obj.y + obj.height &&
        player.y + player.height > obj.y + 14) {
            return true;
    }
    return false;
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
        this.x = col * -101; // place enemy in a column
    } else {
        this.x = col * 101; // place powerUp in a column
    }
};

/*********************
** Power Up Related **
*********************/
var PowerUp = function() {
    Character.call(this);
    this.sprite = powerUpSprites[3]; //Placeholder while writing class
    setTimeout(function() {
        powerUp.place();
    }, getRandom(5000));
};

PowerUp.prototype = Object.create(Character.prototype);

PowerUp.prototype.constructor = Character;

PowerUp.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

PowerUp.prototype.apply = function() {
    switch (this.sprite) {
        case 'images/gem-blue.png' :
            player.addToScore(2);
            break;
        case 'images/gem-green.png' :
            player.addToScore(5);
            break;
        case 'images/gem-orange.png' :
            player.addToScore(10);
            break;
        case 'images/heart.png' :
            player.addToLife(2);
            break;
        case 'images/star.png' :
            //call invincibility method
            break;
        default :
            break;
    }
};

/******************
** Enemy Related **
******************/
// TODO: Random number of enemies?
var Enemy = function() {
    Character.call(this);
    this.place();
    this.speed = this.getSpeed();
    this.sprite = 'images/enemy-bug.png'; // Image for enemies
};

Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.constructor = Character;

Enemy.prototype.getSpeed = function() {
    // TODO: Varying speed based on level
    this.speed = getRandom(201)+200;
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

/*******************
** Player related **
*******************/
var Player = function() {
    Character.call(this);
    this.reset();
    this.score = 0;
    this.lives = 5;
    this.sprite = playerSprite;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.constructor = Character;

Player.prototype.update = function() {
    // Reset when the player hits the water
    if (this.y < 0) {
        // player.reset();
        player.addToScore(1);
        // TODO: Add a short congratulations message
    }
};

Player.prototype.reset = function() {
    setTimeout(function() {
        player.x = 202;
        player.y = 410;
    }, 100);
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

// TODO: Make sure addTo functions only add once per call
Player.prototype.addToScore = function(points) {
    this.score += points;
};

Player.prototype.addToLife = function(lives) {
    this.lives += lives;
};

/*****************
** Start Screen **
*****************/
var Button = function(text, xstart, ystart, col) {
    this.name = text;
    this.width = ctx.canvas.width/col-30;
    this.height = ctx.canvas.height/6;
    this.x = xstart;
    this.y = ystart;

    //Make Button
    ctx.fillStyle = 'orange';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    //Text Style
    ctx.font = '24pt Impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    //Create Text
    ctx.strokeText(text, xstart + this.width/2, ystart + 65);
    ctx.fillText(text, xstart + this.width/2, ystart + 65);
};


var StartScreen = function() {
        //Background
        ctx.fillStyle = 'rgba(155, 145, 145, 0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Hi Scores Box
        ctx.fillStyle = 'orange';
        ctx.fillRect(10, 10, ctx.canvas.width - 20, ctx.canvas.height / 3);

        //Text Style
        ctx.font = '24pt Impact';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        //Hi-Scores
        ctx.strokeText('Hi-Scores', ctx.canvas.width/2, 40);
        ctx.fillText('Hi-Scores', ctx.canvas.width/2, 40);

        // Select Buttons
        this.levelButton = new Button('Select Level', 20, 350, 2);
        this.playerButton = new Button('Select Player', 263, 350, 2);
        this.startButton = new Button('Start Game', 141, 500, 2);
};

var LevelSelect = function() {
    ctx.fillStyle = 'rgba(155, 145, 145, 0.5)';
    ctx.clearRect(0, 250, 505, 450);
    ctx.fillRect(0, 250, 505, 450);
    this.easy = new Button('Easy', 20, 350, 3);
    this.normal = new Button('Normal', 182, 350, 3);
    this.hard = new Button('Hard', 345, 350, 3);
};

var PlayerSelect = function() {
    ctx.fillStyle = 'rgba(155, 145, 145, 0.5)';
    ctx.clearRect(0, 250, 505, 450);
    ctx.fillRect(0, 250, 505, 450);
    var x = 0;
    var y = 350;
    playerSprites.forEach(function(player) {
        ctx.drawImage(Resources.get(player), x, y);
        x += 101;
    });
};

function getClickPosition(event) {
    // http://stackoverflow.com/questions/6148065/html5-canvas-buttons
    var x, y;
    if (event.x !== undefined && event.y !== undefined) {
        x = event.x;
        y = event.y;
    }
    // else {
    //     x = event.clientX + document.body.scrollLeft +document.documentElement.scrollLeft;
    //     y = event.clientY + document.body.scrollTop +document.documentElement.scrollTop;
    // }
    mouseX = x - ctx.canvas.offsetLeft - window.pageXOffset;
    mouseY = y - ctx.canvas.offsetTop - window.pageYOffset;
    //All me
    var click= [mouseX, mouseY];
    var buttons = [
        startScreen.levelButton,
        startScreen.playerButton,
        startScreen.startButton
    ];
    checkButtonClick(buttons, click);
    console.log(mouseX + '-' + mouseY);
}

function checkButtonClick(buttons, click) {
    buttons.forEach(function(button) {
        if (button.x < click[0] &&
            click[0] < button.x + button.width &&
            button.y < click[1] &&
            click[1] < button.y + button.height) {
                switch (button.name) {
                    case 'Select Player' :
                        PlayerSelect();
                        console.log('Hey Playa, Playa');
                        break;
                    case 'Select Level' :
                        LevelSelect();
                        console.log('You make it easy');
                        break;
                    case 'Start Game' :
                        ready = true;
                        break;
                    default :
                        break;
                }
        }
    });
}

/****************
** Score Board **
****************/

var ScoreBoard = function() {
    // Reset the canvas
    ctx.clearRect(0, 585, 505, 100);
    // Draw the background
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 585, 505, 100);

    ctx.font = '36pt Impact';
    ctx.textAlign = 'start';
    ctx.fillStyle = 'blue';
    ctx.strokeColor = 'black';
    ctx.lineWidth = 3;
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

// Now instantiate your objects.
var allEnemies = [];
var player = new Player();
var powerUp = new PowerUp();
var startScreen;
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
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