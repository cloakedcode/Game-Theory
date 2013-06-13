var fs = require('fs')

exports.setUp = function (callback) {
    //fs.writeFileSync(__dirname + '/../games/nodeunit_test_game.js', "module.exports = exports = {name: 'Test', play: function (pair, callback) {setTimeout(callback, 3000)}, num_per_round: 2}");
    
    callback();
}

exports.tearDown = function (callback) {
    //fs.unlinkSync(__dirname + '/../games/nodeunit_test_game.js');

    callback();
}
