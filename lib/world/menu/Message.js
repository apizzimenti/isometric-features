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
 * @param size {number} Font size.
 * @param [loc="bottom_left"] {string} Preferred location for messages: can be <code>"bottom_left"</code>, <code>"bottom_right"</code>,
 * <code>"top_left"</code>, or <code>"top_right"</code>.
 *
 * @property game {object} Phaser game instance.
 * @property y {number} Height of the game.
 * @property messages {string[]} Message queue.
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

function Message (game, size, loc) {
    
    this.game = game;
    this.y = this.game.height;
    this.messages = [];
    this.loc = loc;
    this.fontSize = size;

    this.style = {
        font: size + "px Courier",
        fill: "#FFFFFF"
    };

    // create Phaser signal dispatcher
    this.alert = new Phaser.Signal();

    // instantiate new events
    this.alert.add(() => {this._display()});
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
    this.messages.push(message);

    if (this.messages.length <= 1) {
        this.alert.dispatch();
    }
};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Displays the message at the front of the queue on the screen for five seconds, with in and out tweens.
 *
 * @private
 *
 * @this Message
 */

Message.prototype._display = function () {

        // correctly format message
    var str = this._format(this.messages[0]),
        tween;

    // add message text
    this.text = this.game.add.text(str.x, str.y, str.msg, this.style);

    this.text.alpha = 0;
    this.text.fixedToCamera = true;

    // tween the text in
    this.game.add.tween(this.text).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {

        // tween the text out
        tween = this.game.add.tween(this.text).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);

        // when the above tween is completed, reset the queue and dispactch the next message
        tween.onComplete.add(() => {
            this.messages = this.messages.slice(1, this.messages.length);
            if (this.messages.length !== 0) {
                this.alert.dispatch();
            }
        })
    });

};

/**
 * @author Anthony Pizzimenti
 *
 * @desc Formats messages so they are 60 characters wide.
 *
 * @private
 *
 * @param message {string} Message to be formatted.
 *
 * @returns {{x: number, y: number, msg: string}} Width and height of Phaser message area; formatted string.
 *
 * @todo Format according to where words are, not just the 60th character.
 */

Message.prototype._format = function (message) {
    
    var last = 0,
        strs = [],
        dist = message.length % 60 ? message.length - (message.length % 60) : 0,
        vals = {};
    
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
    
    switch (this.loc) {
        
        case "bottom_left": default:
            vals.x = 10;
            vals.y = this.y - (strs.length * this.fontSize * 1.8);
            break;
            
        case "top_left":
            vals.x = 10;
            vals.y = strs.length * (this.fontSize * 1.8);
            break;
        
        case "top_right":
            vals.x = this.game.width - 540;
            vals.y = 10;
            break;
        
        case "bottom_right":
            vals.x = this.game.width - 540;
            vals.y = this.y - (strs.length * this.fontSize * 1.8);
            break;
    }
    
    vals.msg = strs.join(" ");
    return vals;
};
