var mongoose = require('mongoose'),
    DartsGame = mongoose.model('DartsGame'),
    Player = mongoose.model('Player');

app.get('/games', function(req, res) {
    DartsGame.find({}, function(err, games) {
        res.render('games/index.jade', {
          locals: { games: games}
        });
    });
});

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

app.del('/games/:id', function(req, res) {
    DartsGame.findById(req.params.id, function(err, game) {
      game.remove();
      req.flash('info', 'Game was succesfully canceled');
      res.redirect('games');
    });
});

app.post('/games/:id/undoThrow', function(req, res) {
    DartsGame.findById(req.params.id, function(err, game) {
      game.undoThrow();
      game.save(function(err) {
        res.redirect('/games/' + req.params.id);
      });
    });
});
