module.exports = exports = function (socket) { return new Player(socket) }
exports.Player = Player;

// each person connected is represented by a Player object
function Player(socket) {
    this.socket = socket;
    this.lobby = null;
    this.is_playing = false;
    this.callback = null;
    this._game_callback = null;

    this.hash = '';
    this.username = '';

    if (socket) {
        socket.on('game_form', this._game_form_callback.bind(this));
    }
}

Player.prototype.set_status = function (msg) {
    if (this.socket)
        this.socket.emit('status', msg);
}

Player.prototype.log_message = function (msg) {
    if (this.socket)
        this.socket.emit('log', msg);
}

Player.prototype.round_ended = function () {
    if (this.socket)
        this.socket.emit('round_ended');
}

Player.prototype.game_form = function (form, callback) {
    if (this.socket) {
        this._game_callback = callback;
        this.socket.emit('game_form', form);
    }
}

Player.prototype._game_form_callback = function (data, callback) {
    this._game_callback(data, this, callback);
}

Player.prototype._callback = function () {
    this.callback(this, arguments[0]);
}

Player.prototype.set_lobby = function (lobby) {
    this.lobby = lobby;
}

Player.prototype.is_connected = function () {
    return this.socket != undefined && this.socket != null;
}
