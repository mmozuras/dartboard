var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    AuthenticationToken = mongoose.model('AuthenticationToken');

app.post('/users/register', function(req, res) {
  function userSaveFailed() {
    req.flash('error', 'Account creation failed');
    res.redirect('/users/login');
  }
  
  var user = new User(req.body.user);

  if (user.password != req.body.confirmPassword) return userSaveFailed();

  user.save(function(err) {
    if (err) return userSaveFailed();

    req.session.user_id = user.id;
    res.redirect('/');
  });
});

app.get('/users/login', function(req, res) {
  res.render('users/login', {
    layout: false,
    locals: { user: new User() }
  });
});

app.post('/users/login', function(req, res) {
  User.findOne({ username: req.body.user.username }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;

      if (req.body.remember_me) {
        var authenticationToken = new AuthenticationToken({ email: user.email });
        authenticationToken.save(function() {
          res.cookie('authenticationtoken', authenticationToken.cookie, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
        });
      }

      res.redirect('/');
    } else {
      req.flash('error', 'Incorrect credentials');
      res.redirect('/users/login');
    }
  }); 
});

app.get('/users/logout', authenticate, function(req, res) {
  if (req.session) {
    AuthenticationToken.remove({ email: req.currentUser.email }, function() {});
    res.clearCookie('authenticationtoken');
    req.session.destroy(function() {});
  }
  res.redirect('/users/login');
});
