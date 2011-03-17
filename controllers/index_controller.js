var mongoose = require('mongoose'),
    Player = mongoose.model('Player');

app.get('/404', function(req, res) {
    res.render('404', { layout: false });
});

app.get('/', authenticate, function(req, res) {
    Player.count({ userId: req.currentUser.id }, function(err, i){
      res.render('index', {
        locals: { count: i }
      });
    });
});