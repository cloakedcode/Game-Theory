var BOT_PATH = process.env.BOT_PATH || __dirname + '/../games/nodeunit_mock_game/bots/bot.js'
, fs = require('fs')

describe('Bot', function () {
    var bot;

    before(function (done) {
        var dest = __dirname + '/../games/nodeunit_mock_game';
        fs.exists(dest, function (exists) {
            if (exists) {
                return done();
            }

            fs.mkdir(dest, function () {
                fs.mkdirSync(dest + '/bots');

                var bot = fs.createWriteStream(dest + '/bots/bot.js');
                bot.on('finish', done);
                fs.createReadStream(__dirname + '/mock_game/bots/bot.js').pipe(bot);
            })
        })
    })

    after(function (done) {
        var dir = __dirname + '/../games/nodeunit_mock_game';
        fs.unlinkSync(dir + '/bots/bot.js');
        fs.rmdirSync(dir + '/bots');
        fs.rmdir(dir, done);
    })

    describe('#exports', function () {
        it('should export a Bot property', function () {
            //var f = require('./bot.js');
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

    describe('#round ended', function () {
        it('should have a round_ended function', function () {
            bot.should.have.property('round_ended');
            bot.round_ended.should.be.instanceOf(Function);
        })
    })

    describe('#ask for choice', function () {
        it('should have a ask_for_choice function', function () {
            bot.should.have.property('ask_for_choice');
            bot.ask_for_choice.should.be.instanceOf(Function);
        })
    })
})
