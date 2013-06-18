var Bot = {};

Bot.is_connected = function () {
    return true;
}

Bot.set_status = function (msg) {
    console.log('Bot: ' + msg);
}

Bot.ask_for_choice = function (options) {
}

Bot.round_ended = function () {
}

exports.Bot = Bot;
