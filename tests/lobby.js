var Lobby = require('../src/lobby.js').Lobby,
Game = require('../src/game.js').Game;

exports.create_lobby = function (test) {
    test.expect(3);
    
    test.throws(function () {new Lobby('tic-tac-toe')});
    test.doesNotThrow(function () {new Lobby(new Game("rockpaperscissors"))});
    test.ok(new Lobby(new Game("rockpaperscissors")), 'Could not create Lobby.');

    test.done();
}
