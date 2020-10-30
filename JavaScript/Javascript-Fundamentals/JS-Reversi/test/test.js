const assert = require("assert");
const Piece = require("../lib/piece.js");
const Board = require("../lib/board.js");
const Game = require("../lib/game.js");

describe("Piece", function () {
  let darkPiece,
    lightPiece;

  beforeEach(function () {
    darkPiece = new Piece("black");
    lightPiece = new Piece("white");
  });

  describe("#color", function () {
    it("should have the color assigned to it", function () {
      assert.equal(darkPiece.color, "black");
      assert.equal(lightPiece.color, "white");
    });
  });
  describe("#flip", function () {
    it("should switch colors when flipped", function () {
      darkPiece.flip();
      assert.equal(darkPiece.color, "white");
      lightPiece.flip();
      assert.equal(lightPiece.color, "black");
    });
  });

  describe('#toString', function () {
    it('should return a letter representing the color', function () {
      assert.equal(lightPiece.toString(), 'W');
      assert.equal(darkPiece.toString(), 'B');
    });
  });
});

describe("Board", function () {
  let testBoard;

  beforeEach(function () {
    testBoard = new Board();
  });

  const fillBoard = function (board) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        board.grid[i][j] = new Piece("white");
      }
    }
  };

  describe("#grid", function () {
    it("should be 8x8", function () {
      assert.equal(testBoard.grid.length, 8);
      for (let i = 0; i < 8; i++) {
        assert.equal(testBoard.grid[i].length, 8);
      }
    });

    it("should begin with 4 pieces in the center", function () {
      assert.equal(testBoard.grid[3][3].color, "white");
      assert.equal(testBoard.grid[3][4].color, "black");
      assert.equal(testBoard.grid[4][3].color, "black");
      assert.equal(testBoard.grid[4][4].color, "white");
    });

    it("should start out empty except for the 4 center pieces", function () {
      testBoard.grid.forEach(function (row, i) {
        row.forEach(function (spot, j) {
          if ((i !== 3 && i !== 4) && (j !== 3 && j !== 4)) {
            assert.equal(spot, undefined);
          }
        });
      });
    });
  });

  describe('#isValidPos', function () {
    it('should return false when x or y is less than 0', function () {
      assert.equal(testBoard.isValidPos([-1, 1]), false);
      assert.equal(testBoard.isValidPos([1, -1]), false);
    });

    it('should return false when x or y is greater than 7', function () {
      assert.equal(testBoard.isValidPos([9, 1]), false);
      assert.equal(testBoard.isValidPos([1, 9]), false);
    });

    it('should return true otherwise', function () {
      assert.equal(testBoard.isValidPos([3, 3]), true);
    });
  });

  describe('#getPiece', function () {
    it('should return a piece for an occupied position', function () {
      assert(testBoard.getPiece([3, 4]) instanceof Piece, true);
    });

    it('should return undefined for an empty position', function () {
      assert.equal(testBoard.getPiece([0, 0]), undefined);
    });

    it('should throw an error for an invalid position', function () {
      function pickInvalidPos() {
        testBoard.getPiece([10, 10]);
      }
      assert.throws(pickInvalidPos, Error, 'Not valid pos!');
    });
  });

  describe('#isMine', function () {
    it('should return true when the retrieved piece matches the color', function () {
      assert.equal(testBoard.isMine([3, 3], 'white'), true);
    });

    it('should return false when retrieved piece does not match', function () {
      assert.equal(testBoard.isMine([3, 3], 'black'), false);
    });

    it('should return falsey when retrieved piece is undefined', function () {
      assert.equal(!testBoard.isMine([0, 0], 'black'), true);
    });
  });

  describe("#isOccupied", function () {
    it('should return true if there is a piece on a position', function () {
      assert.equal(testBoard.isOccupied([3, 3]), true)
      assert.equal(testBoard.isOccupied([3, 4]), true)
    })

    it("should return false if there isn't a piece on a position", function () {
      assert.equal(testBoard.isOccupied([3, 5]), false)
      assert.equal(testBoard.isOccupied([4, 5]), false)
    })
  })

  describe("#_positionsToFlip", function () {
    it('returns empty array when pos is not on the board', function () {
      assert.equal(testBoard._positionsToFlip([-1, -1], "white", [1, 0]).length, 0);
      assert.equal(testBoard._positionsToFlip([9, 9], "white", [1, 0]).length, 0);
    })

    it("returns empty array when there is a blank space one position away from the current position", function () {
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [0, 1]).length, 0);
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [-1, 1]).length, 0);
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [-1, 0]).length, 0);
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [0, -1]).length, 0);
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [-1, -1]).length, 0);;
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [1, 0]).length, 0);
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [1, 1]).length, 0);
      assert.equal(testBoard._positionsToFlip([4, 6], "white", [1, -1]).length, 0);
    })

    it("returns empty array if no pieces of the opposite color are found", function () {
      let traversalDoesntFlipTestBoard = new Board();
      traversalDoesntFlipTestBoard.grid[6][2] = new Piece("white");

      assert.equal(testBoard._positionsToFlip([4, 5], "white", [0, -1]).length, 0);
      assert.equal(testBoard._positionsToFlip([5, 4], "white", [-1, 0]).length, 0);
      assert.equal(testBoard._positionsToFlip([5, 5], "white", [-1, -1]).length, 0);
      assert.equal(testBoard._positionsToFlip([3, 2], "white", [0, 1]).length, 0);
      assert.equal(testBoard._positionsToFlip([2, 2], "white", [1, 1]).length, 0);
      assert.equal(testBoard._positionsToFlip([2, 3], "white", [1, 0]).length, 0);
      assert.equal(testBoard._positionsToFlip([7, 1], "white", [-1, 1]).length, 0);
      assert.equal(testBoard._positionsToFlip([5, 3], "white", [1, -1]).length, 0);
    });

    beforeEach(function () {
      testBoardLongHorzDiagonal = new Board();

      testBoardLongHorzDiagonal.grid[1][1] = new Piece("black")
      testBoardLongHorzDiagonal.grid[1][3] = new Piece("black")
      testBoardLongHorzDiagonal.grid[1][4] = new Piece("white")
      testBoardLongHorzDiagonal.grid[1][6] = new Piece("white")
      testBoardLongHorzDiagonal.grid[1][7] = new Piece("white")

      testBoardLongHorzDiagonal.grid[2][0] = new Piece("black")
      testBoardLongHorzDiagonal.grid[2][2] = new Piece("white")
      testBoardLongHorzDiagonal.grid[2][3] = new Piece("white")
      testBoardLongHorzDiagonal.grid[2][4] = new Piece("black")
      testBoardLongHorzDiagonal.grid[2][5] = new Piece("black")
      testBoardLongHorzDiagonal.grid[2][7] = new Piece("black")

      testBoardLongHorzDiagonal.grid[3][0] = new Piece("black")
      testBoardLongHorzDiagonal.grid[3][2] = new Piece("white")
      testBoardLongHorzDiagonal.grid[3][3] = new Piece("white")
      testBoardLongHorzDiagonal.grid[3][4] = new Piece("black")
      testBoardLongHorzDiagonal.grid[3][5] = new Piece("black")
      testBoardLongHorzDiagonal.grid[3][7] = new Piece("black")

      testBoardLongHorzDiagonal.grid[4][0] = new Piece("black")
      testBoardLongHorzDiagonal.grid[4][1] = new Piece("black")
      testBoardLongHorzDiagonal.grid[4][3] = new Piece("black")
      testBoardLongHorzDiagonal.grid[4][4] = new Piece("white")
      testBoardLongHorzDiagonal.grid[4][6] = new Piece("white")
      testBoardLongHorzDiagonal.grid[4][7] = new Piece("black")

      testBoardLongHorzDiagonal.grid[5][0] = new Piece("white")

      testBoardLongHorzDiagonal.grid[6][2] = new Piece("white")
      testBoardLongHorzDiagonal.grid[6][3] = new Piece("white")
      testBoardLongHorzDiagonal.grid[6][4] = new Piece("white")
      testBoardLongHorzDiagonal.grid[6][5] = new Piece("white")
      testBoardLongHorzDiagonal.grid[6][6] = new Piece("black")

      testBoardLongHorzDiagonal.grid[7][1] = new Piece("black")
      testBoardLongHorzDiagonal.grid[7][2] = new Piece("white")
      testBoardLongHorzDiagonal.grid[7][3] = new Piece("white")
      testBoardLongHorzDiagonal.grid[7][4] = new Piece("white")
      testBoardLongHorzDiagonal.grid[7][5] = new Piece("white")

    });

    it("returns positions for longer horizontal and vertical cases ", function () {
      //long vertical cases
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([1, 0], "white", [1, 0])), JSON.stringify([[2, 0], [3, 0], [4, 0]]));
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([5, 7], "white", [-1, 0])), JSON.stringify([[4, 7], [3, 7], [2, 7]]));

      //long horizontal cases
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([6, 1], "black", [0, 1])), JSON.stringify([[6, 2], [6, 3], [6, 4], [6, 5]]));
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([7, 6], "black", [0, -1])), JSON.stringify([[7, 5], [7, 4], [7, 3], [7, 2]]));
    });

    it("returns positions for longer diagonal cases", function () {
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([5, 2], "white", [-1, 1])), JSON.stringify([[4, 3], [3, 4], [2, 5]]));
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([5, 5], "black", [-1, -1])), JSON.stringify([[4, 4], [3, 3], [2, 2]]));

      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([0, 2], "white", [1, 1])), JSON.stringify([[1, 3], [2, 4], [3, 5]]));
      assert.equal(JSON.stringify(testBoardLongHorzDiagonal._positionsToFlip([0, 5], "black", [1, -1])), JSON.stringify([[1, 4], [2, 3], [3, 2]]));
    })

  });

  describe('#validMove', function () {
    it('should return false for an occupied position', function () {
      assert.equal(testBoard.validMove([3, 4], 'black'), false);
    });

    it('should return false for a move that does not capture', function () {
      assert.equal(testBoard.validMove([2, 3], "white"), false);
    });

    it('should return true for a valid move', function () {
      assert.equal(testBoard.validMove([2, 3], "black"), true);
    });
  });

  describe("#placePiece", function () {
    it("should allow a player to make a valid move", function () {
      testBoard.placePiece([2, 3], "black");
      assert.equal(testBoard.grid[2][3].color, "black");
    });

    it("should flip captured pieces", function () {
      testBoard.placePiece([2, 3], "black");
      assert.equal(testBoard.grid[3][3].color, "black");
    });

    it("should not allow a piece on top of another piece", function () {
      function makeBadMove() {
        testBoard.placePiece([3, 3], "white");
      }

      assert.throws(makeBadMove, Error, "Invalid Move");
    });

    it("should not allow a move that doesn't capture", function () {
      function makeBadMove() {
        testBoard.placePiece([3, 3], "white");
      }

      assert.throws(makeBadMove, Error, "Invalid Move");
    });

    it("should not allow moves that isolate pieces", function () {
      function makeOtherBadMove() {
        testBoard.placePiece([0, 0], "white");
      }

      assert.throws(makeOtherBadMove, Error, "Invalid Move");
    });
  });

  describe('#validMoves', function () {
    it('should return an empty array when there are no valid moves', function () {
      fillBoard(testBoard);
      assert.equal(testBoard.validMoves('black').length, 0);
    });

    it('should return an array of valid moves when some are left', function () {
      const validPositions = [
        [2, 3],
        [3, 2],
        [4, 5],
        [5, 4]
      ];
      const actualPositions = testBoard.validMoves('black');

      assert.equal(actualPositions.length, validPositions.length);

      actualPositions.forEach(function (actualPosition, index) {
        let validPosition = validPositions[index];
        assert.equal(actualPosition[0], validPosition[0]);
        assert.equal(actualPosition[1], validPosition[1]);
      });
    });
  });

  describe('#hasMove', function () {
    it('should return true when a color has one or more moves', function () {
      assert.equal(testBoard.hasMove('black'), true);
    });

    it('should return false when a color has no more moves', function () {
      fillBoard(testBoard);
      assert.equal(testBoard.hasMove('black'), false);
    });
  });

  describe('#isOver', function () {
    it('should return false at the start', function () {
      assert.equal(testBoard.isOver(), false);
    });

    it('should return true when there are no more moves', function () {
      fillBoard(testBoard);
      assert.equal(testBoard.isOver(), true);
    });
  });
});

