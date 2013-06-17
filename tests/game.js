var Game = require(__dirname + '/../src/game.js')
, fs = require('fs')

exports.setUp = function (callback) {
    dest = __dirname + '/../games/nodeunit_mock_game';
    fs.exists(dest, function (exists) {
        if (exists) {
            fs.mkdir(dest, function () {
                config = fs.createWriteStream(dest + '/config.json');
                config.on('finish', function () {
                    stream = fs.createWriteStream(dest + '/game.js');
                    stream.on('finish', function () {
                        console.log('created temp dir');
                        callback();
                    });
                    fs.createReadStream(__dirname + '/mock_game/game.js').pipe(stream);
                });
                fs.createReadStream(__dirname + '/mock_game/config.json').pipe(config);
            })
        }
    })
}

exports.tearDown = function (callback) {
    dir = __dirname + '/../games/nodeunit_mock_game';
    fs.unlink(dir + '/config.json', function () {
        fs.unlink(dir + '/game.js', function () {
            console.log('removed temp dir');
            fs.rmdir(dir, callback);
        })
    })
}

exports.create_game = function (test) {
    test.expect(3);

    test.throws(function () {Game()}, 'Did not throw error when created with no Game name.');
    test.throws(function () {Game({name: 'sdflksjdf'})}, 'Did not throw error when created with invalid Game name.');

    game = Game({name: 'Test'});
    test.ok(game != undefined && game.name == 'Test', 'Did not create Game with vaild name.');

    test.done();
}

exports.play = function (test) {
    test.expect(1);

    Player = {is_playing: false, set_status: function () {}, round_ended: function () {}};

    game = Game({name: 'Test'});
    game.play([Player, Player], function (game) {
        test.expect(2);

        test.ok(game.name == 'Test', 'Did not pass correct game to end_game callback.');
        test.ok(Player.is_playing == false, 'Players not marked as not playing.');
    });

    test.ok(Player.is_playing, 'Players not marked as playing.');
    test.done();
}

exports.available_games = function (test) {
    test.expect(1);
        
    Game.available_games(function (games) {
        test.ok(games.length > 0, 'Could not get list of Games.');
        
        test.done();
    });
}

exports.exists = function (test) {
    test.expect(2);

    Game.exists('Test', function (exists) {
        test.ok(exists, 'Valid game reported as non-existent.');
    });
    Game.exists('sdlfkasjfd', function (exists) {
        test.ifError(exists, 'Invalid game reported as existent.');
        
        test.done();
    });
}
