var express = require("express"),
    cons = require("consolidate"),
    game = require(__dirname+'/src/game.js'),
    server = require(__dirname+'/src/socket_server.js');
var app = express();
var socket_server = server.listen(app);

app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.use('/admin.html', express.basicAuth('admin', 'pass'));

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.static('public'));

app.get('/admin.html', function (req, res) {
    game.available_games(function (games) {
        res.render('admin', {games: games});
    });
});

app.post('/admin.html', function (req, res) {
    game.available_games(function (games) {
        game.exists(req.body.game, function (exists) {
            if (exists) {
                socket_server.create_lobby(req.body.game);
            }
        });
    });
});

app.listen(9000);
console.log("Listening on port 9000...");
