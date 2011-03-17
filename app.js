var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    jade = require('jade'),
    mongoose = require('mongoose');

global._ = require('underscore');
global.app = module.exports = express.createServer();


app.configure(function() {
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'supersecret' }));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[1m:status\x1b[0m :response-time ms' }));
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'jade');
});

app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

app.configure('development', function() {
  app.set('db-uri', 'mongodb://localhost/dartboard-development');
  app.use(express.errorHandler({ dumpExceptions: true }));
});

app.configure('production', function() {
  app.set('db-uri', 'mongodb://localhost/dartboard-production');
});

var db = mongoose.connect(app.set('db-uri'));
autoload(db, path.join(__dirname, 'models'));
var User = mongoose.model('User');

function authenticateFromToken(req, res, next) {
  var cookie = JSON.parse(req.cookies.authenticationtoken);

  AuthenticationToken.findOne({ username: cookie.username,
                                series: cookie.series,
                                token: cookie.token }, (function(err, token) {
    if (!token) {
      res.redirect('/users/login');
      return;
    }

    User.findOne({ username: token.username }, function(err, user) {
      if (user) {
        req.session.user_id = user.id;
        req.currentUser = user;

        token.token = token.random();
        token.save(function() {
          res.cookie('authenticationtoken', token.cookie, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          next();
        });
      } else {
        res.redirect('/users/login');
      }
    });
  }));
}

global.authenticate = function authenticate(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/users/login');
      }
    });
  } else if (req.cookies.authenticationtoken) {
    authenticateFromToken(req, res, next);
  } else {
    res.redirect('/users/login');
  }
};

autoload(db, path.join(__dirname, 'controllers'));

function autoload(db, folder) {
  var files = fs.readdirSync(folder).filter(function(file) { 
    return path.extname(file) == '.js';
  });

  var names = _.map(files, function(file) {
      return path.basename(file);
  });

  _.each(names, function(name) {
    require(folder + '/' + name);
  });
}

if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}
