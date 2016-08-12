/**
 * Created by apizzimenti on 6/8/16.
 */

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Abstract parent class for Inventory items.
 *
 * @param game {object} Current Phaser game instance.
 * @param key {string} Cached Phaser texture or image.
 * @param inventory {Inventory} Game's Inventory.
 *
 * @property game {object} Phaser game instance.
 * @property key {string} The key that belongs to this Item.
 * @property keys {string[]} Dummy property that can be overwritten.
 * @property map {Map} Game's Map object.
 * @property inventory {Inventory} This game's inventory.
 * @property text {object} When the item is loaded into the inventory, this prop is populated with a Phaser.Text object.
 * @property inventorySprite {sprite} On initialization, this will contain a regular Phaser sprite.
 * @property sprite {sprite} On selected, this will contain an isometric Sprite.
 * @property sprite.tile {object} Contains location and directional information for the sprite.
 * @property direction {number} This sprite's default direction.
 *
 * @class {object} Item
 * @this Item
 */

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Item(game, key, inventory) {

  this.keys = [key, key, key, key];

  this.game = game;
  this.key = key;

  this.inventory = inventory;
  this.text = {};

  this.inventorySprite = {};
  this.sprite = {};
  this.sprite.tile = {};
  this.sprite.direction = 0;
  this.map = this.inventory.map;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Default action method. Can and should be overwritten on a per-item basis.
 *
 * @this Item
 */

Item.prototype.action = function () {
  console.log("NoActionMethod: " + this.key + " is using the builtin action method");
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Initializes objects for the isometric physics system. Sprites are immovable.
 *
 * @this Item
 */

Item.prototype.threeDInitialize = function () {
  var _sprite$anchor;

  (_sprite$anchor = this.sprite.anchor).set.apply(_sprite$anchor, _toConsumableArray(globals.anchor));
  this.sprite.body.collideWorldBounds = true;
  this.game.physics.isoArcade.enable(this.sprite);
  this.sprite.enableBody = true;

  this.sprite.tile = {};
  this.sprite.direction = 0;

  this.sprite.body.immovable = true;

  this.setting = true;
  direction(this);
};