function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  Player = new Schema({
      'name': String
  });

  mongoose.model('Player', Player);

  fn();
}

exports.defineModels = defineModels;
