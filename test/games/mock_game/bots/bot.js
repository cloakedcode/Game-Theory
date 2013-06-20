var Bot = {};

Bot.username = 'test-bot';

Bot.is_connected = function () {
    return true;
}

Bot.set_status = function (msg) {
    console.log('Bot: ' + msg);
}

Bot.log_message = function () {
}

Bot.round_ended = function () {
}

Bot.set_lobby = function () {
}

exports.Bot = Bot;
