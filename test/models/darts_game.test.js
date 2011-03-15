require('should');
require('../../models/darts_game');
require('../../models/player');

var mongoose = require('mongoose'),
    assert = require('assert'),
    DartsGame = mongoose.model('DartsGame'),
    Player= mongoose.model('Player');

var GameWithOnePlayer = function() {
  var game = new DartsGame();
  game.setPlayers([new Player({name: 'Mark'})]);
  return game;
};

var GameWithTwoPlayers = function() {
  var game = new DartsGame();
  var players = [new Player({name: 'Bill'}), new Player({name: 'Steve'})];
  game.setPlayers(players);
  return game;
};

module.exports = {
  'new game should default to 501 and double-out': function() {
    var game = new DartsGame();

    game.startingScore.toString().should.eql(501);
    game.out.toString().should.eql(2);
  },

  'should start scoring with the first player': function() {
    var game = GameWithTwoPlayers();

    game.throw(18, 3);
    game.throw(19, 3);
    game.throw(20, 3);
    game.players[0].score.should.eql(330);
    game.players[1].score.should.eql(501);
  },

  'fourth throw should be scored for the second player': function() {
    var game = GameWithTwoPlayers();

    game.throw(16);
    game.throw(18);
    game.throw(20);
    game.throw(1);
    game.players[0].score.should.eql(447);
    game.players[1].score.should.eql(500);
  },

  'seventh throw should be scored for the first player if there are two players total': function() {
    var game = GameWithTwoPlayers();

    for (var i = 1; i < 8; i++)
      game.throw(i);
    game.players[0].score.should.eql(488);
    game.players[1].score.should.eql(486);
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
    var game = GameWithTwoPlayers();

    game.throw(25);
    game.players[0].score.should.eql(476);
  },

  'should allow to score an inner bull (25*2)': function() {
    var game = GameWithTwoPlayers();

    game.throw(25, 2);
    game.players[0].score.should.eql(451);
  },

  'should only let finish with a double if double out is specified': function() {
    var game = GameWithOnePlayer();

    game.throw(1);
    for (var i = 0; i < 8; i++)
      game.throw(20, 3);

    game.players[0].score.should.eql(20);

    game.throw(20);
    game.players[0].score.should.eql(20);

    game.throw(10, 2);
    game.players[0].score.should.eql(0);
  },

  'should not let player be left with a score of 1 if double out is specified': function() {
    var game = GameWithOnePlayer();

    for (var i = 0; i < 40; i++)
      game.throw(15, 3);

    game.throw(5);

    game.players[0].score.should.eql(6);
  },

  'should only let finish with exactly 0': function() {
    var game = GameWithOnePlayer();

    for (var i = 0; i < 8; i++)
      game.throw(20, 3);

    game.throw(20, 2);
    game.players[0].score.should.eql(21);
  },

  'should be game over is one player has a score of 0': function() {
    var game = GameWithOnePlayer();

    for (var i = 0; i < 40; i++)
      game.throw(15, 3);

    game.throw(3, 2);
    game.players[0].score.should.eql(0);
    game.isOver.should.be.ok;
  },

  'should not allow additional scoring when the game is over': function() {
    var game = GameWithTwoPlayers();

    for (var i = 0; i < 40; i++)
      game.throw(15, 3);

    game.throw(3, 2);
    game.isOver.should.be.ok;

    for (var i = 0; i < 10; i++)
      game.throw(3, 2);

    game.players[0].score.should.eql(6);
    game.players[1].score.should.eql(0);
  },

  'should allow to score D10': function() {
    var game = GameWithOnePlayer();

    game.parseThrow('D10');

    game.players[0].score.should.eql(481);
  },

  'should allow to score T18': function() {
    var game = GameWithOnePlayer();

    game.parseThrow('T18');
    game.players[0].score.should.eql(447);
  },

  'should allow to score 3': function() {
    var game = GameWithOnePlayer();

    game.parseThrow('3');
    game.players[0].score.should.eql(498);
  },

  'should score random letters as zero': function() {
    var game = GameWithOnePlayer();

    assert.throws(function() {
      game.parseThrow('qwe');
    }, 'Not a legal score');
  },

  'should get the last thrower': function() {
    var game = GameWithTwoPlayers();
    
    game.throw(1);
    game.throw(2);
    game.throw(3);
    game.lastThrower().name.should.eql('Bill');
    game.throw(4);
    game.lastThrower().name.should.eql('Steve');
  },

  'should register all the throws': function() {
    var game = GameWithTwoPlayers();

    game.throw(1);
    game.throw(14, 3);

    game.players[0].throws[0].score.toString().should.eql(1);
    game.players[0].throws[0].modifier.toString().should.eql(1);
    game.players[0].throws[1].score.toString().should.eql(14);
    game.players[0].throws[1].modifier.toString().should.eql(3);
  },

  'should be able to undo the first throw': function() {
    var game = GameWithOnePlayer();

    game.throw(1);

    game.undoThrow();
    game.players[0].throws.length.should.eql(0);
    game.players[0].score.should.eql(501);
    game.throwNumber.toString().should.eql(0);
  },

  'should be able to undo the first two throws': function() {
    var game = GameWithOnePlayer();

    game.throw(3, 3);
    game.throw(16, 2);

    game.undoThrow();
    game.players[0].throws.length.should.eql(1);
    game.throwNumber.toString().should.eql(1);

    game.undoThrow();
    game.players[0].throws.length.should.eql(0);
    game.throwNumber.toString().should.eql(0);
  },

  'should be able to undo a last throw in a round': function() {
    var game = GameWithTwoPlayers();

    game.throw(1);
    game.throw(2);
    game.throw(3);

    game.undoThrow();
    game.throwNumber.toString().should.eql(2);
    game.currentPlayer.toString().should.eql(0);
    game.players[0].throws.length.should.eql(2);
  },

  'should be able to undo the first throw of the second player': function() {
    var game = GameWithTwoPlayers();

    game.throw(1);
    game.throw(2);
    game.throw(3);
    game.throw(4);

    game.undoThrow();
    game.throwNumber.toString().should.eql(0);
    game.currentPlayer.toString().should.eql(1);
    game.players[1].throws.length.should.eql(0);
  },

  'should do nothing if there is nothing to undo': function() {
    var game = GameWithOnePlayer();

    game.undoThrow();
    game.throwNumber.toString().should.eql(0);
    game.currentPlayer.toString().should.eql(0);
  },

  'should be able to determine that the game has started': function() {
    var game = GameWithOnePlayer();
    game.throw(1);

    game.isStarted().should.be.ok;
  },

  'should be able to determine that the game hasn\'t started': function() {
    var game = GameWithOnePlayer();

    game.isStarted().should.be.false;
  },

  'should have no game winner if the game is not over yet': function() {
    var game = GameWithOnePlayer();

    assert.isUndefined(game.winner());
  },

  'should be able to determine the game winner': function() {
    var game = GameWithTwoPlayers();

    for (var i = 0; i < 40; i++)
      game.throw(15, 3);

    game.throw(3, 2);

    game.winner().name.should.eql('Steve');
  },
}
