require("./underscore");

var path = require('path'),
    application_root = __dirname,
    Server = { paths : { models : path.join(application_root, 'models'), controllers : path.join(application_root, 'controllers') } },
    express = require('express@1.0.7'),
    jade = require('jade@0.6.3'),
    mongoose = require('mongoose@1.1.2'),
    db,
    app = module.exports = express.createServer();

global.Server = Server;
global.app = app;

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.bodyDecoder());
  app.use(express.cookieDecoder());
  app.use(express.session({ secret: 'supersecret' }));
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

db = mongoose.connect(app.set('db-uri'));

autoload(db, Server.paths.models);
autoload(db, Server.paths.controllers);

module.exports = Server.controllers = {};

if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}

function autoload(db, folder){
  var fs = require("fs"),
      files = fs.readdirSync(folder).filter(function(file){ return path.extname(file) == ".js" } ),
      names = _.map(files,function(f){
        return( path.basename(f) );
      });
  _.each(names,function(controller){ require( folder + "/" + controller )});
}
