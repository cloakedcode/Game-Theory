exports.num_per_round = 2;

exports.name = "Rock, Paper, Scissors";

var _options = ["Rock", "Paper", "Scissors"];
var _players = new Array;
var _end_callback = null;

exports.play = function (players, callback) {
    _end_callback = callback;
    _players = players;

    _players[0].opponent = _players[1];
    _players[1].opponent = _players[0];

    for (var i=0; i<players.length; i++) {
        countdown(players[i], 3);
        players[i].ask_for_choice({msg: "Choose your weapon!", choices: _options}
                , function (player, choice) {
                    if (_options.indexOf(choice) >= 0) {
                        player.weapon = choice;
                    }
                });
    }
}

function countdown(player, seconds) {
    if (seconds >= 0) {
        player.set_status("You have " + seconds + " seconds to choose...");
        setTimeout(countdown, 1000, player, seconds -1);
    } else {
        game_over();
    }
}

function game_over() {
    winner = null;
    loser = null;

    if (beats(_players[0].weapon, _players[1].weapon)) {
        _players[0].set_status("You won!");
        _players[1].set_status("You lost!");
    } else if (beats(_players[1].weapon, _players[0].weapon)){
        _players[1].set_status("You won!");
        _players[0].set_status("You lost!");
    } else {
        _players[1].set_status("You tied!");
        _players[0].set_status("You tied!");
    }

    _end_callback();
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
