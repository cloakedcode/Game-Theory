Game = require('../src/game.js').Game;

exports.Lobby = function (game) {
    this.players = new Array();

    if (game instanceof Game == false) {
        throw "'game' must be of the type Game";
    }

    this.game = game;

    this.run_game = function () {
        return false;
    }
}
