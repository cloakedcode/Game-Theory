var fs = require('fs')
    , database = require(__dirname + '/db.js')

var GAME_DIR = (process.env.NODE_ENV == 'test') ? __dirname + '/../test/games' : __dirname + '/../games'; 

function Game (options) {
    var self = this;

    self.players = null;
    self._bots = null;
    self.dir_path = null;

    if ((options instanceof Object) === false) {
        throw "Game objects must be created with {name: ''} parameter.";
    }

    if (options === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    var callback = arguments[1] || function () {};

    // @TODO: cache the games found and load game from that
    var files = fs.readdirSync(GAME_DIR);
    for (var i=0; i<files.length; i++) {
        var path = GAME_DIR + '/' + files[i];

        if (fs.statSync(path).isDirectory() && fs.existsSync(path + '/config.json')) {
            var f = require(path + '/config.json');
            if (options.name == f.name) {
                self.dir_path = path;
                self.num_per_round = f.num_per_round;
                self.name = f.name;

                self.launch_game = require(self.dir_path + '/game.js').play;

                break;
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

        setTimeout(self.launch_game, 2000, self.players, self.game_ended, database.db);
    }

    self.game_ended = function (winner, choices) {
        if (choices) {
            database.save_round(winner, self, choices);
        }

        for (var i=0; i<self.players.length; i++) {
            self.players[i].is_playing = false;
            self.players[i].round_ended();
        }
        
        if (self.callback != undefined) {
            self.callback(self, self.players);
        }
    }

    self.bots = function () {
        if (self._bots == null) {
            self._bots = new Array();

            var dir = self.dir_path + '/bots';
            if (fs.existsSync(dir)) {
                var files = fs.readdirSync(dir);
                for (var i=0; i<files.length; i++) {
                    if (files[i][0] != '.') {
                        self._bots.push(require(dir + '/' + files[i]).Bot);
                    }
                }
            }
        }

        return self._bots;
    }
}

module.exports = exports = function (name) { return new Game(name, arguments[1]) };

exports.Game = Game;

// the callback takes one argument, an array of games found
exports.available_games = function (callback) {
    // return an array of the file names in the games directory
    fs.readdir(GAME_DIR, function (err, files) {
        var games = new Array;

        for (var i=0; i<files.length; i++) {
            var path = GAME_DIR + '/' + files[i];
            if (fs.statSync(path).isDirectory() && fs.existsSync(path + '/config.json')) {
                var name = require(path + '/config.json').name;
                games.push({name: name});
            }
        }

        callback(games);
    });
}

exports.exists = function (name, callback) {
    // return an array of the file names in the games directory
    fs.readdir(GAME_DIR, function (err, files) {
        for (var i=0; i<files.length; i++) {
            var path = GAME_DIR + '/' + files[i];
            if (fs.statSync(path).isDirectory() && fs.existsSync(path + '/config.json')) {
                var game_name = require(path + '/config.json').name;

                if (name == game_name) {
                    return callback(true);
                }
            }
        }

        callback(false);
    });
}
