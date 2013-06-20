Player = require(__dirname + '/../../../src/player.js');

Bot = Player();

Bot.username = "Rock bot";

Bot.is_connected = function () {
    return true;
}

Bot.log_message = function (msg) {
    console.log(this.username + ': ' + msg);
}

Bot.round_ended = function () {
}

Bot.game_form = function (form, callback) {
    callback({weapon: 'Rock'}, self, function () {});
}

exports.Bot = Bot;
