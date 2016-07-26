(function () {"use strict";})();
/**
 * Created by apizzimenti on 7/21/16.
 */

function Guide (element, gameElement) {
    
    this.raw = {};
    this.raw.guide = document.getElementById(element);
    this.raw.game = document.getElementById(gameElement);
    this.raw.canvas = this.raw.game.getElementsByTagName("canvas")[0];
    this.raw.guideHtml = this.raw.guide.innerHTML;
    this.raw.offsetTop = this.raw.canvas.offsetTop;
    this.raw.offsetLeft = this.raw.canvas.offsetLeft;
    this.raw.on = false;
    
    $(document).ready(() => {
        this.guideElement = $(`#${element}`);
        this.guideElement.css("display", "none");
        
        this.button();
    });
}

Guide.prototype.button = function () {
    
    var button = document.createElement("button"),
        buttonText = document.createTextNode("i"),
        id = "guideButton",
        template = `#${id}`;
    
    button.id = id;
    button.appendChild(buttonText);
    this.raw.game.appendChild(button);
    this.raw.guideButton = button;
        
    $(template).css({
        "position": "absolute",
        "top": this.raw.offsetTop + 20,
        "left": this.raw.offsetLeft + 20,
        "background-color": "transparent",
        "color": "#FFF",
        "border": "none",
        "font-family": "Courier",
        "font-size": "20px"
    });
    
    $(template).hover(() => {
       $(template).css({
           "cursor": "pointer"
       });
    });
    
    $(template).click(() => {
        
        $(template).css({
            "outline": "none"
        });
        
        if (!this.raw.on) {
            $(template).append(this.raw.guideHtml);
            this.raw.on = true;
        } else {
            $(template).empty();
            this.raw.on = false;
        }
    });
};
