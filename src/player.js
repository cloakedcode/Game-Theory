// each person connected is represented by a Player object
function Player(socket) {
    this.socket = socket;
    this.opponent = null;
    this.lobby = null;

    this.set_status = function (msg) {
        this.socket.emit('status', msg);
    };

    this.set_lobby = function (lobby) {
        this.lobby = lobby;
        this.set_status("You have joined the game lobby.");
    };

    this.has_opponent = function () {
        return (this.opponent != null);
    };
};

module.exports = exports = function (socket) { return new Player(socket) }
