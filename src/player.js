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

    self.round_ended = function () {
        if (self.socket)
            self.socket.emit('round_ended');
    }

    self.ask_for_choice = function (options, callback) {
        if (self.socket) {
            self.callback = callback;
            self.socket.on('choice', self._callback);

            self.socket.emit('choice', options);
        }
    }

    self.game_form = function (form, callback) {
        if (self.socket) {
            self._game_callback = callback;
            self.socket.on('game_form', self._game_form_callback);
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
}

module.exports = exports = function (socket) { return new Player(socket) }
