var BOT_PATH = process.env.BOT_PATH || __dirname + '/games/mock_game/bots/bot.js'
, fs = require('fs')

describe('Bot', function () {
    var bot;

    describe('#exports', function () {
        it('should export a Bot property', function () {
            var f = require(BOT_PATH);
            
            f.should.have.property('Bot');

            bot = f.Bot;
        })
    })

    describe('#is connected', function () {
        it('should have a is_connected function', function () {
            bot.should.have.property('is_connected');
            bot.is_connected.should.be.instanceOf(Function);
        })

        it('should be always connected', function () {
            bot.is_connected().should.be.true;
        })
    })

    describe('#set status', function () {
        it('should have a set_status function', function () {
            bot.should.have.property('set_status');
            bot.set_status.should.be.instanceOf(Function);
        })
    })

    describe('#log message', function () {
        it('should have a log_message function', function () {
            bot.should.have.property('log_message');
            bot.log_message.should.be.instanceOf(Function);
        })
    })

    describe('#set lobby', function () {
        it('should have a set_lobby function', function () {
            bot.should.have.property('set_lobby');
            bot.set_lobby.should.be.instanceOf(Function);
        })
    })

    describe('#round ended', function () {
        it('should have a round_ended function', function () {
            bot.should.have.property('round_ended');
            bot.round_ended.should.be.instanceOf(Function);
        })
    })

    describe('#username', function () {
        it('should have a string property username', function () {
            bot.should.have.property('username');
            bot.username.should.be.a('string');
        })
    })
})
