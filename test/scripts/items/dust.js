(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/23/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc Dust Item class.
 *
 * @param game {object} Current game instance.
 * @param key {string} Cached Phaser texture key.
 * @param inventory {Inventory} Game's Inventory instance.
 * @param color {String} This dust's color.
 *
 *
 * @class {object} Dust
 * @extends Item
 * @constructor
 */

function Dust (game, key, inventory, color) {
    Item.call(this, game, key, inventory);

    this.color = color;
}

Dust.prototype = Object.create(Item.prototype);
