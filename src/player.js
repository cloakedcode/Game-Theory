// each person connected is represented by a Player object
function Player(socket) {
    var self = this;
    self.socket = socket;
    self.lobby = null;
    self.callback = null;

    self.hash = '';
    self.username = '';

    self.set_status = function (msg) {
        self.socket.emit('status', msg);
    };

    self.ask_for_choice = function (options, callback) {
        self.callback = callback;
        self.socket.on('choice', self._callback);
        self.socket.emit('choice', options);
    };

    self._callback = function () {
        self.callback(self, arguments[0]);
    }

    self.set_lobby = function (lobby) {
        self.lobby = lobby;
        self.set_status("You have joined the game lobby.");
    };
};

module.exports = exports = function (socket) { return new Player(socket) }
