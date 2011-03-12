var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

User = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  hashedPassword: { type: String, required: true },
  salt: String
});

User.virtual('password')
  .set(function(password) {
    if (password.length > 0)
    {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashedPassword = this.encryptPassword(password);
    }
  })
  .get(function() { return this._password; });

User.method('authenticate', function(plainText) {
  return this.encryptPassword(plainText) === this.hashedPassword;
});

User.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
});

User.method('encryptPassword', function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

mongoose.model('User', User);
