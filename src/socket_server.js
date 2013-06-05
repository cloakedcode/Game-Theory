var Game = require('src/game.js')
    , Lobby = require('src/lobby.js')
    , Player = require('src/player.js')

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

    self.player_joined = function (socket) {
        console.log('player joined');

        socket.on('disconnect', self.player_disconnected);

        var noob = Player(socket);

        noob.set_status('Connecting...');
        self.players.push(noob);

        if (self.lobbies != null && self.lobbies.length > 0) {
            self.lobbies[0].add_player(noob);
        } else {
            noob.set_status('There are no games for you to join.<br>Wait for one to be created.');
        }
    };

    self.player_disconnected = function (socket) {
        // if this socket is in the player array,
        // remove it
        for (i in self.players) {
            if (self.players[i].socket == socket) {
                noob = self.players[i];

                self.players.splice(i, 1);

                if (noob.has_opponent()) {
                    var other_guy = noob.opponent;
                    other_guy.set_status('Your opponent has disconnected.');
                    other_guy.opponent = null;

                    pair_player(other_guy);
                }

                delete noob;

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

// the array of players that are connected
var players = new Array();


// pairs players up to each other for playing the game
function pair_player(noob) {
    for (i in players) {
        if (players[i] == noob) {
            continue;
        }

        if (players[i].has_opponent() == false) {
            players[i].opponent = noob;
            noob.opponent = players[i];

            noob.set_status("You've been paired with an opponent.");
            players[i].set_status("You've been paired with an opponent.");
        }
    }

    return noob.has_opponent();
};
