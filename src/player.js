// each person connected is represented by a Player object
function Player(socket) {
    var self = this;
    self.socket = socket;
    self.lobby = null;
    self.is_playing = false;
    self.callback = null;

    self.hash = '';
    self.username = '';

    self.set_status = function (msg) {
        self.socket.emit('status', msg);
    }

    self.round_ended = function () {
        self.socket.emit('round_ended');
    }

    self.ask_for_choice = function (options, callback) {
        self.callback = callback;
        self.socket.on('choice', self._callback);

        self.socket.emit('choice', options);
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
