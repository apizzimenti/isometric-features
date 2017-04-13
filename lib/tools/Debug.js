/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Parent debugging object.
 *
 * @param {object} game Current game instance.
 *
 * @property {object} game  Current game instance.
 * @property {number} x     Width-center of screen.
 * @property {number} y     Vertical position of debug display.
 * @property {string} color Default wireframe color.
 * @property {boolean} on   Is debugging on?
 *
 * @returns{undefined}
 *
 * @constructor
 */
function Debug (game) {

    this.game = game;

    // gets middle screen position
    this.x = this.game.width / 2;

    this.y = 20;
    this.color = "#FFF";
    this.on = false;

    // add graphics and assign _this = this to preserve context
    var graphics = game.add.graphics(0, 0);

    // fixes graphics to camera and assigns line and fill styles
    graphics.fixedToCamera = true;
    graphics.lineStyle(1, 0xFFFFFF, 0);
    graphics.beginFill(0, 0xFFFFFF, 0);

    this.graphics = graphics;

    // draws a button wireframe
    this.button = graphics.drawRect(20, 50, 62, 25);

    // enable mouse clicks and hand cursor
    this.button.inputEnabled = true;
    this.button.input.useHandCursor = true;

    // add text to the button area
    this.text = this.game.add.text(25, 50, "debug", {
        font: "Courier",
        fontSize: 20,
        fill: "white"
    });

    // fix *text* to camera
    this.text.fixedToCamera = true;

    // add event listener for the button click; call _switch() on callback
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
 *
 * @returns {undefined}
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
 * @param {Mouse} mouse Mouse object.
 *
 * @this Debug
 *
 * @returns {undefined}
 *
 * @see mouseTrack
 */
Debug.prototype.mousePos = function (mouse) {

    if (this.on) {
        this.game.debug.text(`${mouse.row}, ${mouse.col}`, this.x, this.y + 20, this.color);
    }
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays debug information and bodies for one or more sprites.
 *
 * @param {Player | Animal | Item} sprites  Sprites to be debugged.
 *
 * @this Debug
 *
 * @returns {undefined}
 */
Debug.prototype.sprite = function (sprites) {

    if (this.on) {

        var s,
            sprite,
            debugSprite = (sprite) => {

                // try to write sprite wireframes to the game window;
                try {

                    s = sprite.sprite;

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
                    // if they aren't loaded yet, send a warning to the console window
                    console.warn(`${sprite.type} is not yet loaded`);
                }
            };

        // check if sprites is an array or a single sprite
        if (Array.isArray(sprites)) {

            for (sprite of sprites) {
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
 * @param {sprite[]} tiles  An array of tile sprites.
 *
 * @this Debug
 *
 * @returns {undefined}
 */
Debug.prototype.tiles = function (tiles) {

    var i = 0,
        j = 0,
        tile;

    if (this.on) {
        for (i = 0; i < tiles.length; i++) {
            for (j = 0; j < tiles[0].length; j++) {
                tile = tiles[i][j];

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
 *
 * @returns {undefined}
 */
Debug.prototype._switch = function () {
    this.on = !this.on;
};