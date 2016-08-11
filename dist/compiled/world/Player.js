/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Player object.
 *
 * @param game {object} Current game instance.
 * @param row {number} Initial row.
 * @param col {number} Initial column.
 * @param keys {string[]} Cached Phaser texture IDs to be assigned.
 * @param group {object} Phaser group.
 * @param map {Map} This game's Map object.
 *
 * @since 1.0.8
 * @param [scale=1] {number | number[]} The desired sprite scale factor. Can be of the format x, [x], or [x, y].
 *
 * @property game {object} Current game instance.
 * @property sprite {sprite} Phaser isoSprite.
 *
 * @property sprite.tile {object} Empty object that, on direction initialization, will be populated.
 * @property sprite.tile.center {sprite} Center tile.
 * @property sprite.tile.top {sprite} Tile to the relative top.
 * @property sprite.tile.left {sprite} Tile to the relative left.
 * @property sprite.tile.bottom {sprite} Tile to the relative bottom.
 * @property sprite.tile.right {sprite} Tile to the relative right.
 *
 * @property map {Map} This game's Map object.
 * @property row {number} Current tile row.
 * @property col {number} Current tile number.
 *
 * @class {object} Player
 * @this Player
 * @constructor
 *
 * @see Animal
 * @see direction
 * @see globals
 */

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Player(game, row, col, keys, group, map, scale) {
    var _sprite$anchor, _sprite$scale;

    this.type = "player";
    this.map = map;

    var x = row * this.map.tileSize,
        y = col * this.map.tileSize;

    this.game = game;
    this.keys = keys;

    if (scale) {
        this.scale = Array.isArray(scale) ? scale : [scale];
    } else {
        this.scale = [1];
    }

    // initialize the isosprite and set the game's anchor
    this.sprite = this.game.add.isoSprite(x, y, 0, keys[0], null, group);
    (_sprite$anchor = this.sprite.anchor).set.apply(_sprite$anchor, _toConsumableArray(globals.anchor));
    this.sprite.body.collideWorldBounds = true;
    (_sprite$scale = this.sprite.scale).setTo.apply(_sprite$scale, _toConsumableArray(this.scale));

    // camera follows this sprite
    this.game.camera.follow(this.sprite);

    this.sprite.direction = 0;
    this.sprite.tile = {};

    this.game.physics.isoArcade.enable(this.sprite);
    this.sprite.body.bounce = new Phaser.Plugin.Isometric.Point3(0.5, 0.5, 0.5);

    // initialize direction
    direction(this);
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Tracks the 3x3 vision radius of the Player, and changes tiles within that radius to
 *
 * @private
 *
 * @this Player
 */

Player.prototype._visionRadius = function () {

    var i,
        j,
        tile = {},
        row = this.sprite.row,
        col = this.sprite.col;

    for (i = row - 1; i < row + 2; i++) {
        for (j = col - 1; j < col + 2; j++) {
            tile = this.map.tileMap[i][j];
            tile.tint = 0xFFFFFF;
            tile.discovered = true;
        }
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @deprecated
 *
 * @desc Makes the player sprite float (as if defying gravity).
 *
 * @private
 *
 * @this Player
 */

Player.prototype._float = function () {

    this.sprite.isoZ = 5 + Math.sin(this.game.time.now * 0.005);
};
