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

    var graphics = game.add.graphics(0, 0),
        menuGroup = game.add.group(),
        areaWidth = 260,
        areaHeight = 300,
        elementWidth = 65,
        elementHeight = 60;

    menuGroup.fixedToCamera = true;
    menuGroup.enableBody = true;
    this.menuGroup = menuGroup;
    this.itemGroup = itemGroup;

    graphics.fixedToCamera = true;
    graphics.lineStyle(2, 0xFF0000, 0.5);
    graphics.beginFill(0xFF0000, 0.3);
    graphics.drawRect(this.width - areaWidth, this.height - areaHeight, areaWidth, areaHeight);
    this.graphics = graphics;

    this.itemList = new f.LinkedList([]);

    this.area = {};
    this.area.width = areaWidth;
    this.area.height = areaHeight;

    this.element = {};
    this.element.width = elementWidth;
    this.element.height = elementHeight;

    window.graphics = graphics;

    this.messages = new Message(this.game, 14, messagePos);
    this.contextMenu = new ContextMenu(this);

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
        throw new Error("Use addItem(item) for single items.");
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
        if (this.mouse.switch) {
            this._placeItem();
        } else {
            this._click();
        }
    });

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
            loc = col + (row > 0 ? row * (this.area.height / this.element.height) - 1 : 0),
            item,
            items = this.itemList.toArray();

        if (items[loc]) {

            item = items[loc];

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

    var tileSize = this.mouse.map.tileSize,
        x = this.mouse.threeD.x - this.mouse.threeD.x % tileSize,
        y = this.mouse.threeD.y - this.mouse.threeD.y % tileSize,
        item = this.currentItem,
        key = item.key,
        tile = this.mouse.tile,
        message = `Sorry, you can't place the ${ key } there. Choose a place that you've already seen!`;

    if (tile.discovered && isInBounds(this.mouse)) {

        item.sprite = this.game.add.isoSprite(x, y, 0, key, null, this.itemGroup);
        item.threeDInitialize();

        item.action();
        item.inventorySprite.destroy();
        item.text.destroy();

        this.itemList.remove(this.currentItem.location);
        this.mouse.reset();
        this.mouse.switch = false;

        this._refit();
    } else {
        this.messages.add(message);
    }
};