var Game = require(__dirname + '/../src/game.js')

describe('Game', function () {
    describe('#create', function () {
        it('should create game', function () {
            var game = Game.game_named('Test');
            game.should.exist;
            game.should.have.property('display_name', 'Test');
        })
    })

    describe('#launch_game', function () {
        it('should mark players as playing', function (done) {
            var Player = {is_playing: false, set_status: function () {}, round_ended: function () {}};
            var Player2 = {is_playing: false, set_status: function () {}, round_ended: function () {}};

            var game = Game.game_named('Test');
            game.play = function (pair, end) {
                pair[0].is_playing.should.be.true;
                end();
            };
            this.timeout(3000);
            game.launch_game([Player, Player2], function (game, players) {
                players[0].is_playing.should.not.be.true;
                done();
            });
        })
    })

    describe('#bots', function () {
        it('should return array of bots', function () {
            var game = Game.game_named('Test');

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
