(function () {"use strict";})();
/**
 * Created by apizzimenti on 5/19/16.
 */


/**
 * @author Anthony Pizzimenti
 *
 * @desc A set of variables that have to be used in disparate locations.
 * 
 * @type {{anchor: number[], mapTileKey: string[]}}
 */

var globals = {
    anchor: [0.5, 0],
    mapTileKey: ["grass", "sand", "sandstone"]
};

/**
 * @author Anthony Pizzimenti
 * 
 * @desc Easy calculation of world boundaries.
 * 
 * @param tileSize {number} Size of an individual tile.
 * @param mapSize {number} Desired size of the map. The map will be an array of mapSize * mapSize.
 * @param num {number} Number used to move world boundaries back num rows.
 *
 * @returns {number}
 *
 * @see Map
 */

function dim (tileSize, mapSize, num) {

    if (num) {
        return tileSize * (mapSize - (num + 1));
    } else {
        return tileSize - mapSize;
    }
}
