/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

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
 * @param species {string} This animal's species.
 *
 * @property game {object} Phaser game instance.
 * @property scope {object} Angular scope.
 * @property sprite {sprite} Phaser isoSprite.
 * 
 * @property sprite.tile {object} Empty object that, on direction initialization, will be populated.
 * @property sprite.tile.center {sprite} Center tile.
 * @property sprite.tile.top {sprite} Tile to the relative top.
 * @property sprite.tile.left {sprite} Tile to the relative left.
 * @property sprite.tile.bottom {sprite} Tile to the relative bottom.
 * @property sprite.tile.right {sprite} Tile to the relative right.
 * 
 * @property map {Map} This sprite's Map object.
 * @property row {number} Current tile row.
 * @property col {number} Current tile column.
 * @property direction {number} Current direction of travel.
 * @property scanned {boolean} Has this Animal been scanned?
 * @property scan {object} Phaser Signal that, on dispatch, is immediately destroyed.
 * @property species {string} This animal's species.
 *
 * @class {object} Animal
 * @this Animal
 * @constructor
 * 
 * @see Player
 * @see direction
 * @see globals
 */

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Animal(game, scope, row, col, keys, group, map, species) {
    var _sprite$anchor;

    this.type = "animal";
    this.species = species;

    this.game = game;
    this.scope = scope;
    this.keys = keys;
    this.map = map;

    var x = row * map.tileSize,
        y = col * map.tileSize;

    this.sprite = this.game.add.isoSprite(x, y, 0, keys[0], null, group);
    (_sprite$anchor = this.sprite.anchor).set.apply(_sprite$anchor, _toConsumableArray(globals.anchor));
    this.game.physics.isoArcade.enable(this.sprite);
    this.sprite.enableBody = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.visible = false;

    this.scanned = false;
    this.scan = new Phaser.Signal();
    this.listen();

    this.sprite.tile = {};

    direction(this);

    this.timedMovement();
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

    var pRow = Player.row,
        pCol = Player.col,
        row = this.sprite.row,
        col = this.sprite.col,
        inRow = row >= pRow - 1 && row <= pRow + 1,
        inCol = col >= pCol - 1 && col <= pCol + 1;

    if (inRow && inCol) {
        this.sprite.visible = true;
    }

    this.sprite.tile.center.discovered ? this.sprite.visible = true : this.sprite.visible = false;
};

/**
 * @author Anthony Pizzimentigid
 *
 * @desc Changes the target sprite's direction at intervals of 3 + <code>n</code> seconds, where <code>n</code> is a
 * random floating point value such that 0 < <code>n</code> < 3 and is changed at every event firing.
 *
 * @property rand {number} Current random time interval.
 *
 * @this Animal
 *
 * @see manipulateDirection
 */

Animal.prototype.timedMovement = function () {
    var _this = this;

    var dir = 0;

    this.rand = Math.random() * 3;

    this.game.time.events.loop(Phaser.Timer.SECOND * 3 + this.rand, function () {
        dir = Math.floor(Math.random() * 4);
        _this.rand = Math.random() * 3;

        manipulateDirection(_this, dir);
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Listens for the scan event, and then fires an event out to Angular.
 *
 * @this Animal
 */

Animal.prototype.listen = function () {
    var _this2 = this;

    this.scan.add(function () {
        _this2.scope.$emit("scanned", { animal: _this2 });
    });

    this.scope.$on("pathfind", function (e, data) {
        _this2.pathfind(data.row, data.col);
    });
};

Animal.prototype.pathfind = function (itemRow, itemCol) {

    var e = new EasyStar.js(),
        row = this.sprite.row,
        col = this.sprite.col;

    e.setGrid(this.map.blocked);
    e.setAcceptableTiles([1]);
    e.setIterationsPerCalculation(1000);

    e.findPath(row, col, itemRow, itemCol, function (path) {

        if (!path) {
            console.log("path not found");
        } else {
            console.dir(path);
        }
    });

    e.calculate();
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

function createAnimals(scope, num, game, keys, group, map, species) {

    var animals = [],
        animal,
        row,
        col,
        dim = map.tileMap.length - 1;

    for (var i = 0; i < num; i++) {

        row = Math.floor(Math.random() * dim);
        col = Math.floor(Math.random() * dim);

        animal = new Animal(game, scope, row, col, keys, group, map, species[i]);
        animal.id = i;
        animals.push(animal);
    }

    return animals;
}
