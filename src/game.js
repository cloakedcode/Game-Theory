var root_dir = require('src/config.js').root_dir,
fs = require('fs')

exports.Game = function (name) {
    if (name === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    included = require(root_dir + '/games/' + name + '.js');

    this.num_per_round = included.num_per_round;
    this.name = included.name;

    this.play = included.play;
}

// the callback takes one argument, an array of games found
exports.available_games = function (callback) {
    // return an array of the file names in the games directory
    fs.readdir(root_dir + '/games/', function (err, files) {
        var games = new Array;

        for (i in files) {
            // name is the file name minus the ".js" extension
            name = require(root_dir + '/games/' + files[i]).name;
            games.push(name);
        }

        callback(games);
    });
}
