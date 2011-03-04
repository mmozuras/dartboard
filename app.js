var express = require('express@1.0.7'),    
    jade = require('jade@0.6.3'),
    mongoose = require('mongoose@1.1.2'),
    models = require('./models'),
    db,
    Player,
    app = module.exports = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.bodyDecoder());
  app.use(express.cookieDecoder());
  app.use(express.session({ secret: 'supersecret'}));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[1m:status\x1b[0m :response-time ms' }))
  app.use(express.methodOverride());
  app.use(express.staticProvider(__dirname + '/public'));
});

app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

app.configure('development', function() {
  app.set('db-uri', 'mongodb://localhost/dartboard-development');
  app.use(express.errorHandler({ dumpExceptions: true }));
});

models.defineModels(mongoose, function(){
    app.Player = Player = mongoose.model('Player');
    db = mongoose.connect(app.set('db-uri'));
});

app.get('/404', function(req, res) {
    throw new NotFound;
});

app.get('/', function(req, res){
    res.render('index.jade');
});

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

if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}
