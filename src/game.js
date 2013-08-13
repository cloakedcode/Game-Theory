var fs = require('fs')
    , database = require(__dirname + '/db.js')
    , Player = require(__dirname + '/player.js').Player

var GAME_DIR = (process.env.NODE_ENV == 'test') ? __dirname + '/../test/games' : __dirname + '/../games'; 

exports.Game = Game;

function Game (options) {
    this.players = new Array();
    this._bots = null;
    this.dir_path = null;
}

Game.prototype.launch_game = function (pair, callback) {
    this.players = pair;
    this.callback = callback;

    for (var i=0; i<this.players.length; i++) {
        this.players[i].is_playing = true;
    }

    this.play(this.players, this.game_ended.bind(this), database.db);
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
                    var bot = require(dir + '/' + files[i]).Bot;
                    bot.prototype.__proto__ = Player.prototype;

                    this._bots.push(new bot());
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

exports.game_named = function (name) {
    return _game_named(name);
}

function _game_named(name) {
    var games = _games();
    for (var i=0; i<games.length; i++) {
        if (name == games[i].display_name) {
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
                var file_game = require(path + '/game.js').Game;

                file_game.prototype.__proto__ = Game.prototype;

                var g = new file_game();

                g.dir_path = path;
                g.num_per_round = f.num_per_round;
                g.display_name = f.name;
                g.parameters = f.parameters;

                games.push(g);
            }
        }
    }

    return games;
}
