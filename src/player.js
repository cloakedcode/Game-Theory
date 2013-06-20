// each person connected is represented by a Player object
function Player(socket) {
    var self = this;
    self.socket = socket;
    self.lobby = null;
    self.is_playing = false;
    self.callback = null;
    self._game_callback = null;

    self.hash = '';
    self.username = '';

    self.set_status = function (msg) {
        if (self.socket)
            self.socket.emit('status', msg);
    }

    self.log_message = function (msg) {
        if (self.socket)
            self.socket.emit('log', msg);
    }

    self.round_ended = function () {
        if (self.socket)
            self.socket.emit('round_ended');
    }

    self.game_form = function (form, callback) {
        if (self.socket) {
            self._game_callback = callback;
            self.socket.emit('game_form', form);
        }
    }

    self._game_form_callback = function (data, callback) {
        self._game_callback(data, self, callback);
    }

    self._callback = function () {
        self.callback(self, arguments[0]);
    }

    self.set_lobby = function (lobby) {
        self.lobby = lobby;
    }

    self.is_connected = function () {
        return self.socket != undefined && self.socket != null;
    }

    if (socket) {
        self.socket.on('game_form', self._game_form_callback);
    }
}

module.exports = exports = function (socket) { return new Player(socket) }
