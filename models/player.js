var mongoose = require('mongoose');

function nameValidator(v) {
  return v.length > 3 && v.length < 50;
}

var schema = new mongoose.Schema({
  name: { type: String, validate: [nameValidator, 'name'] }
});

schema.pre('save', function(next) {
    var Player =mongoose.model('Player');
    Player.findOne({ name: this.name }, function(err, existing) {
      if (existing != null) {
        next(new Error('Player with this name already exists'))
      }
      else next();
    });
});

mongoose.model('Player', schema);
