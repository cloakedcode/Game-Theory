var Game = require(__dirname + '/game.js')
    , db = require(__dirname + '/db.js').db

GAME_START_TIME = '';

module.exports = exports = function (game) { return new Lobby(game) };

exports.Lobby = Lobby;

function Lobby(game) {
    this.is_running = false;
    this.players = new Array();
    this.pairs = null;
    this.games = null;
    this.timeout_id = null;

    if (game instanceof Game.Game == false) {
        throw "'game' must be of the type Game";
    }

    this.game = game;
}

Lobby.prototype.run_game = function () {
    this.is_running = true;

    _load_bots(this);

    if (this.players.length > 0) {
        this.pair_players();

        this.games = new Array();

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].set_status('Get ready...');
        }

        GAME_START_TIME = now();
        this.timeout_id = setInterval(this._run_loop.bind(this), 1000);
    }
}

Lobby.prototype._run_loop = function () {
    // for each pair of players
    for (var i = 0; i < this.pairs.length; i++) {
        var skip = false;
        var pair = this.pairs[i];
        for (var j = 0; j < pair.length; j++) {
            if (pair[j].is_connected() == false || pair[j].is_playing) {
                skip = true;
                break;
            }
        }

        if (skip) {
            for (var j = 0; j < pair.length; j++) {
                if (pair[j].is_connected() && pair[j].is_playing == false ) {
                    pair[j].set_status('Wait for available opponents..');
                }
            }
        } else {
            var game = Game({name: this.game.name});
            game.db = db;
            this.games.push(game);
            game.play(pair, this._game_ended.bind(this));
        }
    }

    if (this.pairs.length <= 0) {
        clearInterval(this.timeout_id);
        this.timeout_id = null;
        this.is_running = false;
    }
}

/**
 * this is an internal function that should never be called directly.
 */
Lobby.prototype._game_ended = function (game, players) {
    // remove game from list of games now that it has ended
    var i = this.games.indexOf(game);
    if (i >= 0) {
        this.games.splice(i, 1);
    }

    // remove player pairing
    i = this.pairs.indexOf(players);
    if (i >= 0) {
        this.pairs.splice(i, 1);
    }

    if (this.games.length <= 0) {
        this.is_running = false;
    }
}

Lobby.prototype.end_game = function () {
    if (this.timeout_id != null) {
        clearInterval(this.timeout_id);
        this.timeout_id = null;
    }

    if (this.games) {
        for (var i=0; i<this.games.length; i++) {
            this.games[i].end();
        }
    }

    this.is_running = false;
}

Lobby.prototype.add_player = function (player) {
    if (this.players.indexOf(player) < 0) {
        this.players.push(player);
        player.set_lobby(this);
        player.set_status("You have joined the game lobby.");
    }
}

Lobby.prototype.remove_player = function (player) {
    var i = this.players.indexOf(player);
    if (i >= 0) {
        this.players[i].set_lobby(null);
        this.players.splice(i, 1);
    }
}

// pairs players up to each other for playing the game
Lobby.prototype.pair_players = function () {
    this.pairs = new Array();

    for (var i = 0; i < this.players.length; i++) {
        for (var j = i+1; j < this.players.length; j += this.game.num_per_round - 1) {
            var new_pair = this.players.slice(j, j + this.game.num_per_round - 1);
            new_pair.push(this.players[i]);

            this.pairs.push(new_pair);
        }
    }
}

_load_bots = function (lobby) {
    var bots = lobby.game.bots();
    for (var i=0; i<bots.length; i++) {
        lobby.add_player(bots[i]);
    }
}

function now() {
    function pad(num) {
        return (num >= 0 && num < 10) ? '0' + num : num + '';
    }

    var n = new Date();
    return pad(n.getDate())+'/'+pad(n.getMonth()+1)+'/'+pad(n.getFullYear())+' '+pad(n.getHours())+':'+pad(n.getMinutes())+':'+pad(n.getSeconds());
}
