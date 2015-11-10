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
var powerUpSprites = ['images/Gem Blue.png',
                      'images/Gem Green.png',
                      'images/Gem Orange.png',
                      'images/Heart.png',
                      'images/Key.png',
                      'images/Rock.png',
                      'images/Star.png'];

// Get random integer from 0 to num-1
function getRandom(num) {
    return Math.floor(Math.random() * num);
}

// TODO: Add gem collision test
function checkCollisions() {
    // 30 is the empty margin for the player sprite
    allEnemies.forEach(function(enemy) {
        if (player.x < enemy.x + enemy.width - 30 &&
            player.x + player.width - 30 > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y + 14) {
                player.reset();
        }
    });
    if (player.x < powerUp.x + powerUp.width &&
        player.x + player.width > powerUp.x &&
        player.y < powerUp.y + powerUp.height &&
        player.y + player.height > powerUp.y + 14) {
            //TODO: Call powerUp logic here
            console.log('Power Up');
    }
}

/********************
** Character Class **
********************/
var Character = function() {
    this.width = 100;
    this.height = 80;
};

// TODO: Add visible x possibility
Character.prototype.place = function() {
    var row = getRandom(3); // get a number 0-2
    var col = getRandom(5); //get a number 0-4
    this.y = row === 0 ? 60 : 60 + 85 * row; // place enemy in a row
    if(this instanceof Enemy) {
        this.x = col * -101; // place enemy in a column
    } else {
        this.x = col * 101;
    }
};

/*********************
** Power Up Related **
*********************/
var PowerUp = function() {
    Character.call(this);
    this.place();
    this.sprite = powerUpSprites[4]; //Placeholder while writing class
};

PowerUp.prototype = Object.create(Character.prototype);

PowerUp.prototype.constructor = Character;

PowerUp.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
        // console.log(this.speed);
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

console.log(powerUp instanceof Enemy);

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