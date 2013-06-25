var Game = require('src/game.js')
    , Lobby = require('src/lobby.js')
    , Player = require('src/player.js')
    , crypto = require('crypto')
    , Log = require('src/logger.js')

var salt = 'long_salty string that NOONE will ever guess';
var logger = new Log;

exports.listen = function (app) {
    return new GameServer().listen(app);
}

function GameServer() {
    // the array of players that are connected
    this.lobbies = new Array();
    this.players = new Array();

    var self = this;
    this.authenticate_user = function (data, callback) {
        data.username = data.username.toLowerCase();
        var hash = crypto.createHash('md5').update(data.username + salt).digest("hex");
        var socket = this;

        logger.info('authenticating...');
        socket.emit('status', 'Authenticated');

        var noob = Player(socket);
        noob.hash = hash;
        logger.debug(hash + " joined for the first time");

        self.players.push(noob);

        noob.username = data.username;
        logger.debug(self.players.length);

        if (self.lobbies != null && self.lobbies.length > 0) {
            self.lobbies[0].add_player(noob);
        } else {
            noob.set_status('There are no games for you to join.<br>Wait for one to be created.');
        }

        return callback(true, hash);
    }

    this.check_cookie = function (hash, callback) {
        var socket = this;
        var found = false;
        logger.debug('Hash: ' + hash);
        logger.debug('Socket id: ' + socket.id);
        for (var i=0; i<self.players.length; i++) {
            var noob = self.players[i];
            if (noob.hash == hash) {
                logger.debug(noob.hash + " rejoined");
                noob.socket = socket;
                found = true;
                break
            }
        }

        if (found) {
            if (self.lobbies != null && self.lobbies.length > 0) {
                self.lobbies[0].add_player(noob);
                noob.set_status('You rejoined the game lobby.');
            } else {
                noob.set_status('There are no games for you to join.<br>Wait for one to be created.');
            }

        }

        return callback(found);
    }

    this.player_disconnected = function (socket) {
        // if this socket is in the player array, remove it
        for (i in this.players) {
            if (this.players[i].socket == socket) {
                var noob = this.players[i];

                this.players.splice(i, 1);
                noob.lobby.remove_player(noob);
                noob.set_status('You disconnected. Reload the page.');

                delete noob;

                noob.socket = null;

                return;
            }
        }
    }

}

GameServer.prototype.listen = function (app) {
    this.io = require('socket.io').listen(app);

    this.io.set('log level', 2);
    // main socket handling functions
    this.io.of('/game').on('connection', this.player_joined.bind(this));
    return this;
}

GameServer.prototype.create_lobby = function (game_name) {
    logger.info('created lobby with game: ' + game_name);

    game = Game({name: game_name});
    lobby = Lobby(game);

    this.lobbies.push(lobby);
    this.put_players_in_lobby(lobby);
}

GameServer.prototype.start_lobby = function (game_name) {
    for (var i=0; i<this.lobbies.length; i++) {
        if (this.lobbies[i].game.name == game_name && this.lobbies[i].is_running == false) {
            return this.lobbies[i].run_game();
        }
    }
}

GameServer.prototype.stop_lobby = function (game_name) {
    for (var i=0; i<this.lobbies.length; i++) {
        if (this.lobbies[i].game.name == game_name && this.lobbies[i].is_running) {
            return this.lobbies[i].end_game();
        }
    }
}

GameServer.prototype.delete_lobby = function (game_name) {
    for (var i=0; i<this.lobbies.length; i++) {
        var lobby = this.lobbies[i];

        // if it's the lobby we're looking for
        if (lobby.game.name == game_name) {
            lobby.end_game();
            // if there are players, remove them
            if (lobby.players) {
                for (var j=0; j<lobby.players.length; j++) {
                    lobby.remove_player(lobby.players[j]);
                }
            }

            return this.lobbies.splice(i, 1);
        }
    }
}

GameServer.prototype.player_joined = function (socket) {
    logger.debug('player joined');

    socket.on('disconnect', this.player_disconnected);
    socket.on('authenticate', this.authenticate_user);
    socket.on('check_cookie', this.check_cookie);
}

GameServer.prototype.put_players_in_lobby = function (lobby) {
    for (i in this.players) {
        if (this.players[i].lobby == null) {
            lobby.add_player(this.players[i]);
        }
    }
}
