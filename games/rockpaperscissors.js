exports.num_per_round = 2;

exports.name = "Rock, Paper, Scissors";

exports.play = function (players, callback) {
    setTimeout(function () { callback(players) }, 500);
}
