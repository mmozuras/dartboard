var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');

app.get('/games/new', function(req, res){
    Player.find({}, function(err, players){
      res.render('games/new.jade', {
        locals: {players: players}
      });
    });
});
