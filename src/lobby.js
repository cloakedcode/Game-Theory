var Game = require(__dirname + '/game.js')
    , db = require(__dirname + '/db.js').db

GAME_START_TIME = '';

function Lobby(game) {
    var self = this;

    self.is_running = false;
    self.players = new Array();
    self.pairs = null;
    self.games = null;
    self.timeout_id = null;

    if (game instanceof Game.Game == false) {
        throw "'game' must be of the type Game";
    }

    self.game = game;

    self.run_game = function () {
        self.is_running = true;

        self._load_bots();

        if (self.players.length > 0) {
            self.pair_players();

            self.games = new Array();

            GAME_START_TIME = now();
            self.timeout_id = setInterval(self._run_loop, 1000);
        }
    }

    self._run_loop = function () {
        // for each pair of players
        for (var i = 0; i < self.pairs.length; i++) {
            var skip = false;
            var pair = self.pairs[i];
            for (var j = 0; j < pair.length; j++) {
                if (pair[j].is_connected() == false || pair[j].is_playing) {
                    skip = true;
                    break;
                }
            }

            if (skip == false) {
                var game = Game({name: self.game.name});
                game.db = db;
                self.games.push(game);
                game.play(pair, self._game_ended);
            }
        }

        if (self.pairs.length <= 0) {
            clearInterval(self.timeout_id);
            self.timeout_id = null;
            self.is_running = false;
        }
    }

    /**
     * this is an internal function that should never be called directly.
     */
    self._game_ended = function (game, players) {
        // remove game from list of games now that it has ended
        var i = self.games.indexOf(game);
        if (i >= 0) {
            self.games.splice(i, 1);
        }

        // remove player pairing
        i = self.pairs.indexOf(players);
        if (i >= 0) {
            self.pairs.splice(i, 1);
        }
        
        if (self.games.length <= 0) {
            self.is_running = false;
        }
    }

    self.end_game = function () {
        if (self.timeout_id != null) {
            clearInterval(self.timeout_id);
            self.timeout_id = null;
        }

        if (self.games) {
            for (var i=0; i<self.games.length; i++) {
                self.games[i].end();
            }
        }

        self.is_running = false;
    }

    self.add_player = function (player) {
        if (self.players.indexOf(player) < 0) {
            self.players.push(player);
            player.set_lobby(self);
            player.set_status("You have joined the game lobby.");
        }
    }

    self.remove_player = function (player) {
        var i = self.players.indexOf(player);
        if (i >= 0) {
            self.players[i].set_lobby(null);
            self.players.splice(i, 1);
        }
    }

    // pairs players up to each other for playing the game
    self.pair_players = function () {
        self.pairs = new Array();

        for (var i = 0; i < self.players.length; i++) {
            for (var j = i+1; j < self.players.length; j += self.game.num_per_round - 1) {
                var new_pair = self.players.slice(j, j + self.game.num_per_round - 1);
                new_pair.push(self.players[i]);

                self.pairs.push(new_pair);
            }
        }
    }

    self._load_bots = function () {
        var bots = self.game.bots();
        for (var i=0; i<bots.length; i++) {
            self.add_player(bots[i]);
        }
    }
}

function now() {
    function pad(num) {
        return (num >= 0 && num < 10) ? '0' + num : num + '';
    }

    var n = new Date();
    return pad(n.getDate())+'/'+pad(n.getMonth()+1)+'/'+pad(n.getFullYear())+' '+pad(n.getHours())+':'+pad(n.getMinutes())+':'+pad(n.getSeconds());
}

module.exports = exports = function (game) { return new Lobby(game) };

exports.Lobby = Lobby;
