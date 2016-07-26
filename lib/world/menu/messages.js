(function () {"use strict";})();
/**
 * Created by apizzimenti on 7/15/16.
 */
 
/**
 * @author Anthony Pizzimenti
 *
 * @desc The Message structure handles all the popup messages in the game.
 *
 * @param game {object} Current Phaser game instance.
 * @param y {number} Height of the game.
 * @param size {number} Font size.
 *
 * @property game {object} Phaser game instance.
 * @property y {number} Height of the game.
 * @property message {string | string[]} Message to be displayed.
 * @property fontSize {number} Font size.
 * @property style {object} Message styling.
 * @property style.font {string} Font style.
 * @property style.fill {string} Hexadecimal color value.
 * @property alert {Signal} Signal.
 *
 * @class {object} Message
 * @this Message
 * @constructor
 */

function Message (game, y, size) {
    this.game = game;
    this.y = y;
    this.message = "";
    this.fontSize = size;
    this.style = {
        font: size + "px Courier",
        fill: "#FFFFFF"
    };
    
    this.alert = new Phaser.Signal();
    
    this.alert.add(() => {this.display()});
}

/**
 * @author Anthony Pizzimenti
 *
 * @desc Adds the provided message to the queue.
 *
 * @param message {string} Message to be added to the queue.
 *
 * @this Message
 */

Message.prototype.add = function (message) {
    this.message = message;
    this.alert.dispatch();
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays the message on the screen for five seconds, with in and out tweens.
 *
 * @this Message
 *
 * @todo get messages queue to work
 */

Message.prototype.display = function () {
    
    var str = this.format(this.message);
    
    this.text = this.game.add.text(str.width, str.height, str.message, this.style);
    
    this.text.alpha = 0;
    this.text.fixedToCamera = true;
    
    this.game.add.tween(this.text).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    
    this.game.time.events.add(Phaser.Timer.SECOND * 5, () => {
        this.game.add.tween(this.text).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    })
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Formats messages so they are 60 characters wide.
 *
 * @param message {string} Message to be formatted.
 *
 * @returns {{width: number, height: number, message: string}} Width and height of Phaser message area; formatted string.
 *
 * @todo Format according to where words are, not just the 60th character.
 */

Message.prototype.format = function (message) {
    var last = 0,
        strs = [],
        dist = message.length % 60 ? message.length - (message.length % 60) : 0;
    
    for (var i = 0; i < message.length; i++) {
        
        if (!(i % 60) && i !== 0) {
            strs.push(message.slice(last, i) + "\n");
            last = i;
        } else if (dist === 0 && i === message.length - 1) {
            strs.push(message.slice(last, message.length));
        } else if (i > dist && dist !== 0) {
            strs.push(message.slice(last, message.length));
            break;
        }
    }
    
    return {
        width: 10,
        height: this.y - (strs.length * (this.fontSize * 1.8)),
        message: strs.join(" ")
    }
};
