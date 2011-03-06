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
