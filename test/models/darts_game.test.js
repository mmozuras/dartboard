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

    game.score(18, 3);
    game.score(19, 3);
    game.score(20, 3);
    game.dartsPlayers[0].score.toString().should.eql(330);
    game.dartsPlayers[1].score.toString().should.eql(501);
  },

  'fourth throw should be scored for the second player': function() {
    var game = new DartsGame();
    game.set('players', players);

    game.score(16);
    game.score(18);
    game.score(20);
    game.score(1);
    game.dartsPlayers[0].score.toString().should.eql(447);
    game.dartsPlayers[1].score.toString().should.eql(500);
  },

  'seventh throw should be scored for the first player if there are two players total': function() {
    var game = new DartsGame();
    game.set('players', players);

    for (i = 1; i < 8; i++)
      game.score(i);
    game.dartsPlayers[0].score.toString().should.eql(488);
    game.dartsPlayers[1].score.toString().should.eql(486);
  },

  'should not allow to score higher than 20': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.score(21);
    }, 'Can\'t score higher than 20');
  },

  'should not allow to score a negative': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.score(-1);
    }, 'Can\'t score lower than 0');
  },

  'should not allow a modifier bigger than 3': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.score(5, 4);
    }, 'Modifer bigger than 3 is not allowed');
  },

  'should not allow a negative modifier': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.score(4, -1);
    }, 'Negative modifier is not allowed');
  },

  'should allow to score an outer bull (25)': function() {
    var game = new DartsGame();
    game.set('players', players);

    game.score(25);
    game.dartsPlayers[0].score.toString().should.eql(476);
  },

  'should allow to score an inner bull (25*2)': function() {
    var game = new DartsGame();
    game.set('players', players);

    game.score(25, 2);
    game.dartsPlayers[0].score.toString().should.eql(451);
  },
}
