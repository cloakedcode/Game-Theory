Player = require(__dirname + '/../../../src/player.js');

Bot = Player();

Bot.username = "Scissor bot";

Bot.is_connected = function () {
    return true;
}

Bot.set_status = function (msg) {
    console.log('Bot: ' + msg);
}

Bot.round_ended = function () {
}

Bot.ask_for_choice = function (options, callback) {
    var choice = options['choices'][2];
    console.log("Bot choosing " + choice);

    callback(this, choice);
}

exports.Bot = Bot;
