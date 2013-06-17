var Game = require(__dirname + '/../src/game.js')
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
        it('should fail with invalid name', function () {
            (function () { Game() }).should.throw;
            (function () { Game({name: 'sdflksjdf'}) }).should.throw;
        });

        it('should create game', function () {
            game = Game({name: 'Test'});
            game.should.exist;
            game.should.have.property('name', 'Test');
        })
    })

    describe('#play', function () {
        it('should mark players as playing', function (done) {
            Player = {is_playing: false, set_status: function () {}, round_ended: function () {}};
            Player2 = {is_playing: false, set_status: function () {}, round_ended: function () {}};

            game = Game({name: 'Test'});
            game.launch_game = function (pair, end) {
                pair[0].is_playing.should.be.true;
                end();
            };
            game.play([Player, Player2], function (game, players) {
                players[0].is_playing.should.not.be.true;
                done();
            });
        })
    })

    describe('#available game', function () {
        it('should have a non-empty list of games', function (done) {
            Game.available_games(function (games) {
                games.should.not.be.empty;
                done();
            })
        })
    })

    describe('#exists', function () {
        it('should be true with valid game name', function (done) {
            Game.exists('Test', function (exists) {
                exists.should.be.true;
                done();
            })
        })
        it('should be true with valid game name', function (done) {
            Game.exists('sdlfkasjfd', function (exists) {
                exists.should.be.false;
                done();
            })
        })
    })
})
