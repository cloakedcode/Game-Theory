var Player = require(__dirname + '/../src/player.js');

describe('Player', function () {
    describe('#set lobby', function () {
        it('should set lobby of player', function () {
            var player = Player(null);
            var lobby = {id: 'my fake lobby'};

            player.set_lobby(lobby);

            player.lobby.should.be.eql(lobby);
        })
    })
})
