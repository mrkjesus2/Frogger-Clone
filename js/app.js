/*************
** Settings **
*************/
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
// TODO: Get the powerups applied to the player
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
        case 'images/key.png' :
            //call key method - Probably don't use this
            break;
        case 'images/rock.png' :
            //Probably don't use this
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
        player.reset();
        // TODO: Add to the score here
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

/******************
** Instantiation **
******************/

// Now instantiate your objects.
var allEnemies = [];
var player = new Player();
var powerUp = new PowerUp();
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

console.log('Here for tests');

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