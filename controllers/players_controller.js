var mongoose = require('mongoose'),
    Player = mongoose.model('Player');

app.get('/players', function(req, res) {
    Player.find({}, function(err, players) {
        res.render('players/index', {
          locals: { players: players }
        });
    });
});

app.post('/players', function(req, res) {
    var player = new Player(req.body.player);
    
    player.save(function(err) {
      if (err) return failed(err, req, res);
      
      req.flash('info', 'Player was succesfully created');
      res.redirect('/players');
    });
});

app.del('/players/:id', function(req, res) {
    Player.findById(req.params.id, function (err, player) {
      if (err) return failed(err, req, res);
      
      player.remove();
      req.flash('info', 'Player was succesfully deleted');
      res.redirect('/players');
    });
});

function failed(err, req, res) {
  req.flash('error', err.message);
  res.redirect('/players');
}
