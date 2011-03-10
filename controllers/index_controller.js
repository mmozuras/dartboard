app.get('/404', function(req, res) {
    res.render('404.jade', { layout: false });
});

app.get('/', function(req, res) {
    res.redirect('/players');
});
