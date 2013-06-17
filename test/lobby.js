var Lobby = require('../src/lobby.js'),
Game = require('../src/game.js')
, fs = require('fs')

describe('Game', function () {
    before(function (done) {
        dest = __dirname + '/../games/nodeunit_mock_game';
        fs.mkdir(dest, function () {
            config = fs.createWriteStream(dest + '/config.json');
            config.on('finish', function () {
                stream = fs.createWriteStream(dest + '/game.js');
                stream.on('finish', function () {
                    done();
                });
                fs.createReadStream(__dirname + '/mock_game/game.js').pipe(stream);
            });
            fs.createReadStream(__dirname + '/mock_game/config.json').pipe(config);
        })
    })

    after(function (done) {
        dir = __dirname + '/../games/nodeunit_mock_game';
        fs.unlink(dir + '/config.json', function () {
            fs.unlink(dir + '/game.js', function () {
                fs.rmdir(dir, done);
            })
        })
    })

    describe('#create', function () {
        it('should create with valid game name', function () {
            (function () {Lobby(Game({name: 'Test'}))}).should.not.throw;
        })
        
        it('should fail with invalid game name', function () {
            (function () {Lobby('tic-tac-toe')}).should.throw;
        })
    })

    describe('#add player', function () {
        before(function () {
            lobby = Lobby(Game({name: 'Test'}));
            player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, name: 'fake'};

            lobby.add_player(player);
        })

        it('should add player to lobby', function () {
            lobby.players.should.have.length(1);
        })

        it('should not add player if player is already in lobby', function () {
            lobby.add_player(player);
            lobby.players.should.have.length(1);
        })

        it('should set lobby of player', function () {
            player.lobby.should.eql(lobby);
        })
    })

    describe('#remove player', function () {
        before(function () {
            lobby = Lobby(Game({name: 'Test'}));
            player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, name: 'fake'};

            lobby.add_player(player);
            lobby.remove_player(player);
        })

        it('should remove player from lobby', function () {
            lobby.players.should.have.length(0);
        })

        it('should unset lobby of player', function () {
            player.should.have.property('lobby', null);
        })
    })

    describe('#pair players', function () {
        it('should create 3 pairs from 3 players', function () {
            lobby = Lobby(Game({name: 'Test'}));
            player = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake'};
            player2 = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake2'};
            player3 = {set_lobby: function (lobby) {this.lobby = lobby}, set_status: function () {}, round_ended: function () {}, name: 'fake3'};

            lobby.add_player(player);
            lobby.add_player(player2);
            lobby.add_player(player3);

            lobby.pair_players();

            lobby.pairs.should.be.length(3);
        })
    })
})
