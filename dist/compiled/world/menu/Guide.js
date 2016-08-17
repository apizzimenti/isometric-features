"use strict";

(function () {})();
/**
 * Created by apizzimenti on 7/21/16.
 */

/**
 * @author Anthony Pizzimenti
 *
 * @desc Element for containing how-to information and making it visible (or invisible) to the player. The guide
 * will always appear in the center of the sceen and be 1/2 the dimensions of the game window (unless overridden).
 *
 * @param element {string} String id for the HTML element that will serve as your guide..
 * @param gameElement {string} String id for element that hosts the game canvas (the same name as when the Phaser game is initialized).
 * @param [buttonOptions=null] {object} Button text and style options.
 * @param [buttonOptions.text="i"] {string} Text displayed within the button.
 * @param [buttonOptions.style={}] {object} Styling for guide button.
 * @param [buttonOptions.hover={}] {object} Styling for guide button
 * @param [menuStyles=null] {object} Custom style overrides.
 *
 * @example
 *
 * // index.html
 * // in your html, simply include an element containing guide information, like so:
 *
 * ...
 *     <div id="guide">
 *         <h1>Introduction</h1>
 *             Blah blah blah...
 *     </div>
 * ...
 *
 *
 * // .js file where game is located
 *
 * var guide;
 *
 * // no custom styles
 * guide = new Guide("guide", "gameCanvas")
 *
 * // custom styles
 * guide = new Guide("guide", "gameCanvas", {
 *    "color": "black",
 *    "text-align": "center"
 * });
 *
 * // check the test/ folder for a usable example.
 *
 * @class Guide
 * @constructor
 */

function Guide(element, gameElement, buttonOptions, menuStyles) {

    var _this = this;

    this.raw = {};

    this.raw.buttonOptions = buttonOptions || null;
    this.raw.buttonOptions.default = {
        "color": "#FFF",
        "border": "none",
        "font-size": "20px",
        "background-color": "transparent"
    };

    this.raw.guideId = element;
    this.raw.canvasId = gameElement;
    this.raw.guide = document.getElementById(element);
    this.raw.game = document.getElementById(gameElement);
    this.raw.canvas = this.raw.game.getElementsByTagName("canvas")[0];
    this.raw.guideHtml = this.raw.guide.innerHTML;
    this.raw.offsetTop = this.raw.canvas.offsetTop;
    this.raw.offsetLeft = this.raw.canvas.offsetLeft;
    this.raw.on = false;
    this.raw.guide.styles = menuStyles || null;

    $(document).ready(function () {
        _this.guideElement = $("#" + element);

        _this._configureWindow();
        _this._button();
    });
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates a _button on top of the game canvas for displaying help information.
 *
 * @private
 *
 * @this Guide
 */

Guide.prototype._button = function () {

    var button = document.createElement("button"),
        buttonText = document.createTextNode(this.raw.buttonOptions.text || "i"),
        id = "guideButton",
        template = "#" + id,
        _this = this;

    button.id = id;
    button.appendChild(buttonText);
    this.raw.game.appendChild(button);
    this.raw.guideButton = button;
    this.raw.guideButton.className = "guide-button";
    this.raw.guideButton.on = false;
    this.raw.guideButton.template = template;

    $(template).css({
        "top": _this.raw.offsetTop + 20,
        "left": _this.raw.offsetLeft + 20
    });

    if (this.raw.buttonOptions.style) {
        $(template).css(this.raw.buttonOptions.style);
    }

    $(template).hover(function () {
        $(template).css({
            "cursor": "pointer"
        });

        if (_this.raw.buttonOptions.hover) {
            $(template).css(_this.raw.buttonOptions.hover);
        }
    }, function () {
        $(template).css({
            "cursor": "default"
        });

        if (_this.raw.buttonOptions.style) {
            $(template).css(_this.raw.buttonOptions.style);
        } else {
            $(template).css(_this.raw.buttonOptions.default);
        }
    });

    $(template).click(function () {

        if (!_this.raw.guideButton.on) {
            _this.raw.guideButton.on = true;
            $("#" + _this.raw.guideId).css({
                "display": "block"
            });
        } else {
            _this.raw.guideButton.on = false;
            $("#" + _this.raw.guideId).css({
                "display": "none"
            });
        }
    });
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Generates the guide window and its dimensions, positioning, style.
 *
 * @private
 *
 * @this Guide
 */

Guide.prototype._configureWindow = function () {

    var template = "#" + this.raw.guideId,
        offset = $("#" + this.raw.canvasId).offset(),
        canvas = this.raw.canvas,
        w = canvas.width / 2,
        h = canvas.height / 2,
        top = h / 2 + offset.top,
        left = (window.innerWidth - canvas.offsetWidth + w) / 2,
        el = this.raw.guide;

    el.className = "guide";

    $(template).css({
        "display": "none",
        "left": left,
        "top": top,
        "width": w,
        "height": h
    });

    if (this.raw.guide.styles) {
        $(template).css(this.raw.guide.styles);
    }
};
