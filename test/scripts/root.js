/**
 * Created by apizzimenti on 5/12/16.
 */

/**
 * This gamefile essentially uses the same organization as the phaser-isometric-plugin does
 */

"use strict";

var isogame = function (scope, injector) {

    // Getting the window's width; originially, I preserved the dimensions with some golden ratio magic, but the rest of
    // the game has a 1024x768 window. Conformity!

    var orig_width = window.innerWidth / (1.68 * 0.5),
        orig_height = window.innerHeight / (1.68 * 0.5),
        width = 1024,
        height = 768,
        game = new Phaser.Game(width, height, Phaser.CANVAS, "gameCanvas", null, true, false),
        
    // I have a player variable and a container for all the Animals.
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
        that = this,

        // initialize the
        system = new System(game, scope);
    
    var boot = {

        preload: function () {

            // preload; this is provided by the isometric-features plugin
            system.preload();

            // load assets (images, tilemap, textures, etc); the Loader class is built for this specific game instance
            load.assets();
        },

        create: function () {
            
            var keys,
                space,
                guide;
            
            debug = new Debug(game);

            // create a new map with fog of war on, a randomly generated tilemap.
            map = new Map(game, system.tiles, "tileset", tileSize, 15, null, true);

            // load the sprites (Animals, Player(s))
            sprites = load.sprites(map, system.characters);

            // set up the Mouse
            mouse = new Mouse(game, map, system.tiles);

            // set up key tracking for inventory
            keys = system.keymap(game, this);
            escape = keys.esc;
            space = keys.space;

            // create the Inventory system and load items into it
            inventory = new Inventory(game, map, mouse, escape, system.characters, "top_right");
            load.inventory(inventory, space);
            
            // create a guide
            guide = new Guide("guide", "gameCanvas",
                {
                    text: "info",
                    hover: {
                        "color": "#D33111",
                        "font-weight": "bold"
                    }
                }
            );

            // this allows the game to be accessed from outside the game instance; when a new game is created in the angular
            // portion of this app, each of its properties can be accessed. New sprites, items, messages, and lots more
            // can be added or modified
            
            that.assign = function () {
                that.debug = debug;
                that.map = map;
                that.mouse = mouse;
                that.player = sprites.player;
                that.inventory = inventory;
                that.messages = inventory.messages;
            };

            // assigns objects to game properties and fires the "load" event out to Angular so it knows we're ready
            that.assign();
            scope.$emit("load");
        },

        update: function () {

            // load system defaults;
            system.update(this, system.characters, sprites.player, sprites.creatures, mouse);

            // if the Scanner has been selected from the Inventory, make sure it's turned on and its direction is changed
            // when the scroll wheel is rotated. After it's fully set, load the Animal array into the Scanner so it knows
            // when to take pictures
            if (load.items.scanner.setting) {
                direction(load.items.scanner);
                load.items.scanner.setRadius();
            } else if (load.items.scanner.scanning) {
                load.items.scanner.pictures(sprites.creatures);
                load.items.scanner.tiles();
            }
        },

        render: function () {

            // debug usually goes here; ENTIRELY OPTIONAL
            debug.sprite(sprites.creatures);
            debug.sprite(sprites.player);
            debug.fps();
            debug.mousePos(mouse);

        }
    };

    // start your engines!
    game.state.add("boot", boot);
    game.state.start("boot");
};
