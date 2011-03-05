app.get('/404', function(req, res) {
    throw new NotFound;
});

app.get('/', function(req, res){
    res.render('index.jade');
});

