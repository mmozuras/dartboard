require('should');
require('../../models/darts_game');
require('../../models/player');

var mongoose = require('mongoose'),
    assert = require('assert'),
    DartsGame = mongoose.model('DartsGame'),
    Player= mongoose.model('Player'),
    players = [new Player({name: 'Bill'}), new Player({name: 'Steve'})];

module.exports = {
  'new game should default to 501 and double-out': function() {
    var game = new DartsGame();

    game.startingScore.toString().should.eql(501);
    game.out.toString().should.eql(2);
  },

  'should start scoring with the first player': function() {
    var game = new DartsGame();
    game.set('players', players);

    game.score([48, 54, 60]);
    game.dartsPlayers[0].score.toString().should.eql(339);
    game.dartsPlayers[1].score.toString().should.eql(501);
  },

  'fourth throw should be scored for the second player': function() {
    var game = new DartsGame();
    game.set('players', players);

    game.score([16, 18, 20, 1]);
    game.dartsPlayers[0].score.toString().should.eql(447);
    game.dartsPlayers[1].score.toString().should.eql(500);
  },

  'seventh throw should be scored for the first player if there are two players total': function() {
    var game = new DartsGame();
    game.set('players', players);

    game.score([1, 2, 3, 4, 5, 6, 7]);
    game.dartsPlayers[0].score.toString().should.eql(488);
    game.dartsPlayers[1].score.toString().should.eql(486);
  },

  'should not allow to score higher than 60': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.score([61]);
    }, 'Can\'t score higher than 60');
  },

  'should not allow to score a negative': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.score([-1]);
    }, 'Can\'t score lower than 0');
  },

  'should not allow to score an impossible score': function() {
    var game = new DartsGame();
    var impossible = [23, 25, 29, 31, 35, 37, 41, 43, 44, 46, 47, 49, 50, 52, 53, 55, 56, 58, 59];

    for (i in impossible) {
      assert.throws(function() {
        game.score([impossible[i]]);
      }, 'Can\'t score ' + impossible[i]);
    }
  },
}
