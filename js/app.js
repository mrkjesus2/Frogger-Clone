/*************
** Settings **
*************/
var speed = 200;

// Get random integer from 0 to num-1
function getRandom(num) {
    return Math.floor(Math.random() * num);
}

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
// This class requires an update(), render() and
// a handleInput() method.

};

Player.prototype.update = function() {
    // TODO: Write the update function
};

Player.prototype.render = function() {
    // TODO: Write the render function
};

Player.prototype.handleInput = function() {
    // TODO: Write the function
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