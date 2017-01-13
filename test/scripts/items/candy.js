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
 * @param scope {object} Angular scope.
 * 
 * @class {object} Candy
 * @extends Item
 * @constructor
 */

function Candy (game, key, inventory, scope, name) {

    if (name) {
        Item.call(this, game, key, inventory, name);
    } else {
        Item.call(this, game, key, inventory);
    }

    this.scope = scope;
}

Candy.prototype = Object.create(Item.prototype);

Candy.prototype.action = function () {
    
    this.inventory.messages.add("Hey! I think this is going to go really well. I don't really doubt it, but I just" +
        " hope that it goes as well as we can get it.");

    this.scope.$emit("pathfind", {
        row: this.sprite.row,
        col: this.sprite.col
    });
};
