/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

var Phaser = require("phaser"),
    Globals = require("../tools/Globals");

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
 * @param [scale=1] {number | number[]} The desired sprite scale factor. Can be of the format x, [x], or [x, y].
 * @param [auto=true] {boolean} Do you want this Player to be instantiated immediately?
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
 * @property auto {boolean} Is this sprite loaded automatically?
 *
 * @class {object} Player
 * @this Player
 * @constructor
 *
 * @see Animal
 * @see direction
 * @see Globals
 */

function Player (game, row, col, keys, group, map, scale, auto) {
    
    this.type = "player";
    this.map = map;

    // choose defaults for auto property
    if (!Globals.paramNotExist(auto)) {
        this.auto = auto;
    } else {
        this.auto = true;
    }

    var x = row * this.map.tileSize,
        y = col * this.map.tileSize;

    this.game = game;
    this.keys = keys;
    this.group = group;
    
    if (scale) {
        this.scale = Array.isArray(scale) ? scale : [scale];
    } else {
        this.scale = [1];
    }

    // create isometric sprite, set its anchor, enable body
    this.sprite = this.game.add.isoSprite(x, y, 0, keys[0], null, group);
    this.sprite.anchor.set(...Globals.anchor);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.moves = false;

    // set scale, visibility, camera tracking
    this.sprite.scale.setTo(...this.scale);
    this.sprite.visible = false;
    this.game.camera.follow(this.sprite);
    
    if (this.auto) {
        this.create();
    }
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc If <code>this.auto</code> is true or undefined, then this method is called automatically. Otherwise, call it
 * when the Player is to be instantiated. See the test folder's Loader class for an example.
 *
 * @this Player
 */

Player.prototype.create = function () {
    
    this.sprite.visible = true;
    
    if (this.intro) {
        this.intro.start();
        this.intro.onComplete.add(() => {
            this._instantiate();
            if (this.postTween) {
                this.postTween.f(this);
            }
        });
    } else {
        this._instantiate();
    }
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Private method that is called from create(), instantiating the sprite after its intro is complete.
 *
 * @private
 *
 * @this Player
 */

Player.prototype._instantiate = function () {
    
    this.auto = true;
    
    // camera follows this sprite
    this.sprite.direction = 0;
    this.sprite.tile = {};

    this.sprite.body.bounce = new Phaser.Plugin.Isometric.Point3(0.5, 0.5, 0.5);
    this.sprite.body.moves = true;
};


/**
 * @author Anthony Pizzimenti
 *
 * @param preTween {object} Object literal containing the starting values to be set before the intro tween is
 * run.
 * @param tweenParameters {object} Parameters for the intro tween.
 * @param tweenParameters.properties {object} Properties to be modified by the tween.
 * @param [tweenParameters.duration=1000] {number} Duration of the tween.
 * @param [tweenParameters.easing=Phaser.Linear.Easing.None] {object} Type of easing interpreted by Phaser.
 * @param [postTween=null] Object literal containing values to be assigned to the sprite after the intro tween is complete.
 *
 * @example
 * // example parameters:
 *
 * var initial = {
 *     isoZ: 100
 * };
 *
 * var tween = {
 *     properties: {
 *         isoZ: 24
 *     },
 *     duration: 2000,
 *     easing: Phaser.Easing.Bounce
 * }
 *
 * var player = new Player (game, row, col, keys, group, map, null, false); // player is not set to be immediately created
 * player.addIntro(initial, tween);
 * player.create();
 *
 * @this Player
 */

Player.prototype.addIntro = function (preTween, tweenParameters, postTween) {
    
    var params = [],
        tP = tweenParameters,
        e;
    
    if (Globals.paramNotExist(preTween, "object")) {
        throw new Error("preTween is not of type object");
    } else if (Globals.paramNotExist(tP, "object")) {
        throw new Error("tweenParameters is not of type object");
    } else if (postTween) {
        
        if (Globals.paramNotExist(postTween, "object")) {
            throw new Error("postTween parameter is not of type object");
        }
        
        this.postTween = {};
        this.postTween.props = postTween;
        this.postTween.f = function (_this) {
            for (var arg in _this.postTween.props) {
                if (_this.postTween.props.hasOwnProperty(arg)) {
                    _this.sprite[arg] = _this.postTween.props[arg];
                }
            }
        }
    }
    
    for (var init in preTween) {
        if (preTween.hasOwnProperty(init)) {
            this.sprite[init] = preTween[init];
        }
    }
    
    if (!tP.hasOwnProperty("properties")) {
        throw new Error("tweenParameters.properties is not defined");
    } else if (!tP.hasOwnProperty("easing")) {
        throw new Error("tweenParameters.easing is not defined");
    } else if (!tP.hasOwnProperty("duration")) {
        throw new Error("tweenParameters.duration is not defined");
    } else {
        params[0] = tP.properties;
        params[1] = tP.duration;
        params[2] = tP.easing;
    }
    
    this.intro = this.game.add.tween(this.sprite).to(...params, false, 0, 0, false);
};

Player.prototype.addOuttro = function (tweenParameters) {
    
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Tracks the 3x3 vision radius of the Player, and changes tiles within that radius to visible. Is turned off
 * if <code>Map.fog === false</code>.
 *
 * @this Player
 */

Player.prototype.visionRadius = function () {
    
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

module.exports = {
    Player: Player
};
