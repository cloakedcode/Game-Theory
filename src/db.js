var sqlite3 = require('sqlite3').verbose();
var db_name = (process.env.NODE_ENV == 'test') ? ':memory:' : 'db.sqlite';
var db = db(new sqlite3.Database(db_name));

function db(conn) {
    conn.serialize(function () {
        conn.run('CREATE TABLE IF NOT EXISTS players (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(128))');
        conn.run('CREATE TABLE IF NOT EXISTS rounds (id INTEGER PRIMARY KEY AUTOINCREMENT, victor INTEGER, game INTEGER, FOREIGN KEY (victor) REFERENCES players (id), FOREIGN KEY (game) REFERENCES games (id))');
        conn.run('CREATE TABLE IF NOT EXISTS choices (id INTEGER PRIMARY KEY AUTOINCREMENT, option VARCHAR(128), player INTEGER, round INTEGER, FOREIGN KEY (player) REFERENCES players (id), FOREIGN KEY (round) REFERENCES rounds (id))');
        conn.run('CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, date_played DATETIME, game_type INTEGER, FOREIGN KEY (game_type) REFERENCES game_types (id))');
        conn.run('CREATE TABLE IF NOT EXISTS game_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(128), num_of_players INTEGER)');
    });

    return conn;
}   

exports.db = db;

// expects choices to be [{player: player, choice: str}]
exports.save_round = function (victor, game, choices, callback) {
    if (game == null || choices == null) {
        throw "#db save_round cannot be called with null game or choices";
    }

    db.serialize(function () {
        game_id(game, function (game_id) {
            player_id(victor, function (p_id) {
                db.run('INSERT INTO rounds (victor, game) VALUES (?, ?)', p_id, game_id, function (err) {
                    if (err) {
                        throw err;
                    }

                    var round_id = this.lastID;

                    function _save_choices(selections, round_id, callback) {
                        if (choices.length > 0) {
                            var selection = selections.pop();
                            player_id(selection.player, function (id) {
                                db.run('INSERT INTO choices (option, player, round) VALUES (?, ?, ?)', selection.choice, id, round_id, function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                    
                                    _save_choices(selections, round_id, callback);
                                })
                            })
                        } else {
                            if (callback) {
                                return callback();
                            }
                        }
                    }

                    _save_choices(choices, round_id, callback);
                })
            })
        })
    })
}

function player_id(player, callback) {
    // @TODO: validate player has required fields
    if (player == undefined || player.hasOwnProperty('username') == false) {
        return player_id({username: 'Tied'}, callback);
    }

    db.get('SELECT id FROM players WHERE username = ?', player.username, function (err, row) {
        var player_id = row;

        if (player_id == undefined) {
            db.run('INSERT INTO players (username) VALUES (?)', player.username, function (err) {
                if (err) {
                    throw err;
                }

                callback(this.lastID);
            });
        } else {
            callback(player_id.id);
        }
    })
}

function game_id(game, callback) {
    game_type_id(game, function (game_type_id) {
        db.get('SELECT id FROM games WHERE game_type = ? AND date_played = ?', game_type_id, GAME_START_TIME, function (err, row) {
            var game_id = row;

            if (game_id == undefined) {
                db.run('INSERT INTO games (game_type, date_played) VALUES (?, ?)', game_type_id, GAME_START_TIME, function (err) {
                    if (err) {
                        throw err;
                    }

                    callback(this.lastID);
                });
            } else {
                callback(game_id.id);
            }
        })
    })
}

function game_type_id(game, callback) {
    // @TODO: validate game has required fields
    db.get('SELECT id FROM game_types WHERE name = ? AND num_of_players = ?', game.display_name, game.num_per_round, function (err, row) {
        var type_id = row;

        if (type_id == undefined) {
            db.run('INSERT INTO game_types (name, num_of_players) VALUES (?, ?)', game.display_name, game.num_per_round, function (err) {
                if (err) {
                    throw err;
                }

                callback(this.lastID);
            });
        } else {
            callback(type_id.id);
        }
    })
}
