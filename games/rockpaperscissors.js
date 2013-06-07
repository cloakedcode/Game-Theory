exports.num_per_round = 2;

exports.name = "Rock, Paper, Scissors";

var _options = ["Rock", "Paper", "Scissors"];
var _players = new Array;

exports.play = function (players, callback) {
    _players = players;
    for (var i=0; i<players.length; i++) {
        players[i].ask_for_choice({msg: "Choose your weapon!", choices: _options}
                , function (player, choice) {
                    player.weapon = choice;
        });
        setTimeout(countdown(players[i], 3, callback), 50000);
    }

}

function countdown(player, seconds, callback) {
    if (seconds >= 0) {
        player.set_status("You have " + seconds + " to choose...");
        setTimeout(countdown(player, seconds -1, callback), 1000);
    }

    player.set_status("You have lost!");

    callback();
}
