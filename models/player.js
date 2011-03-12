var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

function nameValidator(v) {
  return v.length > 3 && v.length < 50;
}

var Player = new Schema({
    name: { type: String, required: true, index: { unique: true }, validate: [nameValidator, 'name'] },
    userId: { type: ObjectId, required: true }
});

mongoose.model('Player', Player);
