(function () {"use strict";})();
/**
 * Created by apizzimenti on 5/19/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc A set of variables that have to be used in disparate locations. All methods are static.
 *
 * @property {number[]} anchor      Globalized anchor for all sprites.
 * @property {string[]} mapTileKey  Will contain keys for tile sprites.
 * @property {array} tween          Default tween settings.
 *
 * @class Globals
 */
var Globals = {
    anchor: [0.5, 0],
    mapTileKey: [],
    tween: [1000, Phaser.Easing.Linear.None, true, 0, 0, false],
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Does this parameter exist?
 *
 * @param {*} param             Function parameter to be tested.
 * @param {string} [type=null]  Does this parameter match its intended type?
 *
 * @returns {boolean} Does the parameter exist and is it of the intended type?
 */
Globals.paramNotExist = function (param, type) {
    return typeof param !== type && type !== null;
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Tweens the provided object's color from the start to end color.
 *
 * @param {object} game     Current Phaser game instance.
 * @param {sprite} object   Object to have color tweened.
 * @param {string} start    Literal hex color representation.
 * @param {string} end      Literal hex color representation.
 * @param {number} t        Time to complete tween.
 *
 * @returns {undefined}
 */
Globals.colorTween = function (game, object, start, end, t) {

    var blend = {step: 0},
        tween = game.add.tween(blend).to({step: 100}, t);

    tween.onUpdateCallback(() => {
        object.tint = Phaser.Color.interpolateColor(start, end, 100, Math.floor(blend.step), 1);
    });

    object.tint = start;
    tween.start();
};
