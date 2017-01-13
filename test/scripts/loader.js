(function () {"use strict";})();
/**
 * Created by apizzimenti on 6/23/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc A class with methods for loading textures and sprites for simplifying the root file.
 *
 * @param relpath {string} Relative filepath to all image assets.
 * @param game {object} Current Phaser game instance.
 * @param scope {object} Angular scope.
 *
 * @property relpath {string} Relative filepath to all image assets.
 * @property game {object} Current Phaser game instance.
 * @property scope {object} Angular scope.
 * @property textures {object} Contains references to loaded Phaser assets.
 *
 * @class {object} Loader
 * @constructor
 */

function Loader (relpath, game, scope) {
    
    this.relpath = relpath;
    this.game = game;
    this.scope = scope;
    this.textures = {};

    /**
     * @author Anthony Pizzimenti
     *
     * @desc Loads necessary textures.
     *
     * @method
     * @this Loader
     */

    this.assets = function () {

        var astronaut = [],
            blogg = [],
            galoot = [],
            kangaram = [],
            camera = [],
            game = this.game,
            relpath = this.relpath;

        // load the tileset textures
        game.load.atlasJSONHash("tileset", relpath + "tileset.png", relpath + "tileset.json");


        // load the textures for the Astronaut, Blogg, Galoot, Kangaram, and Camera and put them into arrays that correspond
        // to the game directions; SE -> NE -> NW -> SW
        game.load.image("astronaut_NE", relpath + "Astronaut/astronaut_NE.png");
        game.load.image("astronaut_NW", relpath + "Astronaut/astronaut_NW.png");
        game.load.image("astronaut_SE", relpath + "Astronaut/astronaut_SE.png");
        game.load.image("astronaut_SW", relpath + "Astronaut/astronaut_SW.png");

        astronaut.push("astronaut_SE", "astronaut_NE", "astronaut_NW", "astronaut_SW");

        game.load.image("blogg_NE", relpath + "Blogg/blogg_NE.png");
        game.load.image("blogg_NW", relpath + "Blogg/blogg_NW.png");
        game.load.image("blogg_SE", relpath + "Blogg/blogg_SE.png");
        game.load.image("blogg_SW", relpath + "Blogg/blogg_SW.png");

        blogg.push("blogg_SE", "blogg_NE", "blogg_NW", "blogg_SW");

        game.load.image("galoot_NE", relpath + "Galoot/Galoot_NE.png");
        game.load.image("galoot_NW", relpath + "Galoot/Galoot_NW.png");
        game.load.image("galoot_SE", relpath + "Galoot/Galoot_SE.png");
        game.load.image("galoot_SW", relpath + "Galoot/Galoot_SW.png");

        galoot.push("galoot_SE", "galoot_NE", "galoot_NW", "galoot_SW");

        game.load.image("kangaram_NE", relpath + "kangaram/kangaram_NE.png");
        game.load.image("kangaram_NW", relpath + "kangaram/kangaram_NW.png");
        game.load.image("kangaram_SE", relpath + "kangaram/kangaram_SE.png");
        game.load.image("kangaram_SW", relpath + "kangaram/kangaram_SW.png");

        kangaram.push("kangaram_SE", "kangaram_NE", "kangaram_NW", "kangaram_SW");

        game.load.image("camera_NE", relpath + "misc/camera_NE.png");
        game.load.image("camera_NW", relpath + "misc/camera_NW.png");
        game.load.image("camera_SE", relpath + "misc/camera_SE.png");
        game.load.image("camera_SW", relpath + "misc/camera_SW.png");

        camera.push("camera_SE", "camera_NE", "camera_NW", "camera_SW");

        // load textures for Items
        game.load.image("candy", relpath + "misc/candybar.png");
        game.load.image("gold_bunny", relpath + "misc/goldDustbunny.png");
        game.load.image("lemondrops", relpath + "misc/lemondrops.png");
        game.load.image("ninboy", relpath + "misc/ninboy_advantage.png");
        game.load.image("lint", relpath + "misc/pocketlint.png");
        game.load.image("purple_bunny", relpath + "misc/purpleDustbunny.png");

        this.textures.astronaut = astronaut;
        this.textures.blogg = blogg;
        this.textures.galoot = galoot;
        this.textures.kangaram = kangaram;
        this.textures.camera = camera;
        this.textures.candy = "candy";
        this.textures.gold_bunny = "gold_bunny";
        this.textures.lemondrops = "lemondrops";
        this.textures.ninboy = "ninboy";
        this.textures.lint = "lint";
        this.textures.purple_bunny = "purple_bunny";

    };

    /**
     * @author Anthony Pizzimenti
     *
     * @desc Simplifies the loading of sprites.
     *
     * @param map {Map} Current game's Map object.
     * @param group {object} Phaser sprite group containing tiles.
     *
     * @method
     * @this Loader
     */
    
    this.sprites = function (map, group) {
        
        var player,
            creatures = [],
            game = this.game,
            randR,
            randC,
            init = {
                isoZ: 1000
            },
            tween = {
                properties: {
                    isoZ: 24
                },
                duration: 3000,
                easing: Phaser.Easing.Quintic.Out
            };

        // load Player sprite;
        // since the Player sprite needs an intro animation, I pass false into the auto parameter
        // and call Player.addIntro(), then Player.create().

        player = new Player(game, 7, 7, this.textures.astronaut, group, map, null, false);
        player.addIntro(init, tween);
        player.create();

        // load Animal sprites

        for (var i = 0; i < 6; i++) {

            randR = Math.floor(Math.random() * map.tileMap.length);
            randC = Math.floor(Math.random() * map.tileMap[0].length);

            if (i < 2) {
                creatures.push(
                    new Animal(game, this.scope, randR, randC, this.textures.blogg, group, map, "blogg")
                );

            } else if (i >= 2 && i < 4) {
                creatures.push(
                    new Animal(game, this.scope, randR, randC, this.textures.galoot, group, map, "galoot")
                );

            } else {
                creatures.push(
                    new Animal(game, this.scope, randR, randC, this.textures.kangaram, group, map, "kangaram")
                );

            }
        }
        
        creatures.forEach(function (creature) {
            creature.timedMovement();
        });

        return {
            player: player,
            creatures: creatures
        };
    };

    /**
     * @author Anthony Pizzimenti
     *
     * @desc Loads items into the Inventory.
     *
     * @param inventory {Inventory} Game's Inventory.
     * @param [space] {object} Phaser space bar.
     *
     * @method
     * @this Loader
     */
    
    this.inventory = function (inventory, space) {

        var game = this.game;

        this.items = {
            candy: new Candy(game, this.textures.candy, inventory, this.scope, "C.A.L.E"),
            gold_dust: new Dust(game, this.textures.gold_bunny, inventory, "gold"),
            purple_dust: new Dust(game, this.textures.purple_bunny, inventory, "purple"),
            lemon: new Lemon(game, this.textures.lemondrops, inventory),
            ninboy: new Ninboy(game, this.textures.ninboy, inventory),
            lint: new Lint(game, this.textures.lint, inventory),
            scanner: new Scanner(game, this.textures.camera[0], inventory, this.textures.camera, space)
        };
        
        inventory.addItems([
            this.items.candy,
            this.items.gold_dust,
            this.items.purple_dust,
            this.items.lemon,
            this.items.ninboy,
            this.items.lint,
            this.items.scanner
        ]);
    };
}
