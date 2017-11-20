/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

var Phaser = require("phaser"),
    Globals = require("../tools/Globals"),
    Tiles = require("../physics/Tiles"),
    EasyStar = require("easystarjs");

/**
 * @author Anthony Pizzimenti
 *
 * @desc Each animal object contains a sprite and enhanced location information.
 *
 * @param game {object} Phaser game instance.
 * @param scope {object} Angular scope.
 * @param row {number} Initial sprite row.
 * @param col {number} Initial sprite column.
 * @param keys {string[]} Cached Phaser textures or images.
 * @param group {object} Phaser group.
 * @param map {Map} Game's Map object.
 * @param [species=sprite.key] {string} This animal's species.
 * @param [scale=1] {number | number[]} The desired sprite scale factor. Can be of the format x, [x], or [x, y].
 * @param [auto=true] {boolean} Do you want this sprite to be loaded automatically?
 *
 * @property game {object} Phaser game instance.
 * @property scope {object} Angular scope.
 * @property sprite {object} Phaser isoSprite.
 * 
 * @property sprite.tile {object} Empty object that, on direction initialization, will be populated.
 * @property sprite.tile.center {sprite} Center tile.
 * @property sprite.tile.top {sprite} Tile to the relative top.
 * @property sprite.tile.left {sprite} Tile to the relative left.
 * @property sprite.tile.bottom {sprite} Tile to the relative bottom.
 * @property sprite.tile.right {sprite} Tile to the relative right.
 * @property sprite.scale {number | number[]} The sprite's scale factor.
 * 
 * @property map {Map} This sprite's Map object.
 * @property row {number} Current tile row.
 * @property col {number} Current tile column.
 * @property direction {number} Current direction of travel.
 * @property scanned {boolean} Has this Animal been scanned?
 * @property scan {object} Phaser Signal that, on dispatch, is immediately destroyed.
 * @property species {string} This animal's species.
 * @property auto {boolean} Is this sprite loaded automatically?
 *
 * @class {object} Animal
 * @this Animal
 * @constructor
 * 
 * @see Player
 * @see direction
 * @see Globals
 * @see Map
 */

