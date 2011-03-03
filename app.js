var express = require('express@1.0.7'),
    jade = require('jade@0.6.3')
    app = module.exports = express.createServer();

app.get('/404', function(req, res) {
    throw new NotFound;
});

app.get('/', function(req, res){
    res.render('index.jade', {});
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}
