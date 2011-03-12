var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

AuthenticationToken = new Schema({
  username: { type: String, index: true },
  series: { type: String, index: true },
  token: { type: String, index: true }
});

AuthenticationToken.method('random', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

AuthenticationToken.pre('save', function(next) {
  this.token = this.randomToken();

  if (this.isNew) this.series = this.randomToken();

  next();
});

AuthenticationToken.virtual('cookie')
  .get(function() {
    return JSON.stringify({ email: this.email, token: this.token, series: this.series });
  });

mongoose.model('AuthenticationToken', AuthenticationToken);
