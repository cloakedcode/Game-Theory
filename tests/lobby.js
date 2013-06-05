var Lobby = require('../src/lobby.js'),
Game = require('../src/game.js');

exports.create_lobby = function (test) {
    test.expect(3);
    
    test.throws(function () {Lobby('tic-tac-toe')});
    test.doesNotThrow(function () {Lobby(Game("rockpaperscissors"))});
    test.ok(Lobby(Game("rockpaperscissors")), 'Could not create Lobby.');

    test.done();
}
