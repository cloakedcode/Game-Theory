var fs = require('fs')

var GAME_DIR = __dirname + '/../games/';

function Game (name) {
    var self = this;

    self.players = null;

    if (name === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    callback = arguments[1] || function () {};

    if (name instanceof Object && "name" in name) {
        files = fs.readdirSync(GAME_DIR);
        for (var i=0; i<files.length; i++) {
            if (files[i][0] != '.') {
                f = require(GAME_DIR + files[i]);
                if (name.name == f.name) {
                    self.num_per_round = f.num_per_round;
                    self.name = f.name;

                    self._play = f.play;
                    break;
                }
            }
        }

        if (self.name == undefined) {
            throw "Game created with non-existent game name.";
        }

        callback(self);
    } else {
        included = require(GAME_DIR + name + '.js');

        self.num_per_round = included.num_per_round;
        self.name = included.name;

        self._play = included.play;
        
        callback(self);
    }

    self.play = function (pair, callback) {
        self.players = pair;
        self.callback = callback;

        for (var i=0; i<self.players.length; i++) {
            self.players[i].is_playing = true;
            self.players[i].set_status('Get ready...');
        }

        setTimeout(self._play, 2000, self.players, self.game_ended);
    }

    self.game_ended = function () {
        for (var i=0; i<self.players.length; i++) {
            self.players[i].is_playing = false;
            self.players[i].round_ended();
        }
        
        if (self.callback != undefined) {
            self.callback(self, self.players);
        }
    }
}

module.exports = exports = function (name) { return new Game(name, arguments[1]) };

exports.Game = Game;

// the callback takes one argument, an array of games found
exports.available_games = function (callback) {
    // return an array of the file names in the games directory
    fs.readdir(GAME_DIR, function (err, files) {
        var games = new Array;

        for (i in files) {
            if (files[i][0] != '.') {
                // name is the file name minus the ".js" extension
                name = require(GAME_DIR + files[i]).name;
                games.push({name: name});
            }
        }

        callback(games);
    });
}

exports.exists = function (name, callback) {
    // return an array of the file names in the games directory
    fs.readdir(GAME_DIR, function (err, files) {
        for (i in files) {
            if (files[i][0] != '.') {
                // name is the file name minus the ".js" extension
                game_name = require(GAME_DIR + files[i]).name;

                if (name == game_name) {
                    return callback(true);
                }
            }
        }

        callback(false);
    });
}
