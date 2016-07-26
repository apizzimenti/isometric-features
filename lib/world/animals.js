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
 * @property [species="none"] {string} This animal's species.
 *
 * @class {object} Animal
 * @this Animal
 * @constructor
 * 
 * @see Player
 * @see direction
 * @see globals
 */

function Animal (game, scope, row, col, keys, group, map, species) {

    this.type = "animal";
    this.species = species || "none";

    this.game = game;
    this.scope = scope;
    this.keys = keys;
    this.map = map;
    
    var x = row * map.tileSize,
        y = col * map.tileSize;

    this.sprite = this.game.add.isoSprite(x, y, 0, keys[0], null, group);
    this.sprite.anchor.set(...globals.anchor);
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
 * @property loopedMovement {object} Phaser looped event.
 *
 * @this Animal
 *
 * @see manipulateDirection
 */

Animal.prototype.timedMovement = function () {

    var dir = 0;

    this.rand = Math.random() * 3;

    this.loopedMovement = this.game.time.events.loop((Phaser.Timer.SECOND * 3) + this.rand, () => {
        dir = Math.floor(Math.random() * 4);
        this.rand = (Math.random() * 3);

        manipulateDirection(this, dir);
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
        this.pathfind(data.row, data.col);
    })
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates a walkable path from the Animal's current location to the target location.
 *
 * @param itemRow {number} Target item's row.
 * @param itemCol {number} Target item's column.
 *
 * @this Animal
 */

Animal.prototype.pathfind = function (itemRow, itemCol) {

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
            dirs = determineDirections(path);
            this.followDirection(true, path, dirs);
        }
    });
    
    e.calculate();
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Recursive method for following a set of path instructions from EasyStar.js.
 *
 * @param begin {boolean} Is this the first iteration?
 * @param path {object[]} Array of coordinate objects.
 * @param dirs {number[]} Array of directions.
 *
 * @property sprite.tween {object} Phaser tween object that will be chained to.
 *
 * @this Animal
 */

Animal.prototype.followDirection = function (begin, path, dirs) {
    
    var dim = this.map.tileSize,
        r = path[0].x,
        c = path[0].y,
        x = r * dim,
        y = c * dim,
        tween,
        end = dirs.length === 0 || path.length === 1;
    
    if (begin) {
        this.sprite.tween = this.game.add.tween(this.sprite).to({isoX: x, isoY: y}, ...globals.tween);
    
        this.sprite.tween.onComplete.add(() => {
            this.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);
            
            this.followDirection(false, path, dirs)
        });
    
    } else if (!begin && !end) {
        tween = this.game.add.tween(this.sprite);
        this.sprite.tween.chain(tween.to({isoX: x, isoY: y}, ...globals.tween));
        
        tween.onComplete.add(() => {
            this.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);
            
            this.followDirection(false, path, dirs);
        });
        
        
    } else if (!begin && end) {
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
