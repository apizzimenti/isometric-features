/**
 * Created by apizzimenti on 5/19/16.
 */

"use strict";

/**
 * @author Anthony Pizzimenti
 *
 * @desc Game map object.
 *
 * @param game {object} Current game instance.
 * @param group {object} Phaser group.
 * @param tileSet Tileset and corresponding JSON or tile key.
 * @param tileSize {number} Size of an individual tile.
 * @param mapSize {number} Desired map size.
 * @param [preferredTiles=object[]] {object[]} Array of tiles; by default, the Map class creates this for you.
 * @param [fog=true] {boolean} Is the fog of war on or off?
 *
 * @property game {object} Current game instance.
 * @property tileSet Tileset and corresponding JSON.
 * @property tileSize {number} Size of an individual tile.
 * @property mapSize {number} Set map size.
 * @property tileMap {sprite[]} Array of tile sprites.
 * @property group {object} Phaser game group.
 * @property blocked {number[]} Array of numbers indicating which tiles are blocked (1) and which aren't (0).
 * @property fog {boolean} Is the fog of war on or off?
 *
 * @class {object} Map
 * @this Map
 * @constructor
 */

function Map (game, group, tileSet, tileSize, mapSize, preferredTiles, fog) {

    var tile,
        tileArray = [],
        blockedArray = [],
        tiles = preferredTiles || this._createTileMap(mapSize),
        worldBounds = dim(tileSize, mapSize, 1),
        atlas_json_exists = game.cache.checkImageKey(tileSet),
        frame = null;

    this.game = game;
    this.tileSet = tileSet;
    this.tileSize = tileSize;
    this.mapSize = mapSize;
    this.group = group;
    this.fog = fog;
    
    if (atlas_json_exists) {
        this._generateMapKeys();
        frame = Globals.mapTileKey[3];
    } else {
        frame = null;
    }

    for (var row = 0; row < tiles.length; row++) {

        tileArray[row] = [];
        blockedArray[row] = [];

        for (var col = 0; col < tiles[0].length; col++) {

            tile = this.game.add.isoSprite(row * this.tileSize, col * this.tileSize, 0, this.tileSet, frame, this.group);

            if (col > tiles.length - 2 || row < 1 || row > tiles.length - 2 || col < 1) {
                tile.blocked = true;
                blockedArray[row].push(0);
            } else {
                tile.blocked = false;
                blockedArray[row].push(1);
            }

            tile.tint = this.fog ? 0x571F57 : 0xFFFFFF;

            tile.discovered = !this.fog;
            tile.type = "tile";

            tile.anchor.set(0.5, 1);
            tile.smoothed = false;
            tile.row = row;
            tile.col = col;
            tileArray[row][col] = tile;

            // add comparison method for tiles

            tile.compareTo = function (tile) {

                var row = this.row === tile.row,
                    col = this.col === tile.col;

                if (row && col) {
                    return true;
                }
            }
        }
    }

    this.game.physics.isoArcade.bounds.frontX = worldBounds;
    this.game.physics.isoArcade.bounds.frontY = worldBounds;
    this.game.physics.isoArcade.bounds.backX = 0;
    this.game.physics.isoArcade.bounds.backY = 0;

    this.tileMap = tileArray;
    this.blocked = blockedArray;
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Creates a size * size array with randomly assigned tiles. Can be modified to create a custom game map.
 *
 * @private
 *
 * @param size {number} Desired map size.
 *
 * @returns {sprite[]}
 */

Map.prototype._createTileMap = function (size) {

    var tileMap = [];

    for (var row = 0; row < size; row++) {

        tileMap[row] = [];

        for (var col = 0; col < size; col++) {

            var tileNum = Math.floor(Math.random() * 3);

            if (tileNum > 0) {
                tileMap[row][col] = tileNum;
            } else {
                tileMap[row][col] = 0;
            }
        }
    }

    return tileMap;
};


/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates global list of available tile keys.
 *
 * @private
 *
 * @this Map
 */

Map.prototype._generateMapKeys = function () {
    for (var frame of this.game.cache._cache.image[this.tileSet].frameData._frames) {
        Globals.mapTileKey.push(frame.name);
    }
};
