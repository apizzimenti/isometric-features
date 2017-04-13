(function () {"use strict";})();
/**
 * Created by apizzimenti on 7/15/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Game's mouse object.
 *
 * @param {object} game     Current Phaser game instance.
 * @param {Map} map         Game's Map object.
 * @param {object} group    Sprite group.
 *
 * @property {object} game          Game instance the mouse belongs to.
 * @property {Map} map              Game's Map object.
 * @property {object} group         Sprite group.
 * @property {object} pos           Initial Isometric Point3 object.
 * @property {object} twoD          Phaser 2d pointer position.
 * @property {object} threeD        Derived 3d pointer position.
 * @property {boolean} switch       Is selected mode on or off?
 * @property {object} tile          Tiling system for the mouse pointer.
 * @property {sprite} tile.center   Tile currently under the mouse pointer (when selected mode is on).
 * @property {object} mouse         Phaser input object.
 *
 * @constructor
 */
function Mouse (game, map, group) {

    this.game = game;
    this.map = map;
    this.group = group;

    // create a new Point3 to project 2d position onto isometric map
    this.pos = new Phaser.Plugin.Isometric.Point3();
    
    var x = this.game.input.mousePointer.x,
        y = this.game.input.mousePointer.y;

    // note 2d and 3d points
    this.twoD = new Phaser.Point(x, y);
    this.threeD = this.game.iso.unproject(this.twoD, this.pos);
    
    this.switch = false;
    
    this.tile = {};
    
    this.mouse = this.game.input;
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Updates mouse position.
 *
 * @property {object} twoD.x    Current 2d mouse horizontal position.
 * @property {object} twoD.y    Current 2d mouse vertical position.
 * @property {boolean} inBounds Is the mouse in the current world bounds?
 *
 * @returns {undefined}
 */
Mouse.prototype.update = function () {
    
    this.twoD.x = this.game.input.mousePointer.x;
    this.twoD.y = this.game.input.mousePointer.y;
    this.threeD = this.game.iso.unproject(this.twoD, this.pos);
    
    var backX = this.game.physics.isoArcade.bounds.backX,
        backY = this.game.physics.isoArcade.bounds.backY,
        frontX = this.game.physics.isoArcade.bounds.frontX,
        frontY = this.game.physics.isoArcade.bounds.frontY;

    // assigns inBounds property to check if mouse is within physics world bounds.
    this.inBounds = this.threeD.x > backX && this.threeD.x < frontX && this.threeD.y > backY && this.threeD.y < frontY;
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc If the mouse is in selected mode (i.e. <code>switch</code> is true), this determines the tile to animate.
 *
 * @param {object} [animation=null] Container for custom mouse on-select animation.
 *
 * @example
 * // values shown in this example animation object are the default values for the system
 *
 * var animation = {
 *         tint: 0x98FB98,                                          // hexadecimal color
 *         alpha: 1.3 + Math.sin(this.game.time.now * 0.007),       // value applied to tile transparency
 *         tween: [{isoZ: 5}, 20, Phaser.Easing.Linear.None, true]  // tween arguments to modify tile physics properties
 *     }
 *
 * @this Mouse
 *
 * @returns {undefined}
 */
Mouse.prototype.selected = function (animation) {

    var notExist = Globals.paramNotExist(animation, "Object");

    if (this.inBounds) {
        
        this.group.forEach((tile) => {

            if (tile.type === "tile") {

                var inside = tile.isoBounds.containsXY(this.threeD.x + this.map.tileSize, this.threeD.y + this.map.tileSize);

                if (inside) {

                    this.tile = tile;

                    this.row = tile.row;
                    this.col = tile.col;

                    tile.tint = notExist ? 0x98FB98 : animation.tint || 0x98FB98;
                    tile.alpha = notExist ? 1.3 + Math.sin(this.game.time.now * 0.007) : animation.alpha || 1.3 + Math.sin(this.game.time.now * 0.007);

                } else if (!inside) {
                    tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
                    tile.alpha = 1;
                }
            }
        });

    } else {
        this.reset();
    }

};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Resets all tile sprites in the group.
 *
 * @this Mouse
 *
 * @returns {undefined}
 */
Mouse.prototype.reset = function () {
    
    this.group.forEach((tile) => {
        
        if (tile.type === "tile") {
            tile.discovered ? tile.tint = 0xFFFFFF : tile.tint = 0x571F57;
            tile.alpha = 1;
            tile.isoZ = 0;
            this.game.canvas.style.cursor = "default";
        }
    });
};
