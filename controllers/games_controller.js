var mongoose = require('mongoose');
var Game = mongoose.model('Game');

app.get('/games/new', function(req, res){
    res.render('games/new.jade');
});
