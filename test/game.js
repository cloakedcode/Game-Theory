var Game = require(__dirname + '/../src/game.js')
, fs = require('fs')

describe('Game', function () {
    before(function (done) {
        var dest = __dirname + '/../games/nodeunit_mock_game';
        fs.exists(dest, function (exists) {
            if (exists) {
                return done();
            }

            fs.mkdir(dest, function () {
                var config = fs.createWriteStream(dest + '/config.json');
                config.on('finish', function () {
                    var stream = fs.createWriteStream(dest + '/game.js');
                    stream.on('finish', function () {
                        fs.mkdirSync(dest + '/bots');

                        var bot = fs.createWriteStream(dest + '/bots/bot.js');
                        bot.on('finish', done);
                        fs.createReadStream(__dirname + '/mock_game/bots/bot.js').pipe(bot);
                    });
                    fs.createReadStream(__dirname + '/mock_game/game.js').pipe(stream);
                });
                fs.createReadStream(__dirname + '/mock_game/config.json').pipe(config);
            })
        })
    })

    after(function (done) {
        var dir = __dirname + '/../games/nodeunit_mock_game';
        fs.unlink(dir + '/config.json', function () {
            fs.unlink(dir + '/game.js', function () {
                fs.unlinkSync(dir + '/bots/bot.js');
                fs.rmdirSync(dir + '/bots');
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
            var game = Game({name: 'Test'});
            game.should.exist;
            game.should.have.property('name', 'Test');
        })
    })

    describe('#play', function () {
        it('should mark players as playing', function (done) {
            var Player = {is_playing: false, set_status: function () {}, round_ended: function () {}};
            var Player2 = {is_playing: false, set_status: function () {}, round_ended: function () {}};

            var game = Game({name: 'Test'});
            game.launch_game = function (pair, end) {
                pair[0].is_playing.should.be.true;
                end();
            };
            this.timeout(3000);
            game.play([Player, Player2], function (game, players) {
                players[0].is_playing.should.not.be.true;
                done();
            });
        })
    })

    describe('#bots', function () {
        it('should return array of bots', function () {
            var game = Game({name: 'Test'});

            game.bots().should.have.length(1);
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
