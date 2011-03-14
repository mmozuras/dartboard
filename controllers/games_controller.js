var mongoose = require('mongoose'),
    DartsGame = mongoose.model('DartsGame'),
    Player = mongoose.model('Player');

app.get('/games', authenticate, function(req, res) {
    DartsGame.find({ userId: req.currentUser.id }, function(err, games) {
        res.render('games/index', {
          locals: { games: games}
        });
    });
});

app.get('/games/new', authenticate, function(req, res) {
    Player.find({ userId: req.currentUser.id }, function(err, players) {
      res.render('games/new', {
        locals: { players: players }
      });
    });
});

app.post('/games/new', authenticate, function(req, res) {
    var selectedPlayers = req.body.players;
    var dartsGame = new DartsGame({ startingScore: req.body.startingScore, out: req.body.out });
    dartsGame.setPlayers(selectedPlayers);
    dartsGame.userId = req.currentUser.id;

    dartsGame.save(function(err) {
      res.redirect('/games/' + dartsGame.id);
    });
});

app.get('/games/:id', authenticate, function(req, res) {
    DartsGame.findOne({ _id: req.params.id, userId: req.currentUser.id }, function(err, game) {
      res.render('games/darts_game', {
        locals: { game: game }
      });
    });
});

app.post('/games/:id', authenticate, function(req, res) {
    DartsGame.findOne({ _id: req.params.id, userId: req.currentUser.id }, function(err, game) {
      game.parseThrow(req.body.score);
      game.save(function(err) {
        res.send('Success');
      });
    });
});

app.del('/games/:id', authenticate, function(req, res) {
    DartsGame.findOne({ _id: req.params.id, userId: req.currentUser.id }, function(err, game) {
      game.remove();
      req.flash('info', 'Game was succesfully canceled');
      res.redirect('games');
    });
});

app.post('/games/:id/undoThrow', authenticate, function(req, res) {
    DartsGame.findOne({ _id: req.params.id, userId: req.currentUser.id }, function(err, game) {
      game.undoThrow();
      game.save(function(err) {
        res.redirect('/games/' + req.params.id);
      });
    });
});
