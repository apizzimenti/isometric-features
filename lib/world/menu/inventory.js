/**
 * Created by apizzimenti on 5/19/16.
 */

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

function Inventory (game, map, width, height, mouse, escape, itemGroup) {

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
    this.contextMenu = new contextMenu(this);

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

    if (item.key.includes("bunny")) {
        name = "bunny";
    }

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

    if (!Array.isArray(items)) {
        throw new Error("Use addItem for single items.");
    } else {
        items.forEach((item) => {
            this.addItem(item);
        })
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

    var that = this;
    this.game.input.onDown.add(() => {
        if (that.mouse.switch) {
            that.placeItem();
        } else {
            that.click();
        }
    }, that);

    this.escape.onDown.add(() => {
        this.mouse.switch = false;
        this.mouse.reset();
        this.reset();
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

    this.menuGroup.forEach((item) => {
        item.input.useHandCursor = true;
        item.tint = 0xFFFFFF;

        if (item.clicked) {
            item.clicked = false;
        }
    })
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
        x = this.mouse.threeD.x - (this.mouse.threeD.x % tileSize),
        y = this.mouse.threeD.y - (this.mouse.threeD.y % tileSize),
        item = this.currentItem,
        key = item.key,
        tile = this.mouse.tile,
        message = `Sorry, you can't place the ${key} there. Choose a place that you've already seen!`,
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
        this.messages.add(message)
    }
};