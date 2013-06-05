var fs = require('fs')

function Game (name) {
    var self = this;

    if (name === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    if ("name" in name) {
        fs.readdir('games/', function (err, files) {
            var games = new Array;

            for (i in files) {
                f = require('games/' + files[i]);
                if (name.name == f.name) {
                    self.num_per_round = f.num_per_round;
                    self.name = f.name;

                    self.play = f.play;
                }
            }
        });
    } else {
        included = require('games/' + name + '.js');

        self.num_per_round = included.num_per_round;
        self.name = included.name;

        self.play = included.play;
    }
}

module.exports = exports = function (name) { return new Game(name) };

exports.Game = Game;

// the callback takes one argument, an array of games found
exports.available_games = function (callback) {
    // return an array of the file names in the games directory
    fs.readdir('games/', function (err, files) {
        var games = new Array;

        for (i in files) {
            // name is the file name minus the ".js" extension
            name = require('games/' + files[i]).name;
            games.push({name: name});
        }

        callback(games);
    });
}

exports.exists = function (name, callback) {
    // return an array of the file names in the games directory
    fs.readdir('games/', function (err, files) {
        for (i in files) {
            // name is the file name minus the ".js" extension
            game_name = require('games/' + files[i]).name;

            if (name == game_name) {
                return callback(true);
            }
        }

        callback(false);
    });
}
