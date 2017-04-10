(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/29/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc Determines whether the immediate top, left, bottom, and right tiles are blocked.
 *
 * @param context {object} The context in which a sprite object exists.
 *
 * @returns {object} Each property specifies if the immediate top, left, bottom, right, or none of the previous tiles are blocked.
 *
 * @see Animal
 * @see Player
 */
function determineBounds (context) {

    var sprite = context.sprite,
        bounds = {};

    sprite.tile.top.blocked ? bounds.top = true : bounds.top = false;
    sprite.tile.left.blocked ? bounds.left = true : bounds.left = false;
    sprite.tile.bottom.blocked  ? bounds.bottom = true : bounds.bottom = false;
    sprite.tile.right.blocked ? bounds.right = true : bounds.right = false;

    bounds.allBounds = bounds.top || bounds.left || bounds.bottom || bounds.right;

    return bounds;
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Checks to see whether the location of the mouse is within physics world bounds.
 *
 * @param Mouse {Mouse} Mouse object to check.
 *
 * @returns {boolean} Is this location within the physics world bounds?
 */
function isInBounds (Mouse) {

    var x = Mouse.threeD.x,
        y = Mouse.threeD.y,
        game = Mouse.game,
        inX = x > game.physics.isoArcade.bounds.backX && x < game.physics.isoArcade.bounds.frontX,
        inY = y > game.physics.isoArcade.bounds.backY && y < game.physics.isoArcade.bounds.frontY;

    return inX && inY;
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Easy calculation of world boundaries.
 *
 * @param tileSize {number} Size of an individual tile.
 * @param mapSize {number} Desired size of the map. The map will be an array of mapSize * mapSize.
 * @param num {number} Number used to move world boundaries back num rows.
 *
 * @returns {number}
 *
 * @see Map
 */
function dim (tileSize, mapSize, num) {
    
    if (num) {
        return tileSize * (mapSize - (num + 1));
    } else {
        return tileSize - mapSize;
    }
}