var express = require("express")
    , app = express()
    , http_server = require("http").createServer(app)
    , cons = require("consolidate")
    , game = require(__dirname+'/src/game.js')
    , server = require(__dirname+'/src/socket_server.js');
var socket_server = server.listen(http_server);

app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.use('/admin.html', express.basicAuth('admin', 'pass'));

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.static('public'));

// -----------------------------------------
// Admin pages
// -----------------------------------------
app.get('/admin.html', function (req, res) {
    game.available_games(function (games) {
        var button = function () {
            return function (text, render) {
                var value = 'Start';

                if (render(text) == 'true')
                    value = 'Stop';
                return "<input type='submit' name='"+value+"' value='"+value+"' >";
            }
        }

        var param =  function () {
            return function (text, render) {
                return render("{{game." + render(text) + "}}");
            }
        }

        res.render('admin', {games: games, lobbies: socket_server.lobbies, button: button, param: param});
    });
});

app.post('/admin.html', function (req, res) {
    // if a game was chosen
    if (req.body.game != 'none') {
        game.exists(req.body.game, function (exists) {
            if (exists) {
                socket_server.create_lobby(req.body.game);
            }
        });
    }
    // if the start button was clicked
    if (req.body.Start != undefined) {
        var game_obj = socket_server.game_lobby(req.body.game_id).game;
        for (var i=0; i<game_obj.parameters.length; i++) {
            var name = game_obj.parameters[i].name;
            var success = game_obj.set_parameter(name, req.body[name]);

            if (success.success == false) {
                return res.render('admin_fail', {errors: success.errors});
            }
        }

        socket_server.start_lobby(req.body.game_id);
    }
    else if (req.body.Stop != undefined) {
        socket_server.stop_lobby(req.body.game_id);
    }
    else if (req.body.Delete != undefined) {
        console.log(req.body.game_id + " being deleted.");
        socket_server.delete_lobby(req.body.game_id);
    }

    console.log(socket_server.lobbies.length);
    res.redirect('/admin.html');
});

// -----------------------------------------
// Player pages
// -----------------------------------------
app.get('/', function (req, res) {
    res.render('index');
});

http_server.listen(9000);
console.log("Listening on port 9000...");
