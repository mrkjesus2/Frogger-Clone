// Enemies our player must avoid
var Enemy = function() {
    // Enemy Location
    // TODO: Randomly generate row, speed, number of enemies?

    // Enemy Image
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // multiply any movement by the dt parameter
    // which will ensure the game runs at same speed
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();


// This listens for key presses and sends the keys to your
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
