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
    dartsGame.set('players', selectedPlayers);

    dartsGame.save(function(err) {
      res.redirect('/games/' + dartsGame.id);
    });
});

app.get('/games/:id', function(req, res) {
    DartsGame.findById(req.params.id, function(err, game) {
      res.render('games/game.jade', {
        locals: { game: game }
      });
    });
});
