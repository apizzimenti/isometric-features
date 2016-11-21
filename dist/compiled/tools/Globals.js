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
 * @property colorTween {function}
 */

var Globals = {
    anchor: [0.5, 0],
    mapTileKey: [],
    tween: [1000, Phaser.Easing.Linear.None, true, 0, 0, false],

    paramNotExist: function (param, type) {
        return typeof param !== type || param == undefined;
    },

    colorTween: function (game, object, start, end, t) {

        console.dir(object);

        var blend = { step: 0 },
            tween = game.add.tween(blend).to({ step: 100 }, t);

        tween.onUpdateCallback(() => {
            object.tint = Phaser.Color.interpolateColor(start, end, 100, Math.floor(blend.step), 1);
        });

        object.tint = start;
        tween.start();
    }
};