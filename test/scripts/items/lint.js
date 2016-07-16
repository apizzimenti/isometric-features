(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/23/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc Lint Item class.
 *
 * @param game {object} Current game instance.
 * @param key {string} Cached Phaser texture key.
 * @param inventory {Inventory} Game's Inventory instance.
 *
 * @class {object} Lint
 * @extends Item
 * @constructor
 */

function Lint (game, key, inventory) {
    Item.call(this, game, key, inventory);
}

Lint.prototype = Object.create(Item.prototype);
