var Game = require('src/game.js')
    , Lobby = require('src/lobby.js')
    , Player = require('src/player.js')
    , crypto = require('crypto')
    , ldap = require('ldapjs')
    , Log = require('src/logger.js')

var salt = 'long_salty string that NOONE will ever guess';
var ldapclient = ldap.createClient({
    url: 'ldaps://gc.goshen.edu:636',
    bindDN: 'dc="gc",dc="goshen",dc="edu"',
    maxConnections: 1
});
var logger = new Log;

exports.listen = function (app) {
    return new GameServer().listen(app);
}

function GameServer() {
    // the array of players that are connected
    var self = this;
    self.lobbies = new Array();
    self.players = new Array();

    self.listen = function (app) {
        self.io = require('socket.io').listen(app)

        self.io.set('log level', 2);
        // main socket handling functions
        self.io.of('/game').on('connection', self.player_joined);
        return self;
    }

    self.create_lobby = function (game_name) {
        logger.info('created lobby with game: ' + game_name);

        game = Game({name: game_name});
        lobby = Lobby(game);

        self.lobbies.push(lobby);
        self.put_players_in_lobby(lobby);
    }

    self.start_lobby = function (game_name) {
        for (var i=0; i<self.lobbies.length; i++) {
            if (self.lobbies[i].game.name == game_name && self.lobbies[i].is_running == false) {
                return self.lobbies[i].run_game();
            }
        }
    }

    self.stop_lobby = function (game_name) {
        for (var i=0; i<self.lobbies.length; i++) {
            if (self.lobbies[i].game.name == game_name && self.lobbies[i].is_running) {
                return self.lobbies[i].end_game();
            }
        }
    }

    self.player_joined = function (socket) {
        logger.info('player joined');

        socket.on('disconnect', self.player_disconnected);
        socket.on('authenticate', self.authenticate_user);
        socket.on('check_cookie', self.check_cookie);
    }

    self.authenticate_user = function (data, callback) {
        var socket = this;
        var hash = crypto.createHash('md5').update(data.username + salt).digest("hex");

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

    self.check_cookie = function (hash, callback) {
        var socket = this;
        var found = false;
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

        callback(found);
    }

    self.player_disconnected = function (socket) {
        // if this socket is in the player array, remove it
        for (i in self.players) {
            if (self.players[i].socket == socket) {
                var noob = self.players[i];

                self.players.splice(i, 1);
                noob.lobby.remove_player(noob);
                noob.set_status('You disconnected. Reload the page.');

                delete noob;

                noob.socket = null;

                return;
            }
        }
    }

    self.put_players_in_lobby = function (lobby) {
        for (i in self.players) {
            if (self.players[i].lobby == null) {
                lobby.add_player(self.players[i]);
            }
        }
    }
};
