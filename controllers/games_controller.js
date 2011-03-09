var mongoose = require('mongoose'),
    DartsGame = mongoose.model('DartsGame'),
    Player = mongoose.model('Player');

app.get('/games/new', function(req, res) {
    Player.find({}, function(err, players) {
      res.render('games/new.jade', {
        locals: { players: players }
      });
    });
});

app.post('/games/new', function(req, res) {
    var selectedPlayers = req.body.players;
    var dartsGame = new DartsGame();
    dartsGame.setPlayers(selectedPlayers);

    dartsGame.save(function(err) {
      res.redirect('/games/' + dartsGame.id);
    });
});

app.get('/games/:id', function(req, res) {
    DartsGame.findById(req.params.id, function(err, game) {
      res.render('games/darts_game.jade', {
        locals: { game: game }
      });
    });
});

app.post('/games/:id', function(req, res) {
    DartsGame.findById(req.params.id, function(err, game) {
      game.parseThrow(req.body.score);
      game.save(function(err) {
        res.send('Success');
      });
    });
});
