Player = require(__dirname + '/../../../src/player.js');

Bot = Player();

Bot.username = "Paper bot";

Bot.is_connected = function () {
    return true;
}

Bot.set_status = function (msg) {
    console.log('Bot: ' + msg);
}

Bot.round_ended = function () {
}

Bot.game_form = function (form, callback) {
    callback({weapon: 'Paper'}, this, function () {});
}

exports.Bot = Bot;
