var Game = require('src/game.js').Game;
// @TODO: make socket.io listen to express server
exports.listen = function (app) {
    var io = require('socket.io').listen(app)

    // main socket handling functions
    io.of('/game')
      .on('connection', function (socket) {
          console.log('connected');
          new_player(socket);

          socket.on('disconnect', function() {
              console.log('disconnected');
              delete_player(socket);
          });
          /*
          //socket.set('nickname', names[Math.floor(Math.random() * names.length)]);
          socket.on('send', function (data) {
              socket.get('nickname', function (err, name) {
                  msg = {'nickname' : name, 'data': data};
                  log.push(msg);
                  console.log(msg);
                  chat.emit('message', msg);
              });
          });
          */
      });

    return new GameServer();
}

function GameServer() {
    this.lobbies = new Array();

    this.create_lobby = function (game_name) {
        console.log('created lobby with game: ' + game_name);
        this.lobbies.push(new Game({name: game_name}));
    }
};

// the array of players that are connected
var players = new Array();

// each person connected is represented by a Player object
function Player(socket) {
    this.socket = socket;
    this.opponent = null;

    this.set_status = function (msg) {
        this.socket.emit('status', msg);
    };

    this.has_opponent = function () {
        return (this.opponent != null);
    };
};

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

function new_player(socket) {
    // if this socket is already in the player array,
    // don't create another player for it.
    for (i in players) {
        if (players[i].socket == socket) {
            return;
        }
    }

    var noob = new Player(socket);

    noob.set_status('Connecting...');

    players.push(noob);

    noob.set_status('Pairing you with another player...');
    pair_player(noob, players);
}

function delete_player(socket) {
    // if this socket is in the player array,
    // remove it
    for (i in players) {
        if (players[i].socket == socket) {
            noob = players[i];

            players.splice(i, 1);

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

