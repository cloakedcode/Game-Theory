Player = require(__dirname + '/../../../src/player.js').Player;

function Bot() {};
Bot.prototype.__proto__ = Player.prototype;

Bot.prototype.username = "Scissors";

Bot.prototype.is_connected = function () {
    return true;
}

Bot.prototype.log_message = function (msg) {
    console.log(this.username + ': ' + msg);
}

Bot.prototype.game_form = function (form, callback) {
    callback({weapon: this.username}, this, function () {});
}

exports.Bot = new Bot();
