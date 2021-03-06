var db = require(__dirname + '/../src/db.js')
    , fs = require('fs')
    , Game = require(__dirname + '/../src/game.js')

describe('db', function () {
    describe('#save round', function () {
        it('should save the victor and player choices', function (done) {
            this.timeout(5000);

            db.save_round({username: 'Jane'}, Game.game_named('Test'), [{
                player: {username: 'John'},
                choice: "Hammer"
            },
            {
                player: {username: 'Jane'},
                choice: "Cutless"
            }], done)
        })
    })
})
