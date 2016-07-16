/**
 * Created by apizzimenti on 7/15/16.
 */

angular.module("game", []);

var game = angular.module("game"),
    global_game;

game.directive("game", function ($injector) {
    return {
        template: "<div id=\"gameCanvas\"></div>",
        
        link: function (scope, element, attrs) {
            
            global_game = new isogame(scope, $injector);
            
            scope.$on("load", () => {
                
            });
        }
    }
});