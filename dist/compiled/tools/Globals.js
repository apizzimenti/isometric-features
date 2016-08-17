"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {})();
/**
 * Created by apizzimenti on 5/19/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc A set of variables that have to be used in disparate locations.
 * 
 * @type {{anchor: number[], mapTileKey: string[], tween: object[], paramNotExist: function}}
 *
 * @property anchor {number[]} Globalized anchor for all sprites.
 * @property mapTileKey {string[]} Will contain keys for tile sprites.
 * @property tween {array} Default tween settings.
 * @property paramNotExist {function} Global testing method for parameters.
 */

var Globals = {
  anchor: [0.5, 0],
  mapTileKey: [],
  tween: [1000, Phaser.Easing.Linear.None, true, 0, 0, false],
  paramNotExist: function paramNotExist(param, type) {
    return (typeof param === "undefined" ? "undefined" : _typeof(param)) !== type || param == undefined;
  }
};
