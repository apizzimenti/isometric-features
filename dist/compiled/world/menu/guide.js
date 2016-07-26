"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/21/16.
 */

function Guide(element, gameElement) {
    var _this = this;

    this.raw = {};
    this.raw.guide = document.getElementById(element);
    this.raw.game = document.getElementById(gameElement);
    this.raw.canvas = this.raw.game.getElementsByTagName("canvas")[0];
    this.raw.guideHtml = this.raw.guide.innerHTML;
    this.raw.offsetTop = this.raw.canvas.offsetTop;
    this.raw.offsetLeft = this.raw.canvas.offsetLeft;
    this.raw.on = false;

    $(document).ready(function () {
        _this.guideElement = $("#" + element);
        _this.guideElement.css("display", "none");

        _this.button();
    });
}

Guide.prototype.button = function () {
    var _this2 = this;

    var button = document.createElement("button"),
        buttonText = document.createTextNode("i"),
        id = "guideButton",
        template = "#" + id;

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

    $(template).hover(function () {
        $(template).css({
            "cursor": "pointer"
        });
    });

    $(template).click(function () {

        $(template).css({
            "outline": "none"
        });

        if (!_this2.raw.on) {
            $(template).append(_this2.raw.guideHtml);
            _this2.raw.on = true;
        } else {
            $(template).empty();
            _this2.raw.on = false;
        }
    });
};
