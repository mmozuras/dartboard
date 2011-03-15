var mongoose = require('mongoose'),
    _ = require('underscore'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Throw = new Schema({
    score: { type: Number, required: true, min: 0, max: 25 },
    modifier: { type: Number, required: true, min: 1, max: 3 },
});

var DartsPlayer = new Schema({
    name: { type: String, required: true },
    throws: [Throw],
});

DartsPlayer.virtual('score')
  .get( function() {
      var game = this.parentArray._parent;
      if (_.isEmpty(this.throws)) return +game.startingScore;

      return _.reduce(this.throws, function(memo, t) {
        var potentialScore = memo - t.score * t.modifier;

        if (potentialScore < 0 ||
            potentialScore == 0 && game.out == 2 && t.modifier != 2 ||
            potentialScore == 1 && game.out == 2) 
          return memo;
        else return potentialScore;
      }, +game.startingScore);
  });

var DartsGame = new Schema({
    startingScore: { type: Number, required: true, min: 301, max: 1001, default: 501 },
    out: { type: Number, required: true, min: 1, max: 2, default: 2 },
    players: [DartsPlayer],
    throwNumber: { type: Number, required: true, min: 0, max: 2, default: 0 },
    currentPlayer: { type: Number, required: true, default: 0 },
    userId: { type: ObjectId, required: true },
});

DartsGame.method('setPlayers', function(players) {
    for (var i in players) {
      this.players.push({
        id: players[i].id, 
        name: players[i].name, 
      });
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
        
        if (game.currentPlayer == game.players.length - 1) { 
          game.currentPlayer = 0;
        }
        else game.currentPlayer++;
      }
      else game.throwNumber++;
    }

    if (!this.isOver()) {
      if (modifier == null) modifier = 1;
      validate(score, modifier);
    
      var player = this.players[this.currentPlayer];
      player.throws.push({score: score, modifier: modifier});

      nextThrow(this);
    }
});

String.prototype.startsWith = function(str) {
    return (this.indexOf(str) === 0);
};

DartsGame.method('parseThrow', function(score) {
    if (score.startsWith('D')) {
      this.throw(score.substring(1), 2);
    }
    else if (score.startsWith('T')) {
      this.throw(score.substring(1), 3);
    }
    else {
      if (_.isNumber(+score)) this.throw(+score);
      else throw 'Not a legal score';
    }
});

DartsGame.method('isOver', function() {
    return _.any(this.players, function(player) { 
      return player.score == 0;
    });
});

DartsGame.method('winner', function() {
    return _.detect(this.players, function(player) {
      return player.score == 0;
    });
});

DartsGame.method('isStarted', function() {
    return _.any(this.players, function(player) {
      return !_.isEmpty(player.throws);
    });
});

DartsGame.method('lastThrower', function() {
     if (this.throwNumber == 0) {
        if (this.currentPlayer == 0) {
          return this.players[this.players.length - 1];
        }
        return this.players[this.currentPlayer - 1];
     }
     else {
        return this.players[this.currentPlayer];
     }
});

DartsGame.method('undoThrow', function() {
    if (this.isStarted()) {
      if (this.throwNumber == 0) {
        this.throwNumber = 2;
        if (this.currentPlayer == 0) {
          this.currentPlayer = this.players.length - 1;
        }
        else {
          this.currentPlayer--;
        }      
      }
      else {  
        this.throwNumber--;
      }

      _.last(this.players[this.currentPlayer].throws).remove();
    }
   });

mongoose.model('DartsGame', DartsGame);
