/**
 * Created by apizzimenti on 5/12/16.
 */

"use strict";

var isogame = function (scope, injector) {
    
    /*
    Getting the window's width; originially, I preserved the dimensions with some golden ratio magic, but the rest of
    the game has a 1024x768 window. Conformity!
     */

    var orig_width = window.innerWidth,
        orig_height = window.innerHeight,
        width = 1024,
        height = 768,
        game = new Phaser.Game(1024, 768, Phaser.CANVAS, "gameCanvas", null, true, false),
        
    // Empty variables for the two groups: the tile group and the character group.
        groundTiles,
        characters,
        
    // I have a player variable and a container for all the Animals.
        player,
        creatures = [],
        sprites,
        
    // relpath is the path to all the assets (images, tilemaps, etc.) that gets passed to the loader.
        
        relpath = "./assets/",
        load = new Loader(relpath, game, scope),

    // the default tile size, and containers for the Inventory, Map, Mouse, and Debug classes, as well as keydowns and
    // preserving the lexical "this"

        tileSize = 32,
        inventory,
        map,
        mouse,
        debug,
        escape,
        that = this;
    
    var boot = {
        preload: function () {
            game.time.advancedTiming = true;
            game.debug.renderShadow = false;
            game.stage.disableVisibilityChange = true;

            /*
            set the world bounds; these aren't the bounds of the physics system, but are larger than the game window
            so the camera follows the Player
            */
            game.world.setBounds(0, 0, 2400, 2400);

            // add the isometric plugin
            game.plugins.add(new Phaser.Plugin.Isometric(game));

            // load assets (images, tilemap, textures, etc)

            /**
             * @see Loader
             */
            load.assets();

            // start the physics system and set the anchor for the game
            game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
            game.iso.anchor.setTo(...globals.anchor);
        },

        create: function () {
            
            var keys,
                space,
                guide;
            
            debug = new Debug(game, width);

            // new group for tiles
            groundTiles = game.add.group();
            groundTiles.enableBody = true;
            groundTiles.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

            // new group for moving sprites
            characters = game.add.group();
            characters.enableBody = true;
            characters.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

            // create a new map!
            map = new Map(game, groundTiles, "tileset", tileSize, 25);

            // load the sprites (Animals, Player(s)) and assign them to their containers
            sprites = load.sprites(map, characters);
            player = sprites.player;
            creatures = sprites.creatures;

            // set up the Mouse
            mouse = new Mouse(game, map, groundTiles);

            // set up key tracking
            keys = keymap(game, this);
            escape = keys.esc;
            space = keys.space;

            // create the Inventory system and load items into it
            inventory = new Inventory(game, map, width, height, mouse, escape, characters);
            load.inventory(inventory, space);
            
            // create a guide
            guide = new Guide("guide", "gameCanvas");

            /*
            this allows the game to be accessed from outside this file; when a new game is created in the angular
            portion of this app, each of its properties can be accessed. New sprites, items, messages, and lots more
            can be added or modified
            */
            
            that.assign = function () {
                that.debug = debug;
                that.map = map;
                that.mouse = mouse;
                that.player = player;
                that.inventory = inventory;
                that.messages = inventory.messages;
            };

            // assigns objects to game properties and fires the "load" event out to Angular so it knows we're ready
            that.assign();
            load.onLoad();
            scope.$emit("load");

        },

        update: function () {

            // collision physics
            game.physics.isoArcade.collide(characters);
            game.iso.simpleSort(characters);

            // keep track of the Player's direction, keymapping, and restrict the vision radius
            direction(player);
            keymapTrack(player, this);
            player.visionRadius();

            // keep track of each Animal's direction
            creatures.forEach((creature) => {
                direction(creature);
                creature.isVisible(player);
            });

            // mouse tracking; if the mouse switch is ON, make sure the tiles are glowing
            mouse.update();

            if (mouse.switch) {
                mouse.selected();
            }
            
            /*
            if the Scanner has been selected from the Inventory, make sure it's turned on and its direction is changed
            when the scroll wheel is rotated. After it's fully set, load the Animal array into the Scanner so it knows
            when to take pictures
             */
            if (load.items.scanner.setting) {
                direction(load.items.scanner);
                load.items.scanner.setRadius();
            } else if (load.items.scanner.scanning) {
                load.items.scanner.pictures(creatures);
                load.items.scanner.tiles();
            }

        },

        render: function () {

            // debug usually goes here
            
            // debug.sprite(creatures);
        }
    };

    // start your engines!
    game.state.add("boot", boot);
    game.state.start("boot");
};
