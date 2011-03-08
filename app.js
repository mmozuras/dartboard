var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    jade = require('jade'),
    mongoose = require('mongoose'),
    app = global.app = module.exports = express.createServer();

app.configure(function() {
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'supersecret' }));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m \x1b[1m:status\x1b[0m :response-time ms' }))
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
autoload(db, path.join(__dirname, 'controllers'));

function autoload(db, folder) {
  var files = fs.readdirSync(folder).filter(function(file) { 
    return path.extname(file) == '.js' 
  });

  var names = [];
  for (var f in files) {
    names.push(path.basename(files[f]));
  }

  for (var n in names) {
    require(folder + '/' + names[n])
  }
}

app.listen(3000);
console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
