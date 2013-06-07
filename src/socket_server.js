var Game = require('src/game.js')
    , Lobby = require('src/lobby.js')
    , Player = require('src/player.js')
    , crypto = require('crypto')

var salt = 'long_salty string that NOONE will ever guess';

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
        console.log('created lobby with game: ' + game_name);

        Game({name: game_name}, function (game) {
            lobby = Lobby(game);

            self.lobbies.push(lobby);
            self.put_players_in_lobby(lobby);
        });
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
        console.log('player joined');

        socket.on('disconnect', self.player_disconnected);
        socket.on('authenticate', self.authenticate_user);
    }

    self.authenticate_user = function (data) {
        hash = data.cookie || crypto.createHash('md5').update(data.username + data.password + salt).digest("hex");
        // @TODO: replace with LDAP authentication
        this.emit('authenticate', {allowed: true, cookie: hash});
        this.emit('status', 'Authenticated');

        found = false;
        for (var i=0; i<self.players.length; i++) {
            noob = self.players[i];
            if (noob.hash == hash) {
                console.log(hash + " rejoined");
                noob.socket = this;
                found = true;
                break
            }
        }

        if (found == false) {
            noob = Player(this);
            noob.hash = hash;
            console.log(hash + " joined for the first time");

            self.players.push(noob);
        }

        noob.username = data.username;
        console.log(self.players.length);

        if (self.lobbies != null && self.lobbies.length > 0) {
            self.lobbies[0].add_player(noob);
        } else {
            noob.set_status('There are no games for you to join.<br>Wait for one to be created.');
        }
    }

    self.player_disconnected = function (socket) {
        // if this socket is in the player array, remove it
        for (i in self.players) {
            if (self.players[i].socket == socket) {
                noob = self.players[i];

                /*
                self.players.splice(i, 1);
                noob.lobby.remove_player(noob);

                delete noob;
                */
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
