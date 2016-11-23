(function () {"use strict";})();
/**
 * Created by apizzimenti on 5/19/16.
 * This is automatically included in the isometric-features package to provide its users some ease-of-use.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Setup object.
 *
 * @param game {object} Current Phaser game instance.
 * @param scope {object} Angular scope.
 *
 * @property game {object} Phaser game instance.
 * @property scope {object} Angular scope.
 *
 * @class Setup
 * @constructor
 * @this Setup
 */

function System (game, scope) {
    this.game = game;
    this.scope = scope;
}


/**
 * @author Anthony Pizzimenti
 *
 * @desc Binds the left, right, up, and down keys to the running game instance.
 *
 * @param game {object} Phaser game instance.
 * @param context {object} the context game is bound to.
 *
 * @returns {{esc: object, space: object}}
 *
 * @this System
 */

System.prototype.keymap = function (game, context) {
    
    context.cursors = game.input.keyboard.createCursorKeys();

    context.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    return {
        esc: game.input.keyboard.addKey(Phaser.Keyboard.ESC),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Changes the direction of the given sprite based on keypresses.
 *
 * @param Player {Player} Phaser Player sprite.
 * @param context {object} the context game is bound to.
 *
 * @this System
 */

System.prototype.keymapTrack = function (Player, context) {

    /**
     * Default speed in px/s for specified sprite.
     * @type {number}
     */

    var speed = 50,
        sprite = Player.sprite;
    
    sprite.body.velocity.z = 0;
    // sprite.isoZ = -3 + (3 * Math.sin(sprite.isoX + sprite.isoY));

    if (context.cursors.up.isDown) {
        sprite.body.velocity.y = -speed;
        sprite.direction = 1;
    } else if (context.cursors.down.isDown) {
        sprite.body.velocity.y = speed;
        sprite.direction = 3;
    } else {
        sprite.body.velocity.y = 0;
    }

    if (context.cursors.left.isDown) {
        sprite.body.velocity.x = -speed;
        sprite.direction = 2;
    } else if (context.cursors.right.isDown) {
        sprite.body.velocity.x = speed;
        sprite.direction = 0;
    } else {
        sprite.body.velocity.x = 0;
    }
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Called in the default state's preload() function property.
 *
 * @property tiles {Phaser.Group} Phaser group dedicated to tiles.
 * @property characters {Phaser.Group} Phaser group dedicated to moving sprites.
 *
 * @this System
 */

System.prototype.preload = function () {

    // add isometric plugin
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

    // new group for tiles
    this.tiles = this.game.add.group();
    this.tiles.enableBody = true;
    this.tiles.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

    // new group for moving sprites
    this.characters = this.game.add.group();
    this.characters.enableBody = true;
    this.characters.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

    // start the physics system and set the anchor for the game
    this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    this.game.iso.anchor.setTo(...Globals.anchor);

    // set the world bounds; these aren't the bounds of the physics system, but are larger than the game window
    // so the camera follows the Player
    this.game.world.setBounds(0, 0, 2400, 2400);

    // set up game properties
    this.game.time.advancedTiming = true;
    this.game.debug.renderShadow = false;
    this.game.stage.disableVisibilityChange = true;

    // shoot some messages into the console when the onLoad event is fired.
    this.scope.$on("load", (e) => {

        var host = window.location.origin + "/",
            docs = "https://apizzimenti.github.io/isometric-features-docs/";

        console.log("%c isometric-features documentation " + `%c ${docs}`,
            "background: #0095dd; color: #FFF",
            "color: #5D5D5D");
    });
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Called in the default state's update() function.
 *
 * @param context {object} Context to which the space, escape, and arrow keys are attached.
 * @param characters {Phaser.Group} Group dedicated to moving sprites.
 * @param [player=null] {Player} Main character.
 * @param [creatures=null] {Animal[]} Array of animal sprites.
 * @param [mouse=null] {Mouse} Game's Mouse object.
 * @param [props=null] {object} Properties for mouse animation.
 *
 * @see Mouse#selected
 *
 * @this System
 */

System.prototype.update = function (context, characters, player, creatures, mouse, props) {

    // collision physics
    // this.game.physics.isoArcade.collide(characters);
    this.game.iso.simpleSort(characters);

    // keep track of the Player's direction, keymapping, and restrict the vision radius
    if (Globals.paramNotExist(player)) {
        direction(player);
        this.keymapTrack(player, context);
        player.visionRadius();
    }

    // keep track of each Animal's direction
    if (Globals.paramNotExist(creatures)) {
        creatures.forEach((creature) => {
            direction(creature);
            creature.isVisible(player);
        });
    }

    // mouse tracking; if the mouse switch is ON, make sure the tiles are glowing
    if (Globals.paramNotExist(mouse)) {
        mouse.update();

        if (mouse.switch) {
            Globals.paramNotExist(props) ? mouse.selected(props) : mouse.selected();
        }
    }
};
