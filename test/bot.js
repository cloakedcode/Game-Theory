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
})
