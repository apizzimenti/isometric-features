(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/23/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc Lemon Item class.
 * 
 * @param game {object} Current game instance.
 * @param key {string} Cached Phaser texture key.
 * @param inventory {Inventory} Game's Inventory instance.
 *
 * @class {object} Lemon
 * @extends Item
 * @constructor
 */

function Lemon (game, key, inventory) {
    Item.call(this, game, key, inventory);
}

Lemon.prototype = Object.create(Item.prototype);
