var fs = require('fs')

exports.Game = function (name) {
    if (name === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    if ("name" in name) {
        fs.readdir('games/', function (err, files) {
            var games = new Array;

            for (i in files) {
                f = require('games/' + files[i]);
                if (name.name == f.name) {
                    this.num_per_round = f.num_per_round;
                    this.name = f.name;

                    this.play = f.play;
                }
            }
        });
    } else {
        included = require('games/' + name + '.js');

        this.num_per_round = included.num_per_round;
        this.name = included.name;

        this.play = included.play;
    }
}

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
