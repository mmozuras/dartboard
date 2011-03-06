var mongoose = require('mongoose');

function nameValidator(v) {
  return v.length > 3 && v.length < 50;
}

var schema = new mongoose.Schema({
  name: { type: String, validate: [nameValidator, 'name'] }
});

mongoose.model('Player', schema);
