Game = require('../src/game.js').Game;

function Lobby(game) {
    var self = this;

    self.is_running = false;
    self.players = new Array();
    self.pairs = null;
    self.games = null;
    self.timeout_id = null;

    if (game instanceof Game == false) {
        throw "'game' must be of the type Game";
    }

    self.game = game;

    self.run_game = function () {
        self.is_running = true;

        self.pair_players();

        self.games = new Array();

        self.timeout_id = setInterval(self._run_loop, 750);
    }

    self._run_loop = function () {
        // for each pair of players
        for (var i = 0; i < self.pairs.length; i++) {
            skip = false;
            pair = self.pairs[i];
            for (var j = 0; j < pair.length; j++) {
                if (pair[j].socket == null || pair[j].is_playing) {
                    skip = true;
                    break;
                }
            }

            if (skip == false) {
                Game({name: self.game.name}, function (game) {
                    self.games.push(game);
                    game.play(pair, self.game_ended);
                });
            }
        }

        if (self.pairs.length <= 0) {
            clearInterval(self.timeout_id);
            self.timeout_id = null;
        }
    }

    self.game_ended = function (game, players) {
        // remove game from list of games now that it has ended
        i = self.games.indexOf(game);
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

        for (var i=0; i<self.games.length; i++) {
            self.games[i].end(self.game_ended);
        }
    }

    self.add_player = function (player) {
        if (self.players.indexOf(player) < 0) {
            self.players.push(player);
            player.set_lobby(self);
        }
    }

    self.remove_player = function (player) {
        i = self.players.indexOf(player);
        if (i >= 0) {
            self.players.splice(i, 1);
        }
    }

    // pairs players up to each other for playing the game
    self.pair_players = function () {
        self.pairs = new Array();

        for (var i = 0; i < self.players.length; i++) {
            for (var j = i+1; j < self.players.length; j += self.game.num_per_round - 1) {
                new_pair = self.players.slice(j, j + self.game.num_per_round - 1);
                new_pair.push(self.players[i]);

                self.pairs.push(new_pair);
            }
        }
    };
}

module.exports = exports = function (game) { return new Lobby(game) };

exports.Lobby = Lobby;
