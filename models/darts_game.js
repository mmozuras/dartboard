var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var DartsPlayer = new Schema({
    playerId: ObjectId,
    score: { type: Number, min: 0, default: 0 },
});

var DartsGame = new Schema({
    startingScore: { type: Number, min: 301, max: 1001, default: 501 },
    out: { type: Number, min: 1, max: 2, default: 2 },
    dartsPlayers: [DartsPlayer],
    throwNumber: { type: Number, min: 0, max: 2, default: 0 },
    currentPlayer: { type: Number, default: 0 },
});

DartsGame.virtual('players')
    .set( function(players) {
      for (i in players) {
        this.dartsPlayers.push({playerId: players[i], score: this.startingScore});
      }
    });

DartsGame.method('score', function(scores){
    for (i in scores) {
      var score = scores[i];

      if (score > 60) throw 'Can\'t score higher than 60';
      if (score < 0) throw 'Can\'t score lower than 0';
      if (score > 40 && score % 3 != 0) throw 'Can\'t score ' + score;
      if (score > 20 && score % 2 != 0) throw 'Can\'t score ' + score;

      this.dartsPlayers[this.currentPlayer].score -= score;

      if (this.throwNumber == 2) {
        this.throwNumber = 0;

        if (this.currentPlayer == this.dartsPlayers.length - 1) { 
          this.currentPlayer = 0;
        }
        else this.currentPlayer++;
      }
      else this.throwNumber++;
    }
});

mongoose.model('DartsGame', DartsGame);
