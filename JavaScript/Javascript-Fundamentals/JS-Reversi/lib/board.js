let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid() {
    let board = new Array(8);
    for (let col = 0; col < 8; col++) {
        board[col] = new Array(8);
    }
    board[3][4] = new Piece("black");
    board[4][3] = new Piece("black");
    board[3][3] = new Piece("white");
    board[4][4] = new Piece("white");

    return board;
}
/**
 * Constructs a Board with a starting grid set up.
 */
function Board() {
    this.grid = _makeGrid();
}
Board.DIRS = [
    [0, 1], [1, 1], [1, 0],
    [1, -1], [0, -1], [-1, -1],
    [-1, 0], [-1, 1]
];
/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
    if (pos[0] < 0 || pos[1] < 0) {
        return false;
    }
    return pos[0] < 8 && pos[1] < 8;
};
/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
    // the constuctor "Board" has the grid as an object property
    self = this.grid;
    if (this.isValidPos(pos)) {
        return self[pos[0]][pos[1]];
    } else {
        throw new Error(`The Position ${pos} is INVALID!`)
    }
};
/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
    self = this.grid;
    if (self[pos[0]][pos[1]]) {
        return self[pos[0]][pos[1]].color === color;
    }
    return false;
};
/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
    return this.isValidPos(pos) ? this.grid[pos[0]][pos[1]] != undefined : false;
};
/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces (position of piece [x, y]) between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 * */
Board.prototype._positionsToFlip = function (pos, color, dir, piecesToFlip) {
    // initiate empty array for piecestoFilb in the forst recursion call
    if (!piecesToFlip) {
        piecesToFlip = [];
    }
    // starting from the second recursive call, add the pos argument to the list of pieces that are of the opposite color
    else {
        piecesToFlip.push(pos);
    };
    // the next position in the selected direction to be tested, according to tests, it will be added to piecesToFlib or ignored
    let nextPos = [pos[0] + dir[0], pos[1] + dir[1]];
    // Returns an empty array if it reaches the end of the board before finding another pieceof the same color.
    if (!(this.isValidPos(nextPos))) {
        return [];
    } else if (!(this.isOccupied(nextPos))) {
        return [];
    } else if (this.isMine(nextPos, color)) {
        return piecesToFlip.length == 0 ? [] : piecesToFlip;
    }
    return this._positionsToFlip(nextPos, color, dir, piecesToFlip);
}
/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
    if (this.isOccupied(pos)) {
        return false;
    }
    for (let i = 0, len = Board.DIRS.length; i < len; i++) {
        if ((this._positionsToFlip(pos, color, Board.DIRS[i])).length > 0) return true;
    }
    return false;
};
/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
    let totalPiecesToFlip = []
    if (this.validMove(pos, color)) {
        this.grid[pos[0]][pos[1]] = new Piece(color);
        for (let i = 0, len = Board.DIRS.length; i < len; i++) {
            let currentPieces = (this._positionsToFlip(pos, color, Board.DIRS[i]))
            if (currentPieces.length > 0) totalPiecesToFlip.push(...currentPieces);
        }
    } else {
        throw new Error(`This position ${pos} is INVALID MOVE`)
    }
    if (totalPiecesToFlip.length) {
        for (let j = 0, lenth = totalPiecesToFlip.length; j < lenth; j++) {
            this.getPiece(totalPiecesToFlip[j]).flip();
        }
    }
};
/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
    // array of valid positions
    let validPositions = [];
    // outer loop for rows
    for (let i = 0, rowLen = this.grid.length; i < rowLen; i++) {
        // inner loop for columns
        for (let j = 0, colmLen = this.grid[i].length; j < colmLen; j++) {
            // inside inner loop, test with ValidPosition function, if true push it to result array
            if (this.validMove([i, j], color)) validPositions.push([i, j]);
        }
    }
    // return the result array
    return validPositions;
};
/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
    if (this.validMoves(color).length > 0) return true;
    return false;
};
/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
    if ((this.validMoves("black").length == 0) && (this.validMoves("white").length == 0)) return true;
    return false
};
/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
    for (let i = 0, rowLen = this.grid.length; i < rowLen; i++) {
        let rowString = " " + i + " |"
        // inner loop for columns
        for (let j = 0, colmLen = this.grid[i].length; j < colmLen; j++) {
            let posistion = [i, j];
            // inside inner loop, test with ValidPosition function, if true push it to result array
            rowString += this.getPiece(posistion) ? this.getPiece(posistion).toString() : " *";
        }
        console.log(rowString);
    }

};

module.exports = Board;
