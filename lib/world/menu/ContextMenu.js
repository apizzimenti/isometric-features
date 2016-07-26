(function () {"use strict";})();
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

function ContextMenu (Inventory) {
    
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
    })
};
