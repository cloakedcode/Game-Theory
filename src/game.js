var fs = require('fs')

var GAME_DIR = __dirname + '/../games/';

function Game (options) {
    var self = this;

    self.players = null;
    self.bots = null;
    self.dir_path = null;

    if (options === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    callback = arguments[1] || function () {};

    // @TODO: cache the games found and load game from that
    files = fs.readdirSync(GAME_DIR);
    for (var i=0; i<files.length; i++) {
        if (files[i][0] != '.') {
            path = GAME_DIR + files[i];

            if (fs.statSync(path).isDirectory() && fs.existsSync(path + '/config.json')) {
                f = require(path + '/config.json');
                if (options.name == f.name) {
                    self.dir_path = path;
                    self.num_per_round = f.num_per_round;
                    self.name = f.name;

                    break;
                }
            }
        }
    }

    if (self.name == undefined) {
        throw "Game created with non-existent game name.";
    }


    callback(self);

    self.play = function (pair, callback) {
        self.players = pair;
        self.callback = callback;

        for (var i=0; i<self.players.length; i++) {
            self.players[i].is_playing = true;
            self.players[i].set_status('Get ready...');
        }

        self._play = require(self.dir_path + '/game.js').play;

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

    self.bots = function () {
        if (self.bots == null) {
            self.bots = new Array();

            dir = self.dir_path + '/bots';
            if (fs.existsSync(dir)) {
                files = fs.readdirSync(dir);
                for (var i=0; i<files.length; i++) {
                    if (files[i][0] != '.') {
                        self.bots.push(require(dir + '/' + files[i]).Bot);
                    }
                }
            }
        }

        return self.bots;
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
