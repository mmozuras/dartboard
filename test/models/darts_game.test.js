require('should');
require('../../models/darts_game');
require('../../models/player');

var mongoose = require('mongoose'),
    DartsGame = mongoose.model('DartsGame'),
    Player= mongoose.model('Player'),
    players = [];

module.exports = {
  "new game should default to 501 and double-out": function() {
    var game = new DartsGame(players);

    game.startingScore.toString().should.eql(501);
  }
}
