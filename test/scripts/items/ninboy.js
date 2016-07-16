(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/23/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc Ninboy Item class.
 * 
 * @param game {object} Current game instance.
 * @param key {string} Cached Phaser texture key.
 * @param inventory {Inventory} Game's Inventory instance.
 *
 * @class {object} Ninboy
 * @extends Item
 * @constructor
 */

function Ninboy (game, key, inventory) {
    Item.call(this, game, key, inventory);
}

Ninboy.prototype = Object.create(Item.prototype);
