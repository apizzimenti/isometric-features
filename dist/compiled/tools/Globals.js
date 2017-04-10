(function () {
    "use strict";
})();
/**
 * Created by apizzimenti on 5/19/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc A set of variables that have to be used in disparate locations. All methods are static.
 *
 * @property anchor {number[]} Globalized anchor for all sprites.
 * @property mapTileKey {string[]} Will contain keys for tile sprites.
 * @property tween {array} Default tween settings.
 *
 * @class Globals
 */

var Globals = {
    anchor: [0.5, 0],
    mapTileKey: [],
    tween: [1000, Phaser.Easing.Linear.None, true, 0, 0, false]
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Does this parameter exist?
 *
 * @param param {*} Function parameter to be tested.
 * @param [type=null] Does this parameter match its intended type?
 *
 * @returns {boolean}
 */

Globals.paramNotExist = function (param, type) {
    return typeof param !== type ? type : null || param == undefined;
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Tweens the provided object's color from the start to end color.
 *
 * @param game {object} Current Phaser game instance.
 * @param object {Animal | Item | Player | Tile} Object to have color tweened.
 * @param start {string} Literal hex color representation.
 * @param end {string} Literal hex color representation.
 * @param t {number} Time to complete tween.
 */

Globals.colorTween = function (game, object, start, end, t) {

    var blend = { step: 0 },
        tween = game.add.tween(blend).to({ step: 100 }, t);

    tween.onUpdateCallback(() => {
        object.tint = Phaser.Color.interpolateColor(start, end, 100, Math.floor(blend.step), 1);
    });

    object.tint = start;
    tween.start();
};