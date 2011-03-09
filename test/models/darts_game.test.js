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
    game.setPlayers(players);

    game.throw(18, 3);
    game.throw(19, 3);
    game.throw(20, 3);
    game.players[0].score.toString().should.eql(330);
    game.players[1].score.toString().should.eql(501);
  },

  'fourth throw should be scored for the second player': function() {
    var game = new DartsGame();
    game.setPlayers(players);

    game.throw(16);
    game.throw(18);
    game.throw(20);
    game.throw(1);
    game.players[0].score.toString().should.eql(447);
    game.players[1].score.toString().should.eql(500);
  },

  'seventh throw should be scored for the first player if there are two players total': function() {
    var game = new DartsGame();
    game.setPlayers(players);

    for (var i = 1; i < 8; i++)
      game.throw(i);
    game.players[0].score.toString().should.eql(488);
    game.players[1].score.toString().should.eql(486);
  },

  'should not allow to score higher than 20': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.throw(21);
    }, 'Can\'t score higher than 20');
  },

  'should not allow to score a negative': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.throw(-1);
    }, 'Can\'t score lower than 0');
  },

  'should not allow a modifier bigger than 3': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.throw(5, 4);
    }, 'Modifer bigger than 3 is not allowed');
  },

  'should not allow a negative modifier': function() {
    var game = new DartsGame();

    assert.throws(function() {
      game.throw(4, -1);
    }, 'Negative modifier is not allowed');
  },

  'should allow to score an outer bull (25)': function() {
    var game = new DartsGame();
    game.setPlayers(players);

    game.throw(25);
    game.players[0].score.toString().should.eql(476);
  },

  'should allow to score an inner bull (25*2)': function() {
    var game = new DartsGame();
    game.setPlayers(players);

    game.throw(25, 2);
    game.players[0].score.toString().should.eql(451);
  },

  'should only let finish with a double if double out is specified': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    game.throw(1);
    for (var i = 0; i < 8; i++)
      game.throw(20, 3);

    game.players[0].score.toString().should.eql(20);

    game.throw(20);
    game.players[0].score.toString().should.eql(20);

    game.throw(10, 2);
    game.players[0].score.toString().should.eql(0);
  },

  'should not let player be left with a score of 1 if double out is specified': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    for (var i = 0; i < 1000; i++)
      game.throw(1);

    game.players[0].score.toString().should.eql(2);
  },

  'should only let finish with exactly 0': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    for (var i = 0; i < 8; i++)
      game.throw(20, 3);

    game.throw(20, 2);
    game.players[0].score.toString().should.eql(21);
  },

  'should be game over is one player has a score of 0': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    for (var i = 0; i < 500; i++)
      game.throw(1);

    game.throw(1, 2);
    game.players[0].score.toString().should.eql(0);
    game.isOver.should.be.ok;
  },

  'should not allow additional scoring when the game is over': function() {
    var game = new DartsGame();
    game.setPlayers(players);

    for (var i = 0; i < 1000; i++)
      game.throw(1);

    game.players[0].score.toString().should.eql(2);
    game.players[1].score.toString().should.eql(2);

    game.throw(1, 2);
    game.isOver.should.be.ok;

    for (var i = 0; i < 10; i++)
      game.throw(1, 2);

    game.players[0].score.toString().should.eql(2);
    game.players[1].score.toString().should.eql(0);
  },

  'should allow to score D10': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    game.parseThrow('D10');

    game.players[0].score.toString().should.eql(481);
  },

  'should allow to score T18': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    game.parseThrow('T18');
    game.players[0].score.toString().should.eql(447);
  },

  'should allow to score 3': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    game.parseThrow('3');
    game.players[0].score.toString().should.eql(498);
  },

  'should score random letters as zero': function() {
    var game = new DartsGame();
    game.setPlayers([new Player({name: 'Mark'})]);

    game.parseThrow('qwe');
    game.players[0].score.toString().should.eql(501);
  },
}
