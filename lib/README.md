### Common Errors

#### `tileset is attempting to enable a physics body with an unknown physics system.`
This error arises when the Isometric Plugin is incompatible with the version of Phaser that's installed. As of June 22,
2016, the highest compatible Phaser version is v2.4.4 Amador. To install it, run `bower install Phaser#2.4.4`. bower will
resolve the version, and present you with numbered options to install the versions it finds.

#### `unexpected token <token>`
If you are using any ES6 features in Chrome, Firefox, or Safari, this error may arise. `<token>` can represent any variety
of ES6 functionality pieces, including `import`, `export`, arrow functions, `const`, and many others. To resolve this,
you can run a transpiler like Babel, or use the included gruntfile with `grunt babel`.

If you are using Internet Explorer or Edge, please stop.

#### `Uncaught TypeError: Cannot set property <prop> of undefined.`
This occurs most often with bad function scoping. For example:

    this = {
        nice: 1,
        awesome: 2,
        kangaroo: 3,
        
        say: function (something) {
            console.log("Say " + something + " I'm giving up on you");
        }
    };
    
    function set (prop) {
        this.say("something");
        // everything breaks here
        
        ...
    }

This is because JavaScript has lexical *and* function scoping, so `this` refers only to the current scope; the function
`set` has no `say()` method, so it cannot be called.

#### `Uncaught TypeError: Cannot read property <num> of undefined.`
This is an error with the physics system. If this error occurs, you possibly have an outdated version of the package.
### Dependency Chain

Many constructs in this game require others as dependencies. As such, before each is declared, it should have all of
its dependencies declared prior.

|  this | requires this |
| :---  | -----------: |
| `Animal` `Player` `Inventory` `Mouse` | `Map` |
| `contextMenu` `Item` | `Inventory` |
| `Inventory` | `Mouse` |


### Contact

You can email the authors of this game at:

cale-bierman@uiowa.edu

anthony-pizzimenti@uiowa.edu

derek-siebert@uiowa.edu

steven-tomblin@uiowa.edu