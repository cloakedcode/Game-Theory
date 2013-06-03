game = require('../src/game.js');

exports.available_games = function (test) {
    game.available_games(function (games) {
        test.expect(1);
        
        console.log(games);
        test.ok(games.length > 0, 'Could not get list of games.');
        
        test.done();

    });

    test.done();
}
