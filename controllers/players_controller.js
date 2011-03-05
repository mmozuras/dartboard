var mongoose = require('mongoose');
var Player = mongoose.model('Player');

app.get('/players', function(req, res){
    Player.find({}, function(err, players){
        res.render('players/index.jade', {
          locals: {players: players}
        });
    });
});

app.post('/players', function(req, res){
    var player = new Player(req.body.player);

    function playerSaveFailed() {      
      req.flash('error', 'Player creation failed');
      res.redirect('/players');
    }

    player.save(function(err) {
      if (err) return playerSaveFailed();

      switch (req.params.format) {
        case 'json':
          res.send(player.toObject());
        break;

        default:
          req.flash('info', 'Player was succesfully created');
          res.redirect('/players');
      }
    });
});
