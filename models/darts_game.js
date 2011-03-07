var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var DartsPlayer = new Schema({
    playerId: { type: ObjectId, required: true },
    score: { type: Number, required: true, min: 0, max: 1001, default: 501 },
});

var DartsGame = new Schema({
    startingScore: { type: Number, required: true, min: 301, max: 1001, default: 501 },
    out: { type: Number, required: true, min: 1, max: 2, default: 2 },
    dartsPlayers: [DartsPlayer],
    throwNumber: { type: Number, required: true, min: 0, max: 2, default: 0 },
    currentPlayer: { type: Number, required: true, default: 0 },
});

DartsGame.virtual('players')
    .set( function(players) {
      for (var i in players) {
        this.dartsPlayers.push({playerId: players[i].id, score: this.startingScore});
      }
    });

DartsGame.method('throw', function(score, modifier) {
    function validate(score, modifier) {
      if (score == 25 && (modifier == 1 || modifier == 2)) return;
      if (score > 20) throw 'Can\'t score higher than 20';
      if (score < 0) throw 'Can\'t score lower than 0';
      if (modifier > 4) throw 'Modifier bigger than 3 is not allowed';
      if (modifier < 0) throw 'Negative modifer is not allowed';
    };

    function nextThrow(game) {
      if (game.throwNumber == 2) {
        game.throwNumber = 0;

        if (game.currentPlayer == game.dartsPlayers.length - 1) { 
          game.currentPlayer = 0;
        }
        else game.currentPlayer++;
      }
      else game.throwNumber++;
    }

    if (!this.isOver()) {
      if (modifier == null) modifier = 1;
      validate(score, modifier);
    
      var player = this.dartsPlayers[this.currentPlayer];
      player.score -= score * modifier;

      if (player.score < 0 || 
          (player.score == 0 && this.out == 2 && modifier != 2) ||
          player.score == 1 && this.out == 2)
        player.score += score * modifier;

      nextThrow(this);
    }
});

DartsGame.method('isOver', function() {
    for (var i in this.dartsPlayers) {
      if (this.dartsPlayers[i].score == 0)
        return true;
    }
    return false;
});

mongoose.model('DartsGame', DartsGame);
