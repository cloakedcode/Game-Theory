function Game() {};

exports.Game = Game;

Game.prototype.play = function (pair, callback) {
    callback(null, [{player:"none", choice: "none"}]);
}
