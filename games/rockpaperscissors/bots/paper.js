Player = require(__dirname + '/../../../src/player.js');

Bot = Player();

Bot.username = "Paper bot";

Bot.is_connected = function () {
    return true;
}

Bot.log_message = function (msg) {
    console.log(this.username + ': ' + msg);
}

Bot.game_form = function (form, callback) {
    callback({weapon: 'Paper'}, self, function () {});
}

exports.Bot = Bot;
