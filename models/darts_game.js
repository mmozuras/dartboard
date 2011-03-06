var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    startingScore: { type: Number, min: 301, max: 1001, default: 501 },
});

mongoose.model('DartsGame', schema);
