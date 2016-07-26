(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/23/16.
 */


/**
 * @author Anthony Pizzimenti
 * 
 * @desc Candy Item class.
 *
 * 
 * @param game {object} Current game instance.
 * @param key {string} Cached Phaser texture key.
 * @param inventory {Inventory} Game's Inventory instance.
 * 
 * @class {object} Candy
 * @extends Item
 * @constructor
 */

function Candy (game, key, inventory, scope) {
    Item.call(this, game, key, inventory);
    this.scope = scope;
}

Candy.prototype = Object.create(Item.prototype);

Candy.prototype.action = function () {

    this.scope.$emit("pathfind", {
        row: this.sprite.row,
        col: this.sprite.col
    });
};