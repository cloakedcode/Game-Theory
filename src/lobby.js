Game = require('../src/game.js').Game;

function Lobby(game) {
    var self = this;

    self.is_running = false;
    self.players = new Array();

    if (game instanceof Game == false) {
        throw "'game' must be of the type Game";
    }

    self.game = game;

    self.run_game = function () {
        self.is_running = true;

        // for each pair of players
        pair = null;
        self.game.play(pair, self.game_ended);

        return false;
    }

    self.end_game = function () {
        self.game.end(self.game_ended);
    }

    self.game_ended = function (players) {
        self.is_running = false;
    }

    self.add_player = function (player) {
        console.log(self.game);
        if (self.players.indexOf(player) < 0) {
            self.players.push(player);
            player.set_status("You joined <em>"+self.game.name+"</em>.");
        }
    }
}

module.exports = exports = function (game) { return new Lobby(game) };

exports.Lobby = Lobby;
