
var p = require("path");

module.exports = {
    entry: "./lib/index.js",
    output: {
        filename: "isometric-features.js",
        path: p.resolve(__dirname, "dist")
    }
};
