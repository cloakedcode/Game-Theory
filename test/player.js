Player = require(__dirname + '/../src/player.js');

exports.set_lobby = function (test) {
    player = Player(null);
    lobby = {id: 'my fake lobby'};

    player.set_lobby(lobby);

    test.expect(1);
    test.ok(player.lobby == lobby, 'Failed to set lobby of player.');
    test.done();
}
