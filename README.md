# isometric-features

[![Github Tag](https://img.shields.io/github/tag/apizzimenti/isometric-features.svg?maxAge=2592000)]()
[![GitHub release](https://img.shields.io/github/release/apizzimenti/isometric-features.svg?maxAge=2592000)]()
[![license](https://img.shields.io/github/license/apizzimenti/isometric-features.svg?maxAge=2592000)]()

This project is supplemental to lewster32's [phaser-plugin-isometric](https://github.com/lewster32/phaser-plugin-isometric).

### features
* easy main character creation
* simple "animal" creation
* animal pathfinding
* concise debugging
* easy inventory and item creation
* per-item action methods
* simple world maps
* high-level mouse interactivity

### installation

`$ bower install isometric-features --save`

### usage

For now, this game depends on angular's `$scope`. So, for example, create a directive:

    var game = angular.module("game");
    
    game.directive("game", function ($injector) {
        return {
            template: "<div id=gameId></div>",
            link: function (scope, element, attrs) {
                var g = new isometric-game(scope, $injector);
                
                scope.$on("load", function () {
                    ...
                };
            }
        }
    }
    
This will inject a new game instance into your html, where `isometric-game` is the name of your Phaser game function.

After this, it's all JS programming. Set up a basic isometric phaser game, and use whatever you like. Keep in mind that
there is a chain of dependency, which can be investigated in this project's documentation. When the game itself loads,
it will fire out a "load" event, at which point you can send messages, items, characters, or anything else into the game
from angular itself.

Feel free to download this repo and run the test files, as they provide a robust example with a commented-out main 
Phaser game and a loader class (highly recommended for large games).

### documentation
The documentation can be found [here](https://apizzimenti.github.io/isometric-features-docs/).
