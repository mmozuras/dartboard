var mongoose = require('mongoose');

function nameValidator(v) {
  return v.length > 3 && v.length < 50;
}

var Player = new mongoose.Schema({
    name: { type: String, required: true, validate: [nameValidator, 'name'] }
});

Player.pre('save', function(next) {
    mongoose.model('Player').findOne({ name: this.name }, function(err, existing) {
      if (existing != null) {
        next(new Error('Player with this name already exists'))
      }
      else next();
    });
});

mongoose.model('Player', Player);