function Animal (game, scope, row, col, keys, group, map, species, scale, auto) {

    this.type = "animal";
    this.species = species || keys[0];
    
    if (scale) {
        this.scale = Array.isArray(scale) ? scale : [scale];
    } else {
        this.scale = [1];
    }
    
    if (auto !== undefined) {
        this.auto = auto;
    } else {
        this.auto = true;
    }
    
    this.game = game;
    this.scope = scope;
    this.keys = keys;
    this.map = map;
    
    var x = row * map.tileSize,
        y = col * map.tileSize;

    // add isometric sprite
    this.sprite = this.game.add.isoSprite(x, y, 0, keys[0], null, group);

    // this object will be tied to the sprite; contains all tile information
    this.sprite.tile = {};

    // set anchor, enable physics, enable body
    this.sprite.anchor.set(...Globals.anchor);
    this.game.physics.isoArcade.enable(this.sprite);
    this.sprite.enableBody = true;

    // object will collide world bounds
    this.sprite.body.collideWorldBounds = true;

    // if fog of war is turned on, then sprite is invisible
    this.sprite.visible = !this.map.fog;

    // set object scale
    this.sprite.scale.setTo(...this.scale);

    // initialize sprite scanned value
    this.scanned = false;

    // handler for scanning
    this.scan = new Phaser.Signal();
    this.listen();

    // determine the direction of the sprite
    direction(this);
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Determines whether the animal sprite is on a discovered tile or not.
 *
 * @param Player {Player} Sprite which sets discovered tile information.
 *
 * @this Animal
 */

Animal.prototype.isVisible = function (Player) {
    
    if (Player.auto) {

            // current player position
        var pRow = Player.row,
            pCol = Player.col,

            // current animal position
            row = this.sprite.row,
            col = this.sprite.col,

            // is the animal sprite within a one-tile radius of the player?
            inRow = row >= pRow - 1 && row <= pRow + 1,
            inCol = col >= pCol - 1 && col <= pCol + 1;
    
        if (inRow && inCol) {
            // if yes, make the sprite visible
            this.sprite.visible = true;
        }

        // if this animal sprite returns to a discovered tile, then make it visible again
        this.sprite.tile.center.discovered ? this.sprite.visible = true : this.sprite.visible = false;
    }
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Changes the target sprite's direction at intervals of 3 + <code>n</code> seconds, where <code>n</code> is a
 * random floating point value such that 0 < <code>n</code> < 3 and is changed at every event firing.
 *
 * @property rand {number} Current random time interval.
 * @property loopedMovement {object} Phaser looped event.
 *
 * @this Animal
 *
 * @see forceDirection
 */

Animal.prototype.timedMovement = function () {

    var dir = 0;

    this.rand = Math.random() * 3;

    this.loopedMovement = this.game.time.events.loop((Phaser.Timer.SECOND * 3) + this.rand, () => {
        dir = Math.floor(Math.random() * 4);
        this.rand = (Math.random() * 3);
        Tiles.forceDirection(this, dir);
    })
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Listens for events.
 *
 * @this Animal
 */

Animal.prototype.listen = function () {
    
    this.scan.add(() => {
        this.scope.$emit("scanned", {animal: this});
    });
    
    this.scope.$on("pathfind", (e, data) => {
        this._pathfind(data.row, data.col);
    })
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates a walkable path from the Animal's current location to the target location.
 *
 * @private
 *
 * @param itemRow {number} Target item's row.
 * @param itemCol {number} Target item's column.
 *
 * @this Animal
 */

Animal.prototype._pathfind = function (itemRow, itemCol) {

    var e = new EasyStar.js(),
        row = this.sprite.row,
        col = this.sprite.col,
        dirs = [];
    
    e.setGrid(this.map.blocked);
    e.setAcceptableTiles([1]);
    e.setIterationsPerCalculation(1000);

    e.findPath(row, col, itemRow, itemCol, (path) => {

        if (!path) {
            console.log("path not found");
        } else {
            this.game.time.events.remove(this.loopedMovement);
            dirs = Tiles.shrinkPath(path);
            Tiles.resetSprite(this, true);
            this._followDirection(true, path, dirs);
        }
    });
    
    e.calculate();
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Recursive method for following a set of path instructions from EasyStar.js.
 *
 * @private
 *
 * @param begin {boolean} Is this the first iteration?
 * @param path {object[]} Array of coordinate objects.
 * @param dirs {number[]} Array of directions.
 *
 * @property sprite.tween {object} Phaser tween object that will be chained to.
 *
 * @this Animal
 */

Animal.prototype._followDirection = function (begin, path, dirs) {

        // dimensisons of map tiles
    var dim = this.map.tileSize,

        // get the next direction on the path, then map coordinates for direction
        r = path[0].x,
        c = path[0].y,
        x = r * dim,
        y = c * dim,

        tween,
        end = dirs.length === 0 || path.length === 1;
    
    if (begin) {

        this.sprite.tween = this.game.add.tween(this.sprite).to({isoX: x, isoY: y}, ...Globals.tween);
    
        this.sprite.tween.onComplete.add(() => {
            this.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);
            
            this._followDirection(false, path, dirs)
        });
    
    } else if (!begin && !end) {

        tween = this.game.add.tween(this.sprite);
        this.sprite.tween.chain(tween.to({isoX: x, isoY: y}, ...Globals.tween));
        
        tween.onComplete.add(() => {
            this.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);
            
            this._followDirection(false, path, dirs);
        });
        
        
    } else if (!begin && end) {

        Tiles.resetSprite(this, false);
        this.timedMovement();
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Creates the specified number of Animal objects.
 *
 * @param scope {object} Angular scope.
 * @param num {number} Number of Animals to be created.
 * @param game {object} Current game instance.
 * @param keys {string[]} Array of cached Phaser texture IDs to be assigned.
 * @param group {object} Phaser group.
 * @param map {Map} Game's Map object.
 * @param species {string[]} Array of species.
 *
 * @returns {Animal[]} An array of Animal objects.
 *
 * @see Animal
 */

function createAnimals (scope, num, game, keys, group, map, species) {

    var animals = [],
        animal,
        row,
        col,
        dim = (map.tileMap.length - 1);

    for (var i = 0; i < num; i++) {

        row = Math.floor(Math.random() * dim);
        col = Math.floor(Math.random() * dim);

        animal = new Animal(game, scope, row, col, keys, group, map, species[i]);
        animal.id = i;
        animals.push(animal);
    }

    return animals;
}

module.exports = {
    Animal: Animal,
    createAnimals: createAnimals
};
