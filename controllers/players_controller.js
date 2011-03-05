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
    
    Player.findOne({name: player.name}, function(err, existing){
        if (existing == null) {
          player.save(function(err) {
            if (err) return failed('creation', req, res);
      
            req.flash('info', 'Player was succesfully created');
            res.redirect('/players');
          });
        }
        else return failed('creation', req, res);
      });
});

app.del('/players/:id', function(req, res){
    Player.findById(req.params.id, function (err, player){
      if (err) return failed('deletion', req, res);
      
      player.remove();
      req.flash('info', 'Player was succesfully deleted');
      res.redirect('/players');
    });
});

function failed(action, req, res){
  req.flash('error', 'Player ' + action + ' failed');
  res.redirect('/players');
}
