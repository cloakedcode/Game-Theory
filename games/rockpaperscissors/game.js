var _options = ["Rock", "Paper", "Scissors"];
var _form = '<h3>Fist Selection</h3><form>';

for (op in _options) {
    _form += "<input type='radio' value='"+_options[op]+"' name='weapon' onclick='$(\"#form form\").submit()'>"+_options[op];
}

_form += "</form>";

exports.play = function (players, callback, db) {
    console.log(players[0].username + " and " + players[1].username + " are playing.");
    for (var i=0; i<players.length; i++) {
        players[i].send_msg = function (msg) { this.set_status(msg); this.log_message(msg); };
        players[i].game_form(_form, function (data, player, callback) {
            if (data.hasOwnProperty('weapon') && _options.indexOf(data.weapon) >= 0) {
                player.weapon = data.weapon;
                player.log_message("You chose " + data.weapon);
            } else {
                callback("alert(\"That's not a real move.\")");
            }
        });
    }
    countdown(players, 5, callback);
}

function countdown(players, seconds, callback) {
    if (seconds >= 0) {
        players[0].set_status("You have " + seconds + " seconds to choose...");
        players[1].set_status("You have " + seconds + " seconds to choose...");

        setTimeout(countdown, 1000, players, seconds -1, callback);
    } else {
        game_over(players, callback);
    }
}

function game_over(players, callback) {
    var winner = null;

    if (beats(players[0].weapon, players[1].weapon)) {
        players[0].send_msg("You won!");
        players[1].send_msg("You lost!");
        winner = players[0];
    } else if (beats(players[1].weapon, players[0].weapon)){
        players[0].send_msg("You lost!");
        players[1].send_msg("You won!");
        winner = players[1];
    } else {
        players[0].send_msg("You tied!");
        players[1].send_msg("You tied!");
    }

    callback(winner, [{player: players[0], choice: players[0].weapon}, {player: players[1], choice: players[1].weapon}]);
}

function beats(first_weapon, second_weapon) {
    switch (first_weapon) {
        case "Rock":
            if (second_weapon == "Scissors")
                return true;
            break;
        case "Paper":
            if (second_weapon == "Rock")
                return true;
            break;
        case "Scissors":
            if (second_weapon == "Paper")
                return true;
            break;
    }

    return false;
}
