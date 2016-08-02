/*! iso-game-features - v0.0.1 - 2016-08-02
* Copyright (c) 2016 ; Licensed MIT */
"use strict";

(function () {})();
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

function determineBounds(context) {

    var sprite = context.sprite,
        bounds = {};

    sprite.tile.top.blocked ? bounds.top = true : bounds.top = false;
    sprite.tile.left.blocked ? bounds.left = true : bounds.left = false;
    sprite.tile.bottom.blocked ? bounds.bottom = true : bounds.bottom = false;
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

function isInBounds(Mouse) {

    var x = Mouse.threeD.x,
        y = Mouse.threeD.y,
        game = Mouse.game,
        inX = x > game.physics.isoArcade.bounds.backX && x < game.physics.isoArcade.bounds.frontX,
        inY = y > game.physics.isoArcade.bounds.backY && y < game.physics.isoArcade.bounds.frontY;

    return inX && inY;
}

"use strict";

(function () {})();
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
 * @desc Computes the direction and cross boundaries for the given sprite.
 *
 * @param Sprite {Animal | Player | Item} Object containing a Phaser sprite.
 *
 * @see Animal
 * @see Player
 */

function direction(Sprite) {

    var sprite = Sprite.sprite,
        x = sprite.body.frontX,
        y = sprite.body.frontY,
        tileMap = Sprite.map.tileMap,
        tileSize = Sprite.map.tileSize,
        row = Math.ceil(x / tileSize) >= tileMap.length - 1 ? tileMap.length - 1 : Math.ceil(x / tileSize),
        col = Math.ceil(y / tileSize) >= tileMap[0].length - 1 ? tileMap[0].length - 1 : Math.ceil(y / tileSize),
        dir = sprite.direction,
        r = determineTileRadius(tileMap.length, row),
        c = determineTileRadius(tileMap.length, col),
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

function determineTileRadius(length, dim) {

    return {
        m: dim > 0 ? dim - 1 : dim,
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

function manipulateDirection(sprite, d) {

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

function determineDirections(path) {

    var x,
        y,
        x_1,
        y_1,
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
                last.push(0);
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

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Provides an easy way to specify debugging within the Phaser game.
 *
 * @param game {object} Phaser game instance.
 * @param width {number} Width of the Phaser game window.
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

function Debug(game, width) {

    this.game = game;
    this.x = width / 2;
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
 * @desc Allows for future implementation of a button on/off switch for displaying debug info.
 *
 * @this Debug
 *
 * @todo Implement buttons.
 */

Debug.prototype.switch = function () {
    this.on = !this.on;
};

"use strict";

(function () {})();
/**
 * Created by apizzimenti on 5/19/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc A set of variables that have to be used in disparate locations.
 * 
 * @type {{anchor: number[], mapTileKey: string[], tween: object[]}}
 */

var globals = {
    anchor: [0.5, 0],
    mapTileKey: ["grass", "sand", "sandstone"],
    tween: [1000, Phaser.Easing.Linear.None, true, 0, 0, false]
};

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

function dim(tileSize, mapSize, num) {

    if (num) {
        return tileSize * (mapSize - (num + 1));
    } else {
        return tileSize - mapSize;
    }
}

"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/15/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Game's mouse object.
 *
 * @param game {object} Current Phaser game instance.
 * @param map {Map} Game's Map object.
 * @param group {object} Sprite group.
 *
 * @property game {object} Game instance this mouse belongs to.
 * @property map {Map} Game's Map object.
 * @property group {object} Sprite group.
 * @property pos {object} Initial Isometric Point3.
 * @property twoD {object} Phaser 2d pointer position.
 * @property threeD {object} Derived 3d pointer position.
 * @property switch {boolean} Is selected mode on or off?
 * @property tile {object} Tiling system for the mouse pointer.
 * @property tile.center {sprite} Tile currently under the mouse pointer (when selected mode is on).
 * @property mouse {object} Phaser input object.
 *
 * @class {object} Mouse
 * @this Mouse
 * @constructor
 */

function Mouse(game, map, group) {

    this.game = game;
    this.map = map;
    this.group = group;
    this.pos = new Phaser.Plugin.Isometric.Point3();

    var x = this.game.input.mousePointer.x,
        y = this.game.input.mousePointer.y;

    this.twoD = new Phaser.Point(x, y);
    this.threeD = this.game.iso.unproject(this.twoD, this.pos);

    this.switch = false;

    this.tile = {};

    this.mouse = this.game.input;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Updates 2d (twoD) and 3d (threeD) positions as well as world boundaries.
 *
 * @property twoD.x {number} 2d x position.
 * @property twoD.y {number} 2d y position.
 * @property threeD.x {number} 3d x position.
 * @property threeD.y {number} 3d y position.
 * @property inBounds {boolean} Is the mouse pointer within the world boundaries?
 *
 * @this Mouse
 */

Mouse.prototype.update = function () {

    this.twoD.x = this.game.input.mousePointer.x;
    this.twoD.y = this.game.input.mousePointer.y;
    this.threeD = this.game.iso.unproject(this.twoD, this.pos);

    var backX = this.game.physics.isoArcade.bounds.backX,
        backY = this.game.physics.isoArcade.bounds.backY,
        frontX = this.game.physics.isoArcade.bounds.frontX,
        frontY = this.game.physics.isoArcade.bounds.frontY;

    this.inBounds = this.threeD.x > backX && this.threeD.x < frontX && this.threeD.y > backY && this.threeD.y < frontY;
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc If the mouse is in selected mode (i.e. <code>switch</code> is true), this determines the tile to animate.
 *
 * @this Mouse
 */

Mouse.prototype.selected = function () {
    var _this = this;

    if (this.inBounds) {

        this.group.forEach(function (tile) {

            if (tile.type === "tile") {
                var inside = tile.isoBounds.containsXY(_this.threeD.x + _this.map.tileSize, _this.threeD.y + _this.map.tileSize);

                if (inside) {

                    _this.tile = tile;

                    _this.row = _this.tile.row;
                    _this.col = _this.tile.col;

                    tile.tint = 0x98FB98;
                    tile.alpha = 1.3 + Math.sin(_this.game.time.now * 0.007);

                    _this.tween = _this.game.add.tween(tile).to({ isoZ: 5 }, 20, Phaser.Easing.Linear.None, true);
                    _this.tweened = true;
                } else {

                    if (_this.tweened) {
                        _this.tween.stop();
                        _this.tweened = !_this.tweened;
                        tile.isoZ = 0;
                    }
                    tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
                    tile.alpha = 1;
                }
            }
        });
    } else {
        this.reset();
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets all tile sprites in the group.
 *
 * @this Mouse
 */

Mouse.prototype.reset = function () {
    var _this2 = this;

    this.group.forEach(function (tile) {

        if (tile.type === "tile") {
            tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
            tile.alpha = 1;
            tile.isoZ = 0;
            _this2.game.canvas.style.cursor = "default";
        }
    });
};

"use strict";

(function () {})();
/**
 * Created by apizzimenti on 5/19/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Binds the left, right, up, and down keys to the running game instance.
 *
 * @param game {object} Phaser game instance.
 * @param context {object} the context game is bound to.
 */

function keymap(game, context) {

    context.cursors = game.input.keyboard.createCursorKeys();

    context.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]);

    return {
        esc: game.input.keyboard.addKey(Phaser.Keyboard.ESC),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Changes the direction of the given sprite based on keypresses.
 *
 * @param Player {Player} Phaser Player sprite.
 * @param context {object} the context game is bound to.
 */

function keymapTrack(Player, context) {

    /**
     * Default speed in px/s for specified sprite.
     * @type {number}
     */

    var speed = 50,
        sprite = Player.sprite;

    sprite.body.velocity.z = 0;
    // sprite.isoZ = -3 + (3 * Math.sin(sprite.isoX + sprite.isoY));

    if (context.cursors.up.isDown) {
        sprite.body.velocity.y = -speed;
        sprite.direction = 1;
    } else if (context.cursors.down.isDown) {
        sprite.body.velocity.y = speed;
        sprite.direction = 3;
    } else {
        sprite.body.velocity.y = 0;
    }

    if (context.cursors.left.isDown) {
        sprite.body.velocity.x = -speed;
        sprite.direction = 2;
    } else if (context.cursors.right.isDown) {
        sprite.body.velocity.x = speed;
        sprite.direction = 0;
    } else {
        sprite.body.velocity.x = 0;
    }
}

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Animal(game, scope, row, col, keys, group, map, species) {
    var _sprite$anchor;

    this.type = "animal";
    this.species = species || "none";

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
 * @property loopedMovement {object} Phaser looped event.
 *
 * @this Animal
 *
 * @see manipulateDirection
 */

Animal.prototype.timedMovement = function () {
    var _this = this;

    var dir = 0;

    this.rand = Math.random() * 3;

    this.loopedMovement = this.game.time.events.loop(Phaser.Timer.SECOND * 3 + this.rand, function () {
        dir = Math.floor(Math.random() * 4);
        _this.rand = Math.random() * 3;

        manipulateDirection(_this, dir);
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Listens for events.
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
    var _this3 = this;

    var e = new EasyStar.js(),
        row = this.sprite.row,
        col = this.sprite.col,
        dirs = [];

    e.setGrid(this.map.blocked);
    e.setAcceptableTiles([1]);
    e.setIterationsPerCalculation(1000);

    e.findPath(row, col, itemRow, itemCol, function (path) {

        if (!path) {
            console.log("path not found");
        } else {
            _this3.game.time.events.remove(_this3.loopedMovement);
            dirs = determineDirections(path);
            _this3.followDirection(true, path, dirs);
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
    var _this4 = this;

    var dim = this.map.tileSize,
        r = path[0].x,
        c = path[0].y,
        x = r * dim,
        y = c * dim,
        tween,
        end = dirs.length === 0 || path.length === 1;

    if (begin) {
        var _game$add$tween;

        this.sprite.tween = (_game$add$tween = this.game.add.tween(this.sprite)).to.apply(_game$add$tween, [{ isoX: x, isoY: y }].concat(_toConsumableArray(globals.tween)));

        this.sprite.tween.onComplete.add(function () {
            _this4.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);

            _this4.followDirection(false, path, dirs);
        });
    } else if (!begin && !end) {
        var _tween;

        tween = this.game.add.tween(this.sprite);
        this.sprite.tween.chain((_tween = tween).to.apply(_tween, [{ isoX: x, isoY: y }].concat(_toConsumableArray(globals.tween))));

        tween.onComplete.add(function () {
            _this4.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);

            _this4.followDirection(false, path, dirs);
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

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Abstract parent class for Inventory items.
 *
 * @param game {object} Current Phaser game instance.
 * @param key {string} Cached Phaser texture or image.
 * @param inventory {Inventory} Game's Inventory.
 *
 * @property game {object} Phaser game instance.
 * @property key {string} The key that belongs to this Item.
 * @property keys {string[]} Dummy property that can be overwritten.
 * @property map {Map} Game's Map object.
 * @property inventory {Inventory} This game's inventory.
 * @property text {object} When the item is loaded into the inventory, this prop is populated with a Phaser.Text object.
 * @property inventorySprite {sprite} On initialization, this will contain a regular Phaser sprite.
 * @property sprite {sprite} On selected, this will contain an isometric Sprite.
 * @property sprite.tile {object} Contains location and directional information for the sprite.
 * @property direction {number} This sprite's default direction.
 *
 * @class {object} Item
 * @this Item
 */

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Item(game, key, inventory) {

  this.keys = [key, key, key, key];

  this.game = game;
  this.key = key;

  this.inventory = inventory;
  this.text = {};

  this.inventorySprite = {};
  this.sprite = {};
  this.sprite.tile = {};
  this.sprite.direction = 0;
  this.map = this.inventory.map;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Default action method. Can and should be overwritten on a per-item basis.
 *
 * @this Item
 */

Item.prototype.action = function () {
  console.log("NoActionMethod: " + this.key + " is using the builtin action method");
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Initializes objects for the isometric physics system. Sprites are immovable.
 *
 * @this Item
 */

Item.prototype.threeDInitialize = function () {
  var _sprite$anchor;

  (_sprite$anchor = this.sprite.anchor).set.apply(_sprite$anchor, _toConsumableArray(globals.anchor));
  this.sprite.body.collideWorldBounds = true;
  this.game.physics.isoArcade.enable(this.sprite);
  this.sprite.enableBody = true;

  this.sprite.tile = {};
  this.sprite.direction = 0;

  this.sprite.body.immovable = true;

  this.setting = true;
  direction(this);
};

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Game map object.
 *
 * @param game {object} Current game instance.
 * @param group {object} Phaser group.
 * @param tileSet Tileset and corresponding JSON.
 * @param tileSize {number} Size of an individual tile.
 * @param mapSize {number} Desired map size.
 *
 * @property game {object} Current game instance.
 * @property tileSet Tileset and corresponding JSON.
 * @property tileSize {number} Size of an individual tile.
 * @property mapSize {number} Set map size.
 * @property tileMap {sprite[]} Array of tile sprites.
 * @property group {object} Phaser game group.
 * @property blocked {number[]} Array of numbers indicating which tiles are blocked (1) and which aren't (0).
 *
 * @class {object} Map
 * @this Map
 * @constructor
 */

function Map(game, group, tileSet, tileSize, mapSize) {

    var tile,
        tileArray = [],
        blockedArray = [],
        tiles = this.createTileMap(mapSize),
        worldBounds = dim(tileSize, mapSize, 1);

    this.game = game;
    this.tileSet = tileSet;
    this.tileSize = tileSize;
    this.mapSize = mapSize;
    this.group = group;

    for (var row = 0; row < tiles.length; row++) {

        tileArray[row] = [];
        blockedArray[row] = [];

        for (var col = 0; col < tiles[0].length; col++) {

            tile = this.game.add.isoSprite(row * this.tileSize, col * this.tileSize, 0, this.tileSet, globals.mapTileKey[tiles[row][col]], this.group);

            if (col > tiles.length - 2 || row < 1 || row > tiles.length - 2 || col < 1) {
                tile.tint = 0x571F57;
                tile.blocked = true;
                blockedArray[row].push(0);
            } else {
                tile.blocked = false;
                tile.tint = 0x571F57;
                blockedArray[row].push(1);
            }

            tile.discovered = false;
            tile.type = "tile";

            tile.anchor.set(0.5, 1);
            tile.smoothed = false;
            tile.row = row;
            tile.col = col;
            tileArray[row][col] = tile;

            // add comparison method for tiles

            tile.compareTo = function (tile) {

                var row = this.row === tile.row,
                    col = this.col === tile.col;

                if (row && col) {
                    return true;
                }
            };
        }
    }

    this.game.physics.isoArcade.bounds.frontX = worldBounds;
    this.game.physics.isoArcade.bounds.frontY = worldBounds;
    this.game.physics.isoArcade.bounds.backX = 0;
    this.game.physics.isoArcade.bounds.backY = 0;

    this.tileMap = tileArray;
    this.blocked = blockedArray;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Creates a size * size array with randomly assigned tiles. Can be modified to create a custom game map.
 *
 * @param size {number} Desired map size.
 *
 * @returns {sprite[]}
 */

Map.prototype.createTileMap = function (size) {

    var tileMap = [];

    for (var row = 0; row < size; row++) {

        tileMap[row] = [];

        for (var col = 0; col < size; col++) {

            var tileNum = Math.floor(Math.random() * 3);

            if (tileNum > 0) {
                tileMap[row][col] = tileNum;
            } else {
                tileMap[row][col] = 0;
            }
        }
    }

    return tileMap;
};

"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/15/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Controls context menus and options.
 *
 * @param Inventory {Inventory} Inventory object.
 *
 * @property Inventory {Inventory} Inventory object.
 * @property game {object} Current game instance.
 * @property mouse {Mouse} Mouse object.
 * @property items {sprite[]} List of items currently in the Inventory.
 *
 * @class {object} contextMenu
 * @this contextMenu
 * @constructor
 */

function ContextMenu(Inventory) {

    this.Inventory = Inventory;
    this.game = this.Inventory.game;
    this.mouse = this.Inventory.mouse;
    this.items = this.Inventory.items;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Creates a context menu at the current x, y position.
 *
 * @this contextMenu
 */

ContextMenu.prototype.createContextMenu = function () {
    var _this = this;

    var x = this.mouse.twoD.x,
        y = this.mouse.twoD.y,
        graphics = this.game.add.graphics(0, 0);

    graphics.fixedToCamera = true;
    graphics.lineStyle(2, 0xFFFF00, 1);
    graphics.beginFill(0xFFFF00, 0.4);
    this.graphics = graphics;

    this.menu = this.graphics.drawRect(x, y, 100, 150);

    this.mouse.mouse.onDown.add(function () {
        _this.menu.destroy();
    });
};

"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/21/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Element for containing how-to information and making it visible (or invisible) to the player.
 *
 * @param element {string} String id for the HTML element that will serve as your guide..
 * @param gameElement {string} String id for element that hosts the game canvas (the same name as when the Phaser game is initialized).
 * @param [styles=null] {object} Custom style overrides.
 *
 * @example
 *
 * // index.html
 * // in your html, simply include an element containing guide information, like so:
 *
 * ...
 *     <div id="guide">
 *         <h1>Introduction</h1>
 *             Blah blah blah...
 *     </div>
 * ...
 *
 *
 * // .js file where game is located
 *
 * var guide;
 *
 * // no custom styles
 * guide = new Guide("guide", "gameCanvas")
 *
 * // custom styles
 * guide = new Guide("guide", "gameCanvas", {
 *    "color": "black",
 *    "text-align": "center"
 * });
 *
 * // check the test/ folder for a usable example.
 *
 * @class Animal
 * @constructor
 */

function Guide(element, gameElement, styles) {

    var _this = this;

    this.raw = {};
    this.raw.guideId = element;
    this.raw.guide = document.getElementById(element);
    this.raw.game = document.getElementById(gameElement);
    this.raw.canvas = this.raw.game.getElementsByTagName("canvas")[0];
    this.raw.guideHtml = this.raw.guide.innerHTML;
    this.raw.offsetTop = this.raw.canvas.offsetTop;
    this.raw.offsetLeft = this.raw.canvas.offsetLeft;
    this.raw.on = false;
    this.raw.guide.styles = styles || null;

    $(document).ready(function () {
        _this.guideElement = $("#" + element);

        _this.configureWindow();
        _this.button();
    });
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates a button on top of the game canvas for displaying help information.
 *
 * @this Guide
 */

Guide.prototype.button = function () {

    var button = document.createElement("button"),
        buttonText = document.createTextNode("i"),
        id = "guideButton",
        template = "#" + id,
        _this = this;

    button.id = id;
    button.appendChild(buttonText);
    this.raw.game.appendChild(button);
    this.raw.guideButton = button;
    this.raw.guideButton.className = "guide-button";
    this.raw.guideButton.on = false;

    $(template).css({
        "top": _this.raw.offsetTop + 20,
        "left": _this.raw.offsetLeft + 20
    });

    $(template).hover(function () {
        $(template).css({
            "cursor": "pointer"
        });
    });

    $(template).click(function () {

        if (!_this.raw.guideButton.on) {
            _this.raw.guideButton.on = true;
            $("#" + _this.raw.guideId).css({
                "display": "block"
            });
        } else {
            _this.raw.guideButton.on = false;
            $("#" + _this.raw.guideId).css({
                "display": "none"
            });
        }
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates the guide window and its dimensions, positioning, style.
 *
 * @this Guide
 */

Guide.prototype.configureWindow = function () {

    var template = "#" + this.raw.guideId,
        w = window.innerWidth / 2,
        h = window.innerHeight / 2,
        top = window.innerHeight / 4,
        left = window.innerWidth / 4,
        el = this.raw.guide;

    el.className = "guide";

    $(template).css({
        "display": "none",
        "left": left,
        "top": top,
        "width": w,
        "height": h
    });

    if (this.raw.guide.styles) {
        $(template).css(this.raw.guide.styles);
    }
};

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Creates the game Inventory.
 *
 * @param game {object} Current game instance.
 * @param width {number} Phaser game window width.
 * @param height {number} Phaser game window height.
 * @param mouse {Mouse} Mouse object.
 * @param escape {object} Phaser key object.
 * @param itemGroup {object} Phaser Isometric sprite group.
 * @param map {Map} Game's Map object.
 *
 * @property game {object} Current game instance.
 * @property map {Map} Game's Map object.
 * @property width {number} Game window width.
 * @property height {number} Game window height.
 * @property mouse {Mouse} Mouse object.
 * @property escape {object} Phaser escape key.
 * @property messages {Message} Message object.
 * @property times {number} Number of times tooltips have been viewed.
 * @property menuGroup {object} Menu sprite group.
 * @property itemGroup {object} Isometric sprite group.
 *
 * @property area {object} Total space allocated to Inventory module.
 * @property area.width {number} Width of Inventory module space.
 * @property area.height {number} Height of Inventory module space.
 *
 * @property element {object} Total space allocated to each Inventory item.
 * @property element.width {number} Width of each Inventory item.
 * @property element.height {number} Height of each Inventory item.
 *
 * @property sprites {object[]} Inventory item objects.
 *
 * @class {object} Inventory
 * @this Inventory
 * @constructor
 *
 * @todo implement tooltip stuff.
 */

function Inventory(game, map, width, height, mouse, escape, itemGroup) {

    this.game = game;
    this.width = width;
    this.height = height;
    this.mouse = mouse;
    this.escape = escape;
    this.times = 0;
    this.map = map;

    this.items = [];
    this.itemsRow = [];

    var graphics = game.add.graphics(0, 0),
        menuGroup = game.add.group(),
        areaWidth = 260,
        areaHeight = 300,
        elementWidth = 65,
        elementHeight = 60;

    this.i = areaHeight;
    this.j = areaWidth;

    menuGroup.fixedToCamera = true;
    menuGroup.enableBody = true;
    this.menuGroup = menuGroup;
    this.itemGroup = itemGroup;

    graphics.fixedToCamera = true;
    graphics.lineStyle(2, 0xFF0000, 1);
    graphics.beginFill(0xFF0000, 0.4);
    graphics.drawRect(width - areaWidth, height - areaHeight, areaWidth, areaHeight);
    this.graphics = graphics;

    this.area = {};
    this.area.width = areaWidth;
    this.area.height = areaHeight;

    this.element = {};
    this.element.width = elementWidth;
    this.element.height = elementHeight;

    window.graphics = graphics;

    this.messages = new Message(this.game, this.height, 14);
    this.contextMenu = new ContextMenu(this);

    this.onClick();
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Adds an item to the inventory.
 *
 * @param item {Item} Item to be added.
 */

Inventory.prototype.addItem = function (item) {

    var w = this.element.width,
        h = this.element.height,
        x = this.width - this.j,
        y = this.height - this.i,
        name = item.key;

    item.inventorySprite = this.game.add.sprite(x, y, item.key, null, this.menuGroup);
    item.inventorySprite.width = w;
    item.inventorySprite.height = h;

    item.inventorySprite.row = (this.area.height - this.i) / h;
    item.inventorySprite.col = (this.area.width - this.j) / w;

    item.inventorySprite.inputEnabled = true;
    item.inventorySprite.input.useHandCursor = true;

    item.text = this.game.add.text(x, y, name, {
        font: "Courier",
        fontSize: 12,
        fill: "white"
    });

    item.text.fixedToCamera = true;

    this.j -= w;
    this.itemsRow.push(item);
    this.items[item.inventorySprite.row] = this.itemsRow;
    this.count++;

    if (this.j === 0) {

        this.count = 0;
        this.i -= h;
        this.j = this.area.width;
        this.items[item.inventorySprite.row + 1] = [];
        this.itemsRow = [];
    } else if (this.i === 0) {
        throw new RangeError("Number of sprites exceeds the number of available tiles.");
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Loads an array of Items into the Inventory.
 *
 * @param items {Item[]} Array of Items to be loaded.
 *
 * @this Inventory
 *
 * @see Item
 * @see Loader#items
 */

Inventory.prototype.addItems = function (items) {
    var _this2 = this;

    if (!Array.isArray(items)) {
        throw new Error("Use addItem for single items.");
    } else {
        items.forEach(function (item) {
            _this2.addItem(item);
        });
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Handles clicks and escape keydowns.
 *
 * @this Inventory
 *
 * @see{@link Mouse}
 */

Inventory.prototype.onClick = function () {
    var _this3 = this;

    this.game.input.onDown.add(function () {
        if (_this3.mouse.switch) {
            _this3.placeItem();
        } else {
            _this3.click();
        }
    });

    this.escape.onDown.add(function () {
        _this3.mouse.switch = false;
        _this3.mouse.reset();
        _this3.reset();
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Alters Inventory items when they are clicked on.
 *
 * @this Inventory
 */

Inventory.prototype.click = function () {

    var _this = this;

    this.game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
        _this.contextMenu.createContextMenu();
    };

    var cornerX = this.width - this.area.width,
        cornerY = this.height - this.area.height,
        relativeX = this.mouse.twoD.x - cornerX,
        relativeY = this.mouse.twoD.y - cornerY;

    if (this.mouse.twoD.x > cornerX && this.mouse.twoD.y > cornerY) {

        var col = Math.floor(relativeX / this.element.width),
            row = Math.floor(relativeY / this.element.height),
            item;

        if (this.items[row][col]) {

            item = this.items[row][col];

            if (this.currentItem) {
                this.currentItem.inventorySprite.tint = 0xFFFFFF;
                this.currentItem.inventorySprite.clicked = false;
                this.currentItem.inventorySprite.useHandCursor = true;
            }

            this.mouse.switch = true;
            item.inventorySprite.clicked = true;
            item.inventorySprite.tint = 0xFFDD00;
            item.text.tint = 0xFFDD00;

            this.currentItem = item;
        }
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets all Inventory sprites.
 *
 * @this Inventory
 */

Inventory.prototype.reset = function () {

    this.menuGroup.forEach(function (item) {
        item.input.useHandCursor = true;
        item.tint = 0xFFFFFF;

        if (item.clicked) {
            item.clicked = false;
        }
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc If <code>this.mouse</code> is in selected mode, on mousedown, add a sprite if that tile is discovered. Otherwise,
 * display a "you can't do that" message.
 *
 * @this Inventory
 */

Inventory.prototype.placeItem = function () {

    var tileSize = this.mouse.map.tileSize,
        x = this.mouse.threeD.x - this.mouse.threeD.x % tileSize,
        y = this.mouse.threeD.y - this.mouse.threeD.y % tileSize,
        item = this.currentItem,
        key = item.key,
        tile = this.mouse.tile,
        message = "Sorry, you can't place the " + key + " there. Choose a place that you've already seen!",
        row,
        col;

    if (tile.discovered && isInBounds(this.mouse)) {

        row = item.inventorySprite.row;
        col = item.inventorySprite.col;

        item.sprite = this.game.add.isoSprite(x, y, 0, key, null, this.itemGroup);
        item.threeDInitialize();

        item.action();
        item.inventorySprite.destroy();
        item.text.destroy();

        this.items[row][col] = null;
        this.mouse.reset();
        this.mouse.switch = false;
    } else {
        this.messages.add(message);
    }
};

"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/15/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc The Message structure handles all the popup messages in the game.
 *
 * @param game {object} Current Phaser game instance.
 * @param y {number} Height of the game.
 * @param size {number} Font size.
 *
 * @property game {object} Phaser game instance.
 * @property y {number} Height of the game.
 * @property message {string | string[]} Message to be displayed.
 * @property fontSize {number} Font size.
 * @property style {object} Message styling.
 * @property style.font {string} Font style.
 * @property style.fill {string} Hexadecimal color value.
 * @property alert {Signal} Signal.
 *
 * @class {object} Message
 * @this Message
 * @constructor
 */

function Message(game, y, size) {
    var _this = this;

    this.game = game;
    this.y = y;
    this.message = "";
    this.fontSize = size;
    this.style = {
        font: size + "px Courier",
        fill: "#FFFFFF"
    };

    this.alert = new Phaser.Signal();

    this.alert.add(function () {
        _this.display();
    });
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Adds the provided message to the queue.
 *
 * @param message {string} Message to be added to the queue.
 *
 * @this Message
 */

Message.prototype.add = function (message) {
    this.message = message;
    this.alert.dispatch();
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays the message on the screen for five seconds, with in and out tweens.
 *
 * @this Message
 *
 * @todo get messages queue to work
 */

Message.prototype.display = function () {
    var _this2 = this;

    var str = this.format(this.message);

    this.text = this.game.add.text(str.width, str.height, str.message, this.style);

    this.text.alpha = 0;
    this.text.fixedToCamera = true;

    this.game.add.tween(this.text).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

    this.game.time.events.add(Phaser.Timer.SECOND * 5, function () {
        _this2.game.add.tween(_this2.text).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Formats messages so they are 60 characters wide.
 *
 * @param message {string} Message to be formatted.
 *
 * @returns {{width: number, height: number, message: string}} Width and height of Phaser message area; formatted string.
 *
 * @todo Format according to where words are, not just the 60th character.
 */

Message.prototype.format = function (message) {
    var last = 0,
        strs = [],
        dist = message.length % 60 ? message.length - message.length % 60 : 0;

    for (var i = 0; i < message.length; i++) {

        if (!(i % 60) && i !== 0) {
            strs.push(message.slice(last, i) + "\n");
            last = i;
        } else if (dist === 0 && i === message.length - 1) {
            strs.push(message.slice(last, message.length));
        } else if (i > dist && dist !== 0) {
            strs.push(message.slice(last, message.length));
            break;
        }
    }

    return {
        width: 10,
        height: this.y - strs.length * (this.fontSize * 1.8),
        message: strs.join(" ")
    };
};

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

function Player(game, row, col, keys, group, map) {
    var _sprite$anchor;

    this.type = "player";
    this.map = map;

    var x = row * this.map.tileSize,
        y = col * this.map.tileSize;

    this.game = game;
    this.keys = keys;

    // initialize the isosprite and set the game's anchor
    this.sprite = this.game.add.isoSprite(x, y, 0, keys[0], null, group);
    (_sprite$anchor = this.sprite.anchor).set.apply(_sprite$anchor, _toConsumableArray(globals.anchor));
    this.sprite.body.collideWorldBounds = true;

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
 * @desc Tracks the 3x3 vision radius of the Player, and changes tiles within that radius to "discovered".
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

Player.prototype.float = function () {

    this.sprite.isoZ = 5 + Math.sin(this.game.time.now * 0.005);
};
