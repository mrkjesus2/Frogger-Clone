/*************
** Settings **
*************/
var speed = 200;
var playerSprite = 'images/char-boy.png';

// Get random integer from 0 to num-1
function getRandom(num) {
    return Math.floor(Math.random() * num);
}

function checkCollisions() {
    // 20 is the empty margin for the player sprite
    allEnemies.forEach(function(enemy) {
        if (player.x < enemy.x + enemy.width - 20 && // plyr lftsd lft of enmy rtsd
            player.x + player.width - 20 > enemy.x && // plyr rtsd rt of enmy lftsd
            player.y < enemy.y + enemy.height && // plyr tp abv enmy btm
            player.y + player.height > enemy.y + 14) { // plyr btm blw enm tp
                console.log('Collision');
            }
    });
}

/********************
** Character Class **
********************/
// Keep if the widths of player and enemy can be the same
var Character = function() {
    this.width = 100;
    this.height = 80;
};

/******************
** Enemy Related **
******************/

// TODO: Random speed, number of enemies?
// Enemies our player must avoid
var Enemy = function() {
    // Enemy Location
    var row = getRandom(3); // get a number 0-2
    var col = getRandom(6); //get a number 0-5

    this.x = col * -101; // place enemy in a column
    this.y = row === 0 ? 60 : 60 + 85 * row; // place enemy in a row
    this.width = 100;
    this.height = 80;
    this.sprite = 'images/enemy-bug.png'; // Image for enemies
};

// Update the enemy position, Parameter: dt, time delta between ticks
Enemy.prototype.update = function(dt) {
    var obj = null; // keep memory in check I think
    // Check for out of bounds - move or remove
    if (this.x < ctx.canvas.width) {
        this.x += speed * dt; //dt smooths perf across cpus
    } else {
        // Probably a more elegant way
        obj = new Enemy();
        this.x = obj.x;
        this.y = obj.y;
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
    // initial location
    this.x = 202;
    this.y = 410;
    this.width = 100;
    this.height = 80;
    this.sprite = playerSprite;
};

Player.prototype.update = function() {
    // TODO: Write the update function
    // console.log(this.y);
    if (this.y < 0) {
        // Add to the score here
        // Add a short congratulations message
       setTimeout(function() {
            player.x = 202;
            player.y = 410;
       }, 150);
    }
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
// allEnemies.push(new Enemy());
// allEnemies.push(new Enemy());

console.log(player.x < allEnemies[0].x + allEnemies[0].width);
console.log(player.x + player.width > allEnemies[0].x);
console.log(player.y < allEnemies[0].y + allEnemies[0].height);
console.log(player.y + player.height > allEnemies[0].y);
console.log(player.y + " " + player.height);
console.log(allEnemies[0].y + ' ' + allEnemies[0].height);

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