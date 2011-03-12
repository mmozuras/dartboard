require('should');
require('../../models/user');

var mongoose = require('mongoose'),
    assert = require('assert'),
    User = mongoose.model('User');

module.exports = {
  'should not store a plaintext password': function() {
    var user = new User({username: 'Mark', password: 'password'});
    user.hashedPassword.should.not.eql('password');
  },
}
