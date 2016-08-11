/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Provides an easy way to specify debugging within the Phaser game.
 *
 * @param game {object} Phaser game instance.
 *
 * @property game {game} Phaser game instance.
 * @property x {number} Middle of the Phaser game window.
 * @property y {number} Starting height to display debug information.
 * @property color {string} Hexadecimal color code.
 * @property on {boolean} Turns the debug information on and off.
 *
 * @class {object} Debug
 * @this Debug
 * @constructor
 */

function Debug(game) {

    this.game = game;
    this.x = this.game.width / 2;
    this.y = 20;
    this.color = "#FFF";
    this.on = true;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Writes the current FPS to the game window.
 *
 * @this Debug
 */

Debug.prototype.fps = function () {
    if (this.on) {
        this.game.debug.text(this.game.time.fps, this.x, this.y, this.color);
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Writes the current mouse position to the game window.
 *
 * @param mouse {Mouse} Mouse object.
 *
 * @this Debug
 *
 * @see mouseTrack
 */

Debug.prototype.mousePos = function (mouse) {
    if (this.on) {
        this.game.debug.text(mouse.tile.row + ", " + mouse.tile.col, this.x, this.y, this.color);
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays debug information and bodies for one or more sprites.
 *
 * @param sprites {Player | Animal | Item}
 *
 * @this Debug
 */

Debug.prototype.sprite = function (sprites) {
    var _this = this;

    if (this.on) {
        var debugSprite = function debugSprite(sprite) {
            _this.game.debug.text(sprite.sprite.row + ", " + sprite.sprite.col, _this.x, _this.y, _this.color);

            try {
                _this.game.debug.body(sprite.sprite.tile.top, "#FF0000", false);
                _this.game.debug.body(sprite.sprite, "#FFFFFF", false);

                for (var tile in sprite.sprite.tile) {
                    if (sprite.tile.hasOwnProperty(tile) && tile !== "top") {
                        _this.game.debug.body(sprite.tile[tile], "#FFDD00", false);
                    }
                }
            } catch (e) {
                console.log("%cSprite has not loaded yet", "color: red");
            }
        };

        if (Array.isArray(sprites)) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {

                for (var _iterator = sprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var sprite = _step.value;

                    debugSprite(sprite);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else {
            debugSprite(sprites);
        }
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays blocked tiles' debug bodies.
 *
 * @param tiles {sprite[]} An array of tile sprites.
 *
 * @this Debug
 */

Debug.prototype.tiles = function (tiles) {

    if (this.on) {
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles[0].length; j++) {
                var tile = tiles[i][j];

                if (tile.blocked) {
                    this.game.debug.body(tiles[i][j], "#FFDD00", false);
                }
            }
        }
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Allows for future implementation of a _button on/off switch for displaying debug info.
 *
 * @this Debug
 *
 * @todo Implement buttons.
 */

Debug.prototype.switch = function () {
    this.on = !this.on;
};
