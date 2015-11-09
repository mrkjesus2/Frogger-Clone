/*************
** Settings **
*************/
var speed = 200;
var playerSprite = 'images/char-boy.png';

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
    var col = getRandom(6); //get a number 0-5
    this.x = col * -101; // place enemy in a column
    this.y = row === 0 ? 60 : 60 + 85 * row; // place enemy in a row
};

/******************
** Enemy Related **
******************/

// TODO: Random speed, number of enemies?
// Enemies our player must avoid
var Enemy = function() {
    // Enemy Location
    Character.call(this);
    this.place();
    this.sprite = 'images/enemy-bug.png'; // Image for enemies
};

Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.constructor = Character;

Enemy.prototype.update = function(dt) {
// Update the enemy position, Parameter: dt, time delta between ticks
    // Move enemy if out of bounds
    if (this.x < ctx.canvas.width) {
        this.x += speed * dt; //dt smooths perf across cpus
    } else {
        this.place();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*******************
** Player related **
*******************/

// Player class
var Player = function() {
    // TODO: Replace this.x and this.y with player.reset()?
    Character.call(this);
    this.x = 202;
    this.y = 410;
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
    // TODO: Write the render function
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
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
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

console.log(typeof allEnemies[0]);
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