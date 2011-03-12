require('./app');

if (!module.parent) {
  app.listen(80);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}
