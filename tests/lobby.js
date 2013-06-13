var Lobby = require('../src/lobby.js'),
Game = require('../src/game.js')
, fs = require('fs')

exports.setUp = function (callback) {
    fs.writeFileSync(__dirname + '/../games/nodeunit_test_game.js', "module.exports = exports = {name: 'Test', play: function (pair, callback) {callback()}, num_per_round: 2}");
    
    callback();
}

exports.tearDown = function (callback) {
    fs.unlinkSync(__dirname + '/../games/nodeunit_test_game.js');

    callback();
}

exports.create_lobby = function (test) {
    test.expect(2);
    
    test.throws(function () {Lobby('tic-tac-toe')}, 'Lobby created with invalid Game did not throw.');
    test.doesNotThrow(function () {Lobby(Game({name: 'Test'}))}, 'Lobby created with valid Game threw.');

    test.done();
}

exports.add_player = function (test) {
    lobby = Lobby(Game({name: 'Test'}));
    player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, name: 'fake'};

    lobby.add_player(player);

    test.expect(2);
    test.ok(lobby.players.length == 1 && lobby.players[0] == player, 'Failed to add player to lobby.');
    test.ok(player.lobby == lobby, 'Failed to set lobby of player.');
    test.done();
}

exports.remove_player = function (test) {
    lobby = Lobby(Game({name: 'Test'}));
    player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, name: 'fake'};

    lobby.add_player(player);
    lobby.remove_player(player);

    test.expect(2);
    test.ok(lobby.players.length == 0, 'Failed to remove player from lobby.');
    test.ok(player.lobby == null, 'Failed to reset lobby of player.');
    test.done();
}

exports.pair_players = function (test) {
    game = Game({name: 'Test'});
    lobby = Lobby(game);
    player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake'};
    player2 = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake2'};
    player3 = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake3'};

    lobby.add_player(player);
    lobby.add_player(player2);
    lobby.add_player(player3);

    lobby.pair_players();

    test.expect(1);
    test.ok(lobby.pairs.length == 3, 'Failed to pair players properly.');
    test.done();
}

exports.run_game = function (test) {
    game = Game({name: 'Test'});
    lobby = Lobby(game);
    player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake', socket: true};
    player2 = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake2', socket: true};

    lobby.add_player(player);
    lobby.add_player(player2);

    lobby.run_game();

    setTimeout(function (test, lobby, player) {
        test.expect(3);
        test.ok(lobby.pairs.length == 1, 'Failed to pair players.');
        test.ok(player.is_playing, 'Player is not marked as playing.');
        test.ok(lobby.is_running, 'Lobby is not marked as running.');
        test.done();
    }, 900, test, lobby, player);
}
