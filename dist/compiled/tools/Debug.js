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
    this.on = false;

    var graphics = game.add.graphics(0, 0),
        _this = this;

    graphics.fixedToCamera = true;
    graphics.lineStyle(1, 0xFFFFFF, 0);
    graphics.beginFill(0, 0xFFFFFF, 0);
    this.graphics = graphics;

    this.button = graphics.drawRect(20, 50, 62, 25);
    this.button.inputEnabled = true;
    this.button.input.useHandCursor = true;

    this.text = this.game.add.text(25, 50, "debug", {
        font: "Courier",
        fontSize: 20,
        fill: "white"
    });

    this.text.fixedToCamera = true;

    this.button.events.onInputDown.add(() => {
        this._switch();
    });
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
        this.game.debug.text(`${ mouse.row }, ${ mouse.col }`, this.x, this.y + 20, this.color);
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

    if (this.on) {
        var debugSprite = sprite => {

            try {

                var s = sprite.sprite;

                this.game.debug.body(s, "#FFFFFF", false);

                if (s.tile) {
                    this.game.debug.body(s.tile.top, "#FF0000", false);
                }

                if (s.tile) {
                    for (var tile in s.tile) {
                        if (s.tile.hasOwnProperty(tile) && tile !== "top") {
                            this.game.debug.body(s.tile[tile], "#FFDD00", false);
                        }
                    }
                }
            } catch (e) {
                console.warn(`${ sprite.type } is not yet loaded`);
            }
        };

        if (Array.isArray(sprites)) {

            for (var sprite of sprites) {
                debugSprite(sprite);
            }
        } else {
            debugSprite(sprites);
        }
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays blocked tiles" debug bodies.
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
 * @private
 *
 * @this Debug
 */

Debug.prototype._switch = function () {
    this.on = !this.on;
};