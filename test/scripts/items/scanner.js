/**
 * Created by apizzimenti on 6/8/16.
 */

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Scanner object.
 *
 * @param game {object} Current game instance.
 * @param inventoryKey {string} Cached Phaser image or texture.
 * @param keys {string[]} Array of cached Phaser images.
 * @param inventory {Inventory} Game's Inventory.
 *
 * @class {object} Scanner
 * @this Scanner
 * @constructor
 *
 * @extends Item
 */

function Scanner (game, inventoryKey, inventory, keys, space) {

    Item.call(this, game, inventoryKey, inventory);

    this.keys = keys;
    this.setting = false;
    this.scanning = false;
    this.space = space;
}

// Scanner inherits from the Item class.

Scanner.prototype = Object.create(Item.prototype);

/**
 * @author Anthony Pizzimenti
 *
 * @desc After selection from the menu, this function sets up rotate event listeners and 3d direction mapping.
 *
 * @this Scanner
 *
 * @override
 */

Scanner.prototype.action = function () {

    var i = 0;

    direction(this);
    this.setting = true;
    
    this.rotateListeners();
    
    this.space.onDown.add(() => {
        i++;
        i = i > 3 ? 0 : i;
    
        this.sprite.direction = i;
        this.inventory.mouse.reset();
    });
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc The listener for rotate events. On click, fires a message to the game window.
 *
 * @this Scanner
 */

Scanner.prototype.rotateListeners = function () {

    this.inventory.messages.add(
        "Place the camera where you want and click. Then, scroll the mouse wheel to change its direction, and click again to set."
    );

    this.game.input.onDown.add(() => {
        this.space.onDown.dispose();
        this.setting = false;
        this.scanning = true;
        this.inventory.mouse.reset();
        this.tiles();
    });
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Determines the watch radius for the scanner.
 *
 * @this Scanner
 */

Scanner.prototype.setRadius = function () {

    var top = this.sprite.tile.top,
        tileMap = this.map.tileMap,
        row = top.row >= tileMap.length - 1 ? top.row - 1 : top.row,
        col = top.col >= tileMap.length - 1 ? top.col - 1 : top.col,
        tiles = [];

    switch (this.sprite.direction) {

        case 0:
            tiles = [top, tileMap[row + 1][col]];
            break;

        case 1:
            tiles = [top, tileMap[row][col - 1]];
            break;

        case 2:
            tiles = [top, tileMap[row - 1][col]];
            break;

        case 3:
            tiles = [top, tileMap[row][col + 1]];
            break;
    }

    tiles.forEach((tile) => {
        tile.tint = 0xC20C94;
        tile.alpha = 1.3 + Math.sin((this.game.time.now + tile.row + tile.col) * 0.007);
    });

    this.radius = tiles;
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Constantly scans for Animals passing within the scanner radius. If an Animal that has not been scanned and is
 * visible to the player passes through this radius, the Animal's <code>scan</code> event is fired and then immediately
 * destroyed. This event then chain-fires an event to a listener within Angular.
 *
 * @param animals {Animal[]} Array of Animals in the current game.
 *
 * @this Scanner
 */

Scanner.prototype.pictures = function (animals) {

    animals.forEach((animal) => {
        
        var f = this.radius[0],
            s = this.radius[1],
            center = animal.sprite.tile.center,
            scanned = animal.scanned,
            visible = animal.sprite.visible;

        if ((center.compareTo(f) || center.compareTo(s)) && !scanned && visible) {
            animal.scanned = true;
            animal.scan.dispatch({animal});
            animal.scan.dispose();
        }
    });
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Changes radial tiles to a specific tint.
 *
 * @this Scanner
 */

Scanner.prototype.tiles = function () {

    this.radius.forEach((tile) => {
        tile.tint = 0xC20C94
    })
};
