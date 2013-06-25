var fs = require('fs')
    , database = require(__dirname + '/db.js')

var GAME_DIR = (process.env.NODE_ENV == 'test') ? __dirname + '/../test/games' : __dirname + '/../games'; 

module.exports = exports = function (name) { return new Game(name, arguments[1]) };

exports.Game = Game;

function Game (options) {
    this.players = new Array();
    this._bots = null;
    this.dir_path = null;

    var callback = arguments[1] || function () {};

    if ((options instanceof Object) === false) {
        throw "Game objects must be created with {name: ''} parameter.";
    }

    if (options === undefined) {
        throw "Game objects must be created with an existing game name.";
    }

    var game = _game_named(options.name);
    if (game)
    {
        this.dir_path = game.dir_path;
        this.num_per_round = game.num_per_round;
        this.name = game.name;

        this.launch_game = game.launch_game;
    } else {
        throw "Game created with non-existent game name.";
    }

    return callback(this);
}

Game.prototype.play = function (pair, callback) {
    this.players = pair;
    this.callback = callback;

    for (var i=0; i<this.players.length; i++) {
        this.players[i].is_playing = true;
    }

    this.launch_game(this.players, this.game_ended.bind(this), database.db);
}

Game.prototype.game_ended = function (winner, choices) {
    if (choices) {
        database.save_round(winner, this, choices);
    }

    for (var i=0; i<this.players.length; i++) {
        this.players[i].is_playing = false;
        this.players[i].round_ended();
    }

    if (this.callback != undefined) {
        this.callback(this, this.players);
    }
}

Game.prototype.end = function () {
    if (this.players) {
        for (var i=0; i<this.players.length; i++) {
            this.players[i].is_playing = false;
            this.players[i].set_status('Game was stopped.');
        }
    }
}

Game.prototype.bots = function () {
    if (this._bots == null) {
        this._bots = new Array();

        var dir = this.dir_path + '/bots';
        if (fs.existsSync(dir)) {
            var files = fs.readdirSync(dir);
            for (var i=0; i<files.length; i++) {
                if (files[i][0] != '.') {
                    this._bots.push(require(dir + '/' + files[i]).Bot);
                }
            }
        }
    }

    return this._bots;
}

// the callback takes one argument, an array of games found
exports.available_games = function (callback) {
    // return an array of the file names in the games directory
    callback(_games());
}

exports.exists = function (name, callback) {
    // return an array of the file names in the games directory
    callback(_game_named(name) != null);
}

function _game_named(name) {
    var games = _games();
    for (var i=0; i<games.length; i++) {
        if (name == games[i].name) {
            return games[i];
        }
    }

    return null;
}

var games;

function _games() {
    if (games == undefined) {
        var files = fs.readdirSync(GAME_DIR);
        games = new Array();

        for (var i=0; i<files.length; i++) {
            var path = GAME_DIR + '/' + files[i];

            if (fs.statSync(path).isDirectory() && fs.existsSync(path + '/config.json')) {
                var f = require(path + '/config.json');
                var g = {};

                g.dir_path = path;
                g.num_per_round = f.num_per_round;
                g.name = f.name;

                g.launch_game = require(g.dir_path + '/game.js').play;

                games.push(g);
            }
        }
    }

    return games;
}
