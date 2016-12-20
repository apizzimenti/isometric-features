/*! isometric-features - v0.0.1 - 2016-12-20
* Copyright (c) 2016 ; Licensed MIT */
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
 * @desc If the Sprite is auto-loaded, analyze direction; otherwise, wait.
 *
 * @param Sprite {Animal | Player | Item} Object containing a Phaser isometric sprite.
 *
 * @see Animal
 * @see Player
 * @see Item
 */

function direction(Sprite) {

    if (Sprite.auto) {
        _assignDirection(Sprite);
    }
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Computes the current direction of the given Sprite.
 *
 * @param Sprite {Animal | Player | Item} Object containing a Phaser isometric sprite.
 *
 * @private
 *
 * @see determineTileRadius
 */

function _assignDirection(Sprite) {

    var sprite = Sprite.sprite,


    // gets front (x, y) coordinates of sprite wireframe
    x = sprite.body.frontX,
        y = sprite.body.frontY,
        tileMap = Sprite.map.tileMap,
        tileSize = Sprite.map.tileSize,


    // calculates sprite row/column position; if (x, y) pair is out of world bounds, force it to the nearest row/column
    row = Math.ceil(x / tileSize) >= tileMap.length - 1 ? tileMap.length - 1 : Math.ceil(x / tileSize),
        col = Math.ceil(y / tileSize) >= tileMap[0].length - 1 ? tileMap[0].length - 1 : Math.ceil(y / tileSize),
        dir = sprite.direction,


    // returns adjusted position values for calculating vision radius
    r = determineTileRadius(tileMap.length, row),
        c = determineTileRadius(tileMap[0].length, col),


    // adjusted position values for vision radius
    rp = r.p,
        rm = r.m,
        cp = c.p,
        cm = c.m;

    // assigns sprite row, column properties
    sprite.row = row;
    sprite.col = col;

    // finds the tile at the center of the sprite's hitwireframebox
    // (I asked my girlfriend to help me choose between "wireframe" and "hitbox" and she came up with "hitwireframebox", so)
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

    // loads the correct texture based on the sprite's direction
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
 * @param direction {number} Direction.
 */

function forceDirection(sprite, direction) {

    var speed = 20,
        s = sprite.sprite;

    // forces velocity in a given direction
    switch (direction) {
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

function shrinkPath(path) {

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

            // each number pushed into last[] describes a direction; compares current and next instruction to
            // determine direction
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

/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets a sprite.
 *
 * @param sprite {Animal | Player} The sprite to be reset.
 * @param body {boolean} Will the sprite's body move?
 */

function resetSprite(sprite, body) {

    var s = sprite.sprite;

    s.body.velocity.x = 0;
    s.body.velocity.y = 0;
    s.direction = 0;

    s.body.moves = !body;
}
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

    // gets middle screen position
    this.x = this.game.width / 2;

    this.y = 20;
    this.color = "#FFF";
    this.on = false;

    // add graphics and assign _this = this to preserve context
    var graphics = game.add.graphics(0, 0),
        _this = this;

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

            // try to write sprite wireframes to the game window;
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
                // if they aren't loaded yet, send a warning to the console window
                console.warn(`${ sprite.type } is not yet loaded`);
            }
        };

        // check if sprites is an array or a single sprite
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
(function () {})();
/**
 * Created by apizzimenti on 5/19/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc A set of variables that have to be used in disparate locations.
 * 
 * @type {{anchor: number[], mapTileKey: string[], tween: object[], paramNotExist: function}}
 *
 * @property anchor {number[]} Globalized anchor for all sprites.
 * @property mapTileKey {string[]} Will contain keys for tile sprites.
 * @property tween {array} Default tween settings.
 * @property paramNotExist {function} Global testing method for parameters.
 * @property colorTween {function}
 */

var Globals = {
    anchor: [0.5, 0],
    mapTileKey: [],
    tween: [1000, Phaser.Easing.Linear.None, true, 0, 0, false],

    paramNotExist: function (param, type) {
        return typeof param !== type || param == undefined;
    },

    colorTween: function (game, object, start, end, t) {

        console.dir(object);

        var blend = { step: 0 },
            tween = game.add.tween(blend).to({ step: 100 }, t);

        tween.onUpdateCallback(() => {
            object.tint = Phaser.Color.interpolateColor(start, end, 100, Math.floor(blend.step), 1);
        });

        object.tint = start;
        tween.start();
    }
};
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

    // create a new Point3 to project 2d position onto isometric map
    this.pos = new Phaser.Plugin.Isometric.Point3();

    var x = this.game.input.mousePointer.x,
        y = this.game.input.mousePointer.y;

    // note 2d and 3d points
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

    // assigns inBounds property to check if mouse is within physics world bounds.
    this.inBounds = this.threeD.x > backX && this.threeD.x < frontX && this.threeD.y > backY && this.threeD.y < frontY;
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc If the mouse is in selected mode (i.e. <code>switch</code> is true), this determines the tile to animate.
 *
 * @param [animation] {Object} Container for custom mouse on-select animation.
 *
 * @example
 * // values shown in this example animation object are the default values for the system
 *
 * var animation = {
 *         tint: 0x98FB98,                                          // hexadecimal color
 *         alpha: 1.3 + Math.sin(this.game.time.now * 0.007),       // value applied to tile transparency
 *         tween: [{isoZ: 5}, 20, Phaser.Easing.Linear.None, true]  // tween arguments to modify tile physics properties
 *     }
 *
 * @this Mouse
 */

Mouse.prototype.selected = function (animation) {

    var notExist = Globals.paramNotExist(animation, "object");

    if (this.inBounds) {

        this.group.forEach(tile => {

            if (tile.type === "tile") {

                var inside = tile.isoBounds.containsXY(this.threeD.x + this.map.tileSize, this.threeD.y + this.map.tileSize);

                if (inside) {

                    this.tile = tile;

                    this.row = tile.row;
                    this.col = tile.col;

                    tile.tint = notExist ? 0x98FB98 : animation.tint || 0x98FB98;
                    tile.alpha = notExist ? 1.3 + Math.sin(this.game.time.now * 0.007) : animation.alpha || 1.3 + Math.sin(this.game.time.now * 0.007);
                } else if (!inside) {
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

    this.group.forEach(tile => {

        if (tile.type === "tile") {
            tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
            tile.alpha = 1;
            tile.isoZ = 0;
            this.game.canvas.style.cursor = "default";
        }
    });
};
(function () {})();
/**
 * Created by apizzimenti on 5/19/16.
 * This is automatically included in the isometric-features package to provide its users some ease-of-use.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Setup object.
 *
 * @param game {object} Current Phaser game instance.
 * @param scope {object} Angular scope.
 *
 * @property game {object} Phaser game instance.
 * @property scope {object} Angular scope.
 *
 * @class Setup
 * @constructor
 * @this Setup
 */

function System(game, scope) {
    this.game = game;
    this.scope = scope;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Binds the left, right, up, and down keys to the running game instance.
 *
 * @param game {object} Phaser game instance.
 * @param context {object} the context game is bound to.
 *
 * @returns {{esc: object, space: object}}
 *
 * @this System
 */

System.prototype.keymap = function (game, context) {

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
 *
 * @this System
 */

System.prototype.keymapTrack = function (Player, context) {

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
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Called in the default state's preload() function property.
 *
 * @property tiles {Phaser.Group} Phaser group dedicated to tiles.
 * @property characters {Phaser.Group} Phaser group dedicated to moving sprites.
 *
 * @this System
 */

System.prototype.preload = function () {

    // add isometric plugin
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

    // new group for tiles
    this.tiles = this.game.add.group();
    this.tiles.enableBody = true;
    this.tiles.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

    // new group for moving sprites
    this.characters = this.game.add.group();
    this.characters.enableBody = true;
    this.characters.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

    // start the physics system and set the anchor for the game
    this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    this.game.iso.anchor.setTo(...Globals.anchor);

    // set the world bounds; these aren't the bounds of the physics system, but are larger than the game window
    // so the camera follows the Player
    this.game.world.setBounds(0, 0, 2400, 2400);

    // set up game properties
    this.game.time.advancedTiming = true;
    this.game.debug.renderShadow = false;
    this.game.stage.disableVisibilityChange = true;

    // shoot some messages into the console when the onLoad event is fired.
    this.scope.$on("load", e => {

        var host = window.location.origin + "/",
            docs = "https://apizzimenti.github.io/isometric-features-docs/";

        console.log("%c documentation " + `%c ${ docs }`, "background: #0095dd; color: #FFF", "color: #5D5D5D");
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Called in the default state's update() function.
 *
 * @param context {object} Context to which the space, escape, and arrow keys are attached.
 * @param characters {Phaser.Group} Group dedicated to moving sprites.
 * @param [player=null] {Player} Main character.
 * @param [creatures=null] {Animal[]} Array of animal sprites.
 * @param [mouse=null] {Mouse} Game's Mouse object.
 * @param [props=null] {object} Properties for mouse animation.
 *
 * @see Mouse#selected
 *
 * @this System
 */

System.prototype.update = function (context, characters, player, creatures, mouse, props) {

    // collision physics
    // this.game.physics.isoArcade.collide(characters);
    this.game.iso.simpleSort(characters);

    // keep track of the Player's direction, keymapping, and restrict the vision radius
    if (Globals.paramNotExist(player)) {
        direction(player);
        this.keymapTrack(player, context);
        player.visionRadius();
    }

    // keep track of each Animal's direction
    if (Globals.paramNotExist(creatures)) {
        creatures.forEach(creature => {
            direction(creature);
            creature.isVisible(player);
        });
    }

    // mouse tracking; if the mouse switch is ON, make sure the tiles are glowing
    if (Globals.paramNotExist(mouse)) {
        mouse.update();

        if (mouse.switch) {
            Globals.paramNotExist(props) ? mouse.selected(props) : mouse.selected();
        }
    }
};
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

function Animal(game, scope, row, col, keys, group, map, species, scale, auto) {

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

    this.loopedMovement = this.game.time.events.loop(Phaser.Timer.SECOND * 3 + this.rand, () => {
        dir = Math.floor(Math.random() * 4);
        this.rand = Math.random() * 3;
        forceDirection(this, dir);
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

    this.scan.add(() => {
        this.scope.$emit("scanned", { animal: this });
    });

    this.scope.$on("pathfind", (e, data) => {
        this._pathfind(data.row, data.col);
    });
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

    e.findPath(row, col, itemRow, itemCol, path => {

        if (!path) {
            console.log("path not found");
        } else {
            this.game.time.events.remove(this.loopedMovement);
            dirs = shrinkPath(path);
            resetSprite(this, true);
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

        this.sprite.tween = this.game.add.tween(this.sprite).to({ isoX: x, isoY: y }, ...Globals.tween);

        this.sprite.tween.onComplete.add(() => {
            this.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);

            this._followDirection(false, path, dirs);
        });
    } else if (!begin && !end) {

        tween = this.game.add.tween(this.sprite);
        this.sprite.tween.chain(tween.to({ isoX: x, isoY: y }, ...Globals.tween));

        tween.onComplete.add(() => {
            this.sprite.direction = dirs[0];
            path.splice(0, 1);
            dirs.splice(0, 1);

            this._followDirection(false, path, dirs);
        });
    } else if (!begin && end) {

        resetSprite(this, false);
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
 * @param [name=Item.key] {string} Item's name to be displayed in the Inventory.
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
 * @property auto {boolean} Is this sprite automatically loaded?
 * @property direction {number} This sprite's default direction.
 * @property location {number} When this item is selected, this is its index in the linked list of items.
 *
 * @class {object} Item
 * @this Item
 */

function Item(game, key, inventory, name) {

    this.keys = [key, key, key, key];

    this.game = game;
    this.key = key;

    if (name) {
        this.name = name;
    } else {
        this.name = key;
    }

    this.inventory = inventory;
    this.text = {};

    this.inventorySprite = {};
    this.sprite = {};
    this.sprite.tile = {};
    this.sprite.direction = 0;
    this.map = this.inventory.map;
    this.auto = true;
    this.location = 0;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Default action method. Can and should be overwritten on a per-item basis.
 *
 * @this Item
 */

Item.prototype.action = function () {
    console.warn(`${ this.key } is using the builtin action method`);
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Initializes objects for the isometric physics system.
 *
 * @this Item
 */

Item.prototype.threeDInitialize = function () {

    this.sprite.anchor.set(...Globals.anchor);
    this.sprite.body.collideWorldBounds = true;
    this.game.physics.isoArcade.enable(this.sprite);
    this.sprite.enableBody = true;

    this.sprite.tile = {};
    this.sprite.direction = 0;

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
 * @param tileSet Tileset and corresponding JSON or tile key.
 * @param tileSize {number} Size of an individual tile.
 * @param mapSize {number} Desired map size.
 * @param [preferredTiles=object[]] {object[]} Array of tiles; by default, the Map class creates this for you.
 * @param [fog=true] {boolean} Is the fog of war on or off?
 *
 * @property game {object} Current game instance.
 * @property tileSet Tileset and corresponding JSON.
 * @property tileSize {number} Size of an individual tile.
 * @property mapSize {number} Set map size.
 * @property tileMap {sprite[]} Array of tile sprites.
 * @property group {object} Phaser game group.
 * @property blocked {number[]} Array of numbers indicating which tiles are blocked (1) and which aren't (0).
 * @property fog {boolean} Is the fog of war on or off?
 *
 * @class {object} Map
 * @this Map
 * @constructor
 */

function Map(game, group, tileSet, tileSize, mapSize, preferredTiles, fog) {

    var tile,
        tileArray = [],
        blockedArray = [],
        tiles = preferredTiles || this._createTileMap(mapSize),
        worldBounds = dim(tileSize, mapSize, 1),
        atlas_json_exists = game.cache.checkImageKey(tileSet),
        frame = null;

    this.game = game;
    this.tileSet = tileSet;
    this.tileSize = tileSize;
    this.mapSize = mapSize;
    this.group = group;

    if (!Globals.paramNotExist(fog)) {
        this.fog = false;
    } else {
        this.fog = fog;
    }

    if (atlas_json_exists) {
        this._generateMapKeys();
        frame = Globals.mapTileKey[3];
    } else {
        frame = null;
    }

    for (var row = 0; row < tiles.length; row++) {

        tileArray[row] = [];
        blockedArray[row] = [];

        for (var col = 0; col < tiles[0].length; col++) {

            tile = this.game.add.isoSprite(row * this.tileSize, col * this.tileSize, 0, this.tileSet, frame, this.group);

            if (col > tiles.length - 2 || row < 1 || row > tiles.length - 2 || col < 1) {
                tile.blocked = true;
                blockedArray[row].push(0);
            } else {
                tile.blocked = false;
                blockedArray[row].push(1);
            }

            tile.tint = this.fog ? 0x571F57 : 0xFFFFFF;

            tile.discovered = !this.fog;
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
 * @private
 *
 * @param size {number} Desired map size.
 *
 * @returns {sprite[]}
 */

Map.prototype._createTileMap = function (size) {

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

/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates global list of available tile keys.
 *
 * @private
 *
 * @this Map
 */

Map.prototype._generateMapKeys = function () {
    for (var frame of this.game.cache._cache.image[this.tileSet].frameData._frames) {
        Globals.mapTileKey.push(frame.name);
    }
};
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
 *
 * @todo Accept actions param which provides {key => value} pairs that describe actions and provide callbacks
 */

ContextMenu.prototype.createContextMenu = function (actions) {
    var x = this.mouse.twoD.x,
        y = this.mouse.twoD.y,
        graphics = this.game.add.graphics(0, 0);

    graphics.fixedToCamera = true;
    graphics.lineStyle(2, 0xFFFF00, 1);
    graphics.beginFill(0xFFFF00, 0.4);
    this.graphics = graphics;

    this.menu = this.graphics.drawRect(x, y, 100, 150);

    this.mouse.mouse.onDown.add(() => {
        this.menu.destroy();
    });
};
(function () {})();
/**
 * Created by apizzimenti on 7/21/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Element for containing how-to information and making it visible (or invisible) to the player. The guide
 * will always appear in the center of the sceen and be 1/2 the dimensions of the game window (unless overridden).
 *
 * @param element {string} String id for the HTML element that will serve as your guide..
 * @param gameElement {string} String id for element that hosts the game canvas (the same name as when the Phaser game is initialized).
 * @param [buttonOptions=null] {object} Button text and style options.
 * @param [buttonOptions.text="i"] {string} Text displayed within the button.
 * @param [buttonOptions.style={}] {object} Styling for guide button.
 * @param [buttonOptions.hover={}] {object} Styling for guide button
 * @param [menuStyles=null] {object} Custom style overrides.
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
 * // check the test folder for a usable example.
 *
 * @class Guide
 * @constructor
 */

function Guide(element, gameElement, buttonOptions, menuStyles) {

    // setup work

    var _this = this;

    // contains javascript object references to guide text elements
    this.raw = {};

    // if the buttonOptions param exists, assign it
    if (!Globals.paramNotExist(buttonOptions)) {
        this.raw.buttonOptions = buttonOptions;
    } else {
        this.raw.buttonOptions = null;
    }

    // default styles for the button
    this.raw.buttonOptions.default = {
        "color": "#FFF",
        "border": "none",
        "font-size": "20px",
        "background-color": "transparent"
    };

    this.raw.guideId = element;
    this.raw.canvasId = gameElement;

    // retrieve html objects with passed parameters; retrieve canvas element from game
    this.raw.guide = document.getElementById(element);
    this.raw.game = document.getElementById(gameElement);
    this.raw.canvas = this.raw.game.getElementsByTagName("canvas")[0];

    // get the html (not just the text) from the guide block
    this.raw.guideHtml = this.raw.guide.innerHTML;

    // retrieve offsets
    this.raw.offsetTop = this.raw.canvas.offsetTop;
    this.raw.offsetLeft = this.raw.canvas.offsetLeft;
    this.raw.on = false;
    this.raw.guide.styles = menuStyles || null;

    $(document).ready(() => {
        // jquery object reference to find the specific guide element
        _this.guideElement = $(`#${ element }`);

        // on ready, configure the window and instantiate the button
        _this._configureWindow();
        _this._button();
    });
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates a _button on top of the game canvas for displaying help information.
 *
 * @private
 *
 * @this Guide
 */

Guide.prototype._button = function () {

    // note: I do not like jquery or designing user interfaces at all.

    // create a new button element
    var button = document.createElement("button"),


    // add text based on options or, if options is null, put the classic "i"
    buttonText = document.createTextNode(this.raw.buttonOptions.text || "i"),
        id = "guideButton",


    // template now points to the jquery object reference
    template = `#${ id }`,
        _this = this;

    button.id = id;

    // attach text html object to game window
    button.appendChild(buttonText);
    this.raw.game.appendChild(button);
    this.raw.guideButton = button;

    // change classname
    this.raw.guideButton.className = "guide-button";
    this.raw.guideButton.on = false;
    this.raw.guideButton.template = template;

    // change offsets
    $(template).css({
        "top": _this.raw.offsetTop + 20,
        "left": _this.raw.offsetLeft + 20
    });

    // if custom style arguments were provided, use them
    if (this.raw.buttonOptions.style) {
        $(template).css(this.raw.buttonOptions.style);
    }

    // since hovering is super finnicky and isn't great with CSS, do it in jquery (which is arguably worse)
    $(template).hover(function () {
        $(template).css({
            "cursor": "pointer"
        });

        if (_this.raw.buttonOptions.hover) {
            $(template).css(_this.raw.buttonOptions.hover);
        }
    }, function () {
        $(template).css({
            "cursor": "default"
        });

        if (_this.raw.buttonOptions.style) {
            $(template).css(_this.raw.buttonOptions.style);
        } else {
            $(template).css(_this.raw.buttonOptions.default);
        }
    });

    // look at this! changing properties when you click on something takes 12 lines of ugly code! (sigh)
    $(template).click(() => {

        if (!_this.raw.guideButton.on) {
            _this.raw.guideButton.on = true;
            $(`#${ _this.raw.guideId }`).css({
                "display": "block"
            });
        } else {
            _this.raw.guideButton.on = false;
            $(`#${ _this.raw.guideId }`).css({
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
 * @private
 *
 * @this Guide
 */

Guide.prototype._configureWindow = function () {

    // grab the jquery reference to the guide element itself
    var template = `#${ this.raw.guideId }`,


    // get the offsets of the game canvas so we can position the guide window accordingly
    offset = $(`#${ this.raw.canvasId }`).offset(),
        canvas = this.raw.canvas,


    // do a bit of math to appropriately position the window in the center of the screen but within the canvas
    w = canvas.width / 2,
        h = canvas.height / 2,
        top = h / 2 + offset.top,
        left = (window.innerWidth - canvas.offsetWidth + w) / 2,
        el = this.raw.guide;

    // apply classname so that static styles from the CSS can be applied
    el.className = "guide";

    // switch up the offsets
    $(template).css({
        "display": "none",
        "left": left,
        "top": top,
        "width": w,
        "height": h
    });

    // if custom styles exist, apply them
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
 * @param mouse {Mouse} Mouse object.
 * @param escape {object} Phaser key object.
 * @param itemGroup {object} Phaser Isometric sprite group.
 * @param map {Map} Game's Map object.
 * @param [messagePos="bottom_left"] {string} Location for messages to appear.
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
 * @property itemList {sList} Singly linked list of the items in the inventory.
 * @property itemCache {
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
 * @see Message
 *
 * @todo implement tooltip stuff.
 */

function Inventory(game, map, mouse, escape, itemGroup, messagePos) {

    this.game = game;
    this.width = this.game.width;
    this.height = this.game.height;
    this.mouse = mouse;
    this.escape = escape;
    this.times = 0;
    this.map = map;

    this.itemCache = {};

    // create graphics object
    var graphics = game.add.graphics(0, 0),
        menuGroup = game.add.group(),


    // dedicated widths and heights for item content
    areaWidth = 260,
        areaHeight = 300,
        elementWidth = 65,
        elementHeight = 60;

    // fix everything to camera
    menuGroup.fixedToCamera = true;

    menuGroup.enableBody = true;
    this.menuGroup = menuGroup;
    this.itemGroup = itemGroup;

    // fix graphics to camera
    graphics.fixedToCamera = true;

    // assign styles for lines and fill
    graphics.lineStyle(2, 0xFF0000, 0.5);
    graphics.beginFill(0xFF0000, 0.3);

    // draw inventory shape
    graphics.drawRect(this.width - areaWidth, this.height - areaHeight, areaWidth, areaHeight);

    this.graphics = graphics;

    // create a linked list to hold items
    this.itemList = new f.LinkedList([]);

    // create area and element objects to store widths and heights
    this.area = {};
    this.area.width = areaWidth;
    this.area.height = areaHeight;

    this.element = {};
    this.element.width = elementWidth;
    this.element.height = elementHeight;

    window.graphics = graphics;

    // create new message dispatcher
    this.messages = new Message(this.game, 14, messagePos);
    this.contextMenu = new ContextMenu(this);

    // click event handler
    this._onClick();
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Adds an item to the inventory.
 *
 * @param item {Item} Item to be added
 */

Inventory.prototype.addItem = function (item) {
    this.itemList.push(item);
};

Inventory.prototype._refit = function () {

    // remove all existing children from the group so each can be repositioned
    this.menuGroup.removeAll(true);

    var perRow = this.area.width / this.element.width,


    // group items by number of rows
    items = f.group(this.itemList.toArray(), perRow),
        item,
        x = this.width - this.area.width,
        y = this.height - this.area.height,
        w = this.element.width,
        h = this.element.height;

    for (var i = 0; i < items.length; i++) {

        var group = items[i];

        for (var j = 0; j < items[i].length; j++) {

            item = group[j];

            // create sprite at specified (x, y) coordinate pair
            item.inventorySprite = this.game.add.sprite(x, y, item.key, null, this.menuGroup);

            // force width/height
            item.inventorySprite.width = w;
            item.inventorySprite.height = h;

            // enable input to use hand cursor for selection
            item.inventorySprite.inputEnabled = true;
            item.inventorySprite.input.useHandCursor = true;

            // add text
            item.text = this.game.add.text(x, y, name, {
                font: "Courier",
                fontSize: 12,
                fill: "white"
            });

            // cache this item so it can be refitted later
            this.itemCache[item.key] = item;

            x += w;
        }

        x = this.width - this.area.width;
        y += h;
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

    if (!Array.isArray(items)) {
        console.warn("Use Inventory.addItem(item) for single items.");
    } else {
        items.forEach(item => {
            this.addItem(item);
        });
    }

    this._refit();
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Handles clicks and escape keydowns.
 *
 * @private
 *
 * @this Inventory
 *
 * @see{@link Mouse}
 */

Inventory.prototype._onClick = function () {

    this.game.input.onDown.add(() => {

        // if the user has selected an item
        if (this.mouse.switch) {
            // place it on the map
            this._placeItem();
        } else {
            // otherwise, let _click() handle it
            this._click();
        }
    });

    // if the user escapes, reset everything
    this.escape.onDown.add(() => {
        this.mouse.switch = false;
        this.mouse.reset();
        this._reset();
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Alters Inventory items when they are clicked on.
 *
 * @private
 *
 * @this Inventory
 */

Inventory.prototype._click = function () {

    var _this = this;

    // create context menu
    this.game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
        _this.contextMenu.createContextMenu();
    };

    // calculate the (x, y) coordinates of the inventory box location
    var cornerX = this.width - this.area.width,
        cornerY = this.height - this.area.height,


    // calculate corner bounds for mouse location
    relativeX = this.mouse.twoD.x - cornerX,
        relativeY = this.mouse.twoD.y - cornerY;

    if (this.mouse.twoD.x > cornerX && this.mouse.twoD.y > cornerY) {

        // get correct row, column, and position on map
        var col = Math.floor(relativeX / this.element.width),
            row = Math.floor(relativeY / this.element.height),
            loc = col + (row > 0 ? row * (this.area.height / this.element.height) - 1 : 0),
            item,


        // get items from linked list
        items = this.itemList.toArray();

        // if an item exists at the location that was clicked
        if (items[loc]) {

            item = items[loc];

            // if there is an item that has already been selected, reset it
            if (this.currentItem) {
                this.currentItem.inventorySprite.tint = 0xFFFFFF;
                this.currentItem.inventorySprite.clicked = false;
                this.currentItem.inventorySprite.useHandCursor = true;
            }

            // turn the mouse selection on
            this.mouse.switch = true;

            // set clicked and change tints
            item.inventorySprite.clicked = true;
            item.inventorySprite.tint = 0xFFDD00;
            item.text.tint = 0xFFDD00;

            this.currentItem = item;
            this.currentItem.location = loc;
        }
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets all Inventory sprites.
 *
 * @private
 *
 * @this Inventory
 */

Inventory.prototype._reset = function () {

    this.menuGroup.forEach(item => {
        item.input.useHandCursor = true;
        item.tint = 0xFFFFFF;

        // retrieve items from object cache
        this.itemCache[item.key].text.tint = 0xFFFFFF;

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
 * @private
 *
 * @this Inventory
 */

Inventory.prototype._placeItem = function () {

    // get size of the tiles in the map
    var tileSize = this.mouse.map.tileSize,


    // calculate the position of the mouse relative to the map
    x = this.mouse.threeD.x - this.mouse.threeD.x % tileSize,
        y = this.mouse.threeD.y - this.mouse.threeD.y % tileSize,
        item = this.currentItem,
        key = item.key,
        tile = this.mouse.tile,
        message = `Sorry, you can't place the ${ key } there. Choose a place that you've already seen!`;

    // if the selected tile is discovered and the mouse is in bounds
    if (tile.discovered && isInBounds(this.mouse)) {

        // add the isometric sprite to the map
        item.sprite = this.game.add.isoSprite(x, y, 0, key, null, this.itemGroup);

        // initialize the item
        item.threeDInitialize();

        // call the item's action (if there is none, a console warning is thrown)
        item.action();

        // destroy the item body and text in the inventory
        item.inventorySprite.destroy();
        item.text.destroy();

        // remove the item from the item list
        this.itemList.remove(this.currentItem.location);

        // reset the mouse
        this.mouse.reset();
        this.mouse.switch = false;

        // refit all the items
        this._refit();
    } else {
        this.messages.add(message);
    }
};
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
 * @param size {number} Font size.
 * @param [loc="bottom_left"] {string} Preferred location for messages: can be <code>"bottom_left"</code>, <code>"bottom_right"</code>,
 * <code>"top_left"</code>, or <code>"top_right"</code>.
 *
 * @property game {object} Phaser game instance.
 * @property y {number} Height of the game.
 * @property messages {string[]} Message queue.
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

function Message(game, size, loc) {

    this.game = game;
    this.y = this.game.height;
    this.messages = [];
    this.loc = loc;
    this.fontSize = size;

    this.style = {
        font: size + "px Courier",
        fill: "#FFFFFF"
    };

    // create Phaser signal dispatcher
    this.alert = new Phaser.Signal();

    // instantiate new events
    this.alert.add(() => {
        this._display();
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
    this.messages.push(message);

    if (this.messages.length <= 1) {
        this.alert.dispatch();
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays the message at the front of the queue on the screen for five seconds, with in and out tweens.
 *
 * @private
 *
 * @this Message
 */

Message.prototype._display = function () {

    // correctly format message
    var str = this._format(this.messages[0]),
        tween;

    // add message text
    this.text = this.game.add.text(str.x, str.y, str.msg, this.style);

    this.text.alpha = 0;
    this.text.fixedToCamera = true;

    // tween the text in
    this.game.add.tween(this.text).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {

        // tween the text out
        tween = this.game.add.tween(this.text).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

        // when the above tween is completed, reset the queue and dispactch the next message
        tween.onComplete.add(() => {
            this.messages = this.messages.slice(1, this.messages.length);
            if (this.messages.length !== 0) {
                this.alert.dispatch();
            }
        });
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Formats messages so they are 60 characters wide.
 *
 * @private
 *
 * @param message {string} Message to be formatted.
 *
 * @returns {{x: number, y: number, msg: string}} Width and height of Phaser message area; formatted string.
 *
 * @todo Format according to where words are, not just the 60th character.
 */

Message.prototype._format = function (message) {

    var last = 0,
        strs = [],
        dist = message.length % 60 ? message.length - message.length % 60 : 0,
        vals = {};

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

    switch (this.loc) {

        case "bottom_left":default:
            vals.x = 10;
            vals.y = this.y - strs.length * this.fontSize * 1.8;
            break;

        case "top_left":
            vals.x = 10;
            vals.y = strs.length * (this.fontSize * 1.8);
            break;

        case "top_right":
            vals.x = this.game.width - 540;
            vals.y = 10;
            break;

        case "bottom_right":
            vals.x = this.game.width - 540;
            vals.y = this.y - strs.length * this.fontSize * 1.8;
            break;
    }

    vals.msg = strs.join(" ");
    return vals;
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

function Player(game, row, col, keys, group, map, scale, auto) {

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
        tP = tweenParameters;

    if (Globals.paramNotExist(preTween, "object")) {
        throw new TypeError("preTween is not of type object");
    } else if (Globals.paramNotExist(tP, "object")) {
        throw new TypeError("tweenParameters is not of type object");
    } else if (postTween) {

        if (Globals.paramNotExist(postTween, "object")) {
            throw new TypeError("postTween parameter is not of type object");
        }

        this.postTween = {};
        this.postTween.props = postTween;
        this.postTween.f = function (_this) {
            for (var arg in _this.postTween.props) {
                if (_this.postTween.props.hasOwnProperty(arg)) {
                    _this.sprite[arg] = _this.postTween.props[arg];
                }
            }
        };
    }

    for (var init in preTween) {
        if (preTween.hasOwnProperty(init)) {
            this.sprite[init] = preTween[init];
        }
    }

    if (!tP.hasOwnProperty("properties")) {
        throw new ReferenceError("tweenParameters has no defined 'properties' property");
    } else if (!tP.hasOwnProperty("easing")) {
        throw new ReferenceError("tweenParameters has no defined 'easing' property");
    } else if (!tP.hasOwnProperty("duration")) {
        throw new ReferenceError("tweenParameters has no defined 'duration' property");
    } else {
        params[0] = tP.properties;
        params[1] = tP.duration;
        params[2] = tP.easing;
    }

    this.intro = this.game.add.tween(this.sprite).to(...params, false, 0, 0, false);
};

Player.prototype.addOuttro = function (tweenParameters) {};

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