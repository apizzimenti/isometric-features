(function (){ "use strict"; })()

var Message = require("./Message"),
    ContextMenu = require("./ContextMenu"),
    Bounds = require("../../physics/Bounds");

/**
 * @author Anthony Pizzimenti
 *
 * @desc Creates the game Inventory.
 *
 * @param {object} game Current game instance.
 * @param {Mouse} mouse Mouse object.
 * @param {object} escape Phaser key object.
 * @param {object} itemGroup Phaser Isometric sprite group.
 * @param {Map} map Game's Map object.
 * @param {string} [messagePos="bottom_left"] Location for messages to appear.
 *
 * @property {object} game Current game instance.
 * @property {Map} map Game's Map object.
 * @property {number} width Game window width.
 * @property {number} height Game window height.
 * @property {Mouse} mouse Mouse object.
 * @property {object} escape Phaser escape key.
 * @property {Message} messages Message object.
 * @property times {number} Number of times tooltips have been viewed.
 * @property {object} graphics Phaser graphics object.
 *
 * @property {object} menuGroup Menu sprite group.
 * @property {object} itemGroup Isometric sprite group.
 *
 * @property itemList {sList} Linked list of the items in the inventory.
 * @property {object} itemCache Caches all items so they can be quickly referenced when reset.
 *
 * @property {object} area Total space allocated to Inventory module.
 * @property area.width {number} Width of Inventory module space.
 * @property area.height {number} Height of Inventory module space.
 *
 * @property {object} element Total space allocated to each Inventory item.
 * @property element.width {number} Width of each Inventory item.
 * @property element.height {number} Height of each Inventory item.
 *
 * @property sprites {object[]} Inventory item objects.
 *
 * @constructor
 *
 * @see Message
 * @see Map
 *
 * @todo implement tooltip stuff.
 */
function Inventory (game, map, mouse, escape, itemGroup, messagePos) {

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

    // create new message dispatcher and context menu
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
        items.forEach((item) => {
            this.addItem(item);
        })
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

    this.menuGroup.forEach((item) => {
        item.input.useHandCursor = true;
        item.tint = 0xFFFFFF;

        // retrieve items from object cache
        this.itemCache[item.key].text.tint = 0xFFFFFF;

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
 * @private
 *
 * @this Inventory
 */

Inventory.prototype._placeItem = function () {

        // get size of the tiles in the map
    var tileSize = this.mouse.map.tileSize,

        // calculate the position of the mouse relative to the map
        x = this.mouse.threeD.x - (this.mouse.threeD.x % tileSize),
        y = this.mouse.threeD.y - (this.mouse.threeD.y % tileSize),

        item = this.currentItem,
        key = item.key,
        tile = this.mouse.tile,
        message = `Sorry, you can't place the ${key} there. Choose a place that you've already seen!`;

    // if the selected tile is discovered and the mouse is in bounds
    if (tile.discovered && Bounds.isInBounds(this.mouse)) {

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
        this.messages.add(message)
    }
};

module.exports = {
    Inventory: Inventory
};
