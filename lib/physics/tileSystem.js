(function () {"use strict";})();
/**
 * Created by apizzimenti on 5/19/16.
 */


/*
    directions:


         ^
         1
    < 2    0 >
         3
         ˘
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc If the Sprite is auto-loaded, analyze direction; otherwise, wait.
 *
 * @param Sprite {Animal | Player | Item} Object containing a Phaser isometric sprite.
 *
 * @see Animal
 * @see Player
 * @see Item
 */

function direction (Sprite) {
    
    if (Sprite.auto) {
        _assignDirection(Sprite);
    }
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Computes the current direction of the given Sprite.
 *
 * @param Sprite {Animal | Player | Item} Object containing a Phaser isometric sprite.
 *
 * @private
 */

function _assignDirection (Sprite) {
    
    var sprite = Sprite.sprite,
        x = sprite.body.frontX,
        y = sprite.body.frontY,
        tileMap = Sprite.map.tileMap,
        tileSize = Sprite.map.tileSize,
        row = Math.ceil(x / tileSize) >= tileMap.length - 1 ? tileMap.length - 1 : Math.ceil(x / tileSize),
        col = Math.ceil(y / tileSize) >= tileMap[0].length - 1 ? tileMap[0].length - 1 : Math.ceil(y / tileSize),
        dir = sprite.direction,
        r = determineTileRadius(tileMap.length, row),
        c = determineTileRadius(tileMap[0].length, col),
        rp = r.p,
        rm = r.m,
        cp = c.p,
        cm = c.m;
    
    sprite.row = row;
    sprite.col = col;
    
    sprite.tile.center = tileMap[row][col];
    
    switch (dir) {
        case 0:
            sprite.tile.top = tileMap[rp][col];
            sprite.tile.left = tileMap[row][cm];
            sprite.tile.right = tileMap[row][cp];
            sprite.tile.bottom = tileMap[rm][col];
            
            break;
        
        case 1:
            sprite.tile.top = tileMap[row][cm];
            sprite.tile.left = tileMap[rm][col];
            sprite.tile.right = tileMap[rp][col];
            sprite.tile.bottom = tileMap[row][cp];
            
            break;
        
        case 2:
            sprite.tile.top = tileMap[rm][col];
            sprite.tile.left = tileMap[row][cp];
            sprite.tile.right = tileMap[row][cm];
            sprite.tile.bottom = tileMap[rp][col];
            
            break;
        
        case 3:
            sprite.tile.top = tileMap[row][cp];
            sprite.tile.left = tileMap[rp][col];
            sprite.tile.right = tileMap[rm][col];
            sprite.tile.bottom = tileMap[row][cm];
            
            break;
    }
    
    sprite.loadTexture(Sprite.keys[dir]);
    
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Determines whether a dimension is within a range.
 *
 * @param length {number} Length of containing array.
 * @param dim {number} Row or column number.
 *
 * @returns {{m: number, p: number}} Adjusted +/- dimensions.
 */

function determineTileRadius (length, dim) {

    return {
        m: dim > 0 ? dim -1 : dim,
        p: dim < length - 1 ? dim + 1 : dim
    };
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Takes in a sprite and a direction number, and sets the velocity accordingly.
 *
 * @param sprite {Player | Animal} Sprite's parent.
 * @param d {number} Randomized direction.
 */

function manipulateDirection (sprite, d) {

    var speed = 20,
        s = sprite.sprite;

    switch (d) {
        case 0:
            s.body.velocity.x = speed;
            s.body.velocity.y = 0;
            s.direction = 0;

            break;

        case 1:
            s.body.velocity.x = 0;
            s.body.velocity.y = -speed;
            s.direction = 1;

            break;

        case 2:
            s.body.velocity.x = -speed;
            s.body.velocity.y = 0;
            s.direction = 2;

            break;

        case 3:
            s.body.velocity.x = 0;
            s.body.velocity.y = speed;
            s.direction = 3;

            break;
    }
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Determines the directional values for a sprite based on a set of path instructions.
 *
 * @param path {object[]} Array of coordinate objects.
 *
 * @returns {number[]} The directions, in succession, that the sprite will be facing on this path.
 */

function determineDirections (path) {
    
    var x, y, x_1, y_1,
        last = [];
    
    for (var i = 0; i < path.length; i++) {
        
        if (i + 1 < path.length) {
            
            x = path[i].x;
            y = path[i].y;
            x_1 = path[i + 1].x;
            y_1 = path[i + 1].y;
            
            if (x > x_1) {
                last.push(2);
            } else if (x < x_1) {
                last.push(0)
            } else if (y > y_1) {
                last.push(1);
            } else if (y < y_1) {
                last.push(3);
            }
        } else {
            return last;
        }
    }
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets a sprite.
 *
 * @param sprite {Animal | Player} The sprite to be reset.
 * @param body {boolean} Will the sprite's body move?
 */

function resetSprite (sprite, body) {
    var s = sprite.sprite;
    s.body.velocity.x = 0;
    s.body.velocity.y = 0;
    s.direction = 0;
    
    s.body.moves = !body;
}
