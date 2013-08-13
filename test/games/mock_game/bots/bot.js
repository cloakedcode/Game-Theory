function Bot() {
    this.username = 'test-bot';
}

Bot.prototype.is_connected = function () {
    return true;
}

Bot.prototype.set_status = function (msg) {
    console.log('Bot: ' + msg);
}

exports.Bot = Bot;
