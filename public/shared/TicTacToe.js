const player1 = Circle.symbol;
const player2 = Cross.symbol;

// TODO: Fix AI symbol (when isAI = true)
// const isAI = true;

const DEBUG = false;

class TicTacToe {
    #gridSize;
    #board;
    #currentPlayer;
    #gameOver;
    #gridLines;
    #winningLine;
    #sketch;
    #isAI;

    get gridSize() { return this.#gridSize };

    get board() { return this.#board };

    get currentPlayer() { return this.#currentPlayer };

    get gameOver() { return this.#gameOver };

    set gameOver(value) { this.#gameOver = value };

    set isAI(value) { this.#isAI = value };

    constructor(sketch, initialPlayer, gridSize = 3, isAI = false) {
        this.#sketch = sketch;
        this.#gridSize = gridSize;
        this.#board = ((m, n) => Array.from({ length: m }, () => new Array(n).fill(null)))(this.#gridSize, this.#gridSize);

        this.#currentPlayer = initialPlayer;
        this.#gameOver = false;

        this.#createGrid(8, 70);
        this.#winningLine = null;
        this.#isAI = isAI;
    }

    checkIfEmpty(posx, posy) {
        return this.#board[posx][posy] == null;
    }

    #createGrid(gridWidth, gridPadding) {
        this.#gridLines = [];
        for (let i = 1; i < this.gridSize; i++) {
            const start_v = this.#sketch.createVector(this.#sketch.width / this.gridSize * i, 0 + gridPadding);
            const end_v = this.#sketch.createVector(this.#sketch.width / this.gridSize * i, this.#sketch.height - gridPadding);
            const start_h = this.#sketch.createVector(0 + gridPadding, this.#sketch.height / this.gridSize * i);
            const end_h = this.#sketch.createVector(this.#sketch.width - gridPadding, this.#sketch.height / this.gridSize * i);
            if (i % 2 == 0) {
                this.#gridLines.push(new AnimatedLine(this.#sketch, end_v, start_v, this.#sketch.color(0, 0, 0, 240), gridWidth))
                this.#gridLines.push(new AnimatedLine(this.#sketch, end_h, start_h, this.#sketch.color(0, 0, 0, 240), gridWidth))
            }
            else {
                this.#gridLines.push(new AnimatedLine(this.#sketch, start_v, end_v, this.#sketch.color(0, 0, 0, 240), gridWidth))
                this.#gridLines.push(new AnimatedLine(this.#sketch, start_h, end_h, this.#sketch.color(0, 0, 0, 240), gridWidth))
            }
        }
    }

    #drawGrid() {
        for (let line of this.#gridLines) {
            line.draw()
        }
    }

    #updateGrid() {
        for (let i = 0; i < this.#gridSize; i++) {
            for (let j = 0; j < this.#gridSize; j++) {
                const spot = this.#board[i][j];
                if (spot) spot.draw();
            }
        }
    }

    nextTurn(posx, posy) {
        if (this.#gameOver) return;

        if (this.#isAI) {
            if (this.#currentPlayer == player1) {
                if (this.#board[posx][posy] == null) {
                    this.#board[posx][posy] = new Cross(this.#sketch, posx, posy, this.#sketch.width / 6);
                    this.#currentPlayer = player2;
                }
            }

            const spot = this.#findBestMove(this.#convertBoard());
            const i = spot['row'];
            const j = spot['col'];
            if (DEBUG) console.log(spot);
            if (i == -1 && j == -1) return;
            if (this.#currentPlayer == player2) {
                this.#board[i][j] = new Circle(this.#sketch, i, j, this.#sketch.width / 6);
                this.#currentPlayer = player1;
            }
        } else {
            if (this.#board[posx][posy] == null) {
                if (this.#currentPlayer == player1) {
                    this.#board[posx][posy] = new Cross(this.#sketch, posx, posy, this.#sketch.width / 6);
                    this.#currentPlayer = player2;
                } else {
                    this.#board[posx][posy] = new Circle(this.#sketch, posx, posy, this.#sketch.width / 6);
                    this.#currentPlayer = player1;
                }
            }
        }
        if (DEBUG) console.log(this.#board);
    }

    // TODO: Optimized conversion of 2D array mapped to new 2D array conditionally
    #convertBoard() {
        let tempBoard = [];
        let temp = [];
        for (let i = 0; i < this.#gridSize; i++) {
            for (let j = 0; j < this.#gridSize; j++) {
                if (this.#board[i][j] == null)
                    temp.push('_');
                else {
                    temp.push(this.#board[i][j].symbol == Cross.symbol ? Cross.symbol : Circle.symbol);
                }
            }
            tempBoard.push(temp);
            temp = [];
        }
        if (DEBUG) console.log(tempBoard);
        return tempBoard;
    }

    // This will return the best possible move for the player
    #findBestMove(board) {
        let bestVal = -Infinity;
        let bestMove = { row: -1, col: -1 };

        // Traverse all cells, evaluate
        // minimax function for all empty
        // cells. And return the cell
        // with optimal value.
        for (let i = 0; i < this.#gridSize; i++) {
            for (let j = 0; j < this.#gridSize; j++) {

                // Check if cell is empty
                if (board[i][j] == '_') {

                    // Make the move
                    board[i][j] = player1;

                    // compute evaluation function
                    // for this move.
                    let moveVal = this.#minimax(board, 0, false);

                    // Undo the move
                    board[i][j] = '_';

                    // If the value of the current move
                    // is more than the best value, then
                    // update best
                    if (moveVal > bestVal) {
                        bestMove = { row: i, col: j };
                        bestVal = moveVal;
                    }
                }
            }
        }
        if (DEBUG) console.log(`Best Score: ${bestVal}, (${bestMove['row']},${bestMove['col']})`)
        return bestMove;
    }

    // This function returns true if there are moves
    // remaining on the board. It returns false if
    // there are no moves left to play.
    #isMovesLeft(board) {
        for (let i = 0; i < this.gridSize; i++)
            for (let j = 0; j < this.gridSize; j++)
                if (board[i][j] == '_' || board[i][j] == null)
                    return true;

        return false;
    }

    draw() {
        this.#drawGrid();
        this.#updateGrid();
        if (this.#winningLine) this.#winningLine.draw();
    }

    #place_winning_line(a, b) {
        this.#winningLine = new AnimatedLine(this.#sketch, a.getCenter(), b.getCenter(), this.#sketch.color(0, 0, 0, 200), 7);
    }

    checkWinner() {
        function equals3(a, b, c) {
            return (a && b && c && a.symbol == b.symbol && b.symbol == c.symbol);
        }

        let winner = null;

        // Horizontal
        for (let i = 0; i < this.#gridSize; i++) {
            if (equals3(this.#board[i][0], this.#board[i][1], this.#board[i][2])) {
                winner = this.#board[i][0].symbol;
                this.#place_winning_line(this.#board[i][0], this.#board[i][2]);
            }
        }

        // Vertical
        for (let i = 0; i < this.#gridSize; i++) {
            if (equals3(this.#board[0][i], this.#board[1][i], this.#board[2][i])) {
                winner = this.#board[0][i].symbol;
                this.#place_winning_line(this.#board[0][i], this.#board[2][i]);
            }
        }

        // Diagonal
        if (equals3(this.#board[0][0], this.#board[1][1], this.#board[2][2])) {
            winner = this.#board[0][0].symbol;
            this.#place_winning_line(this.#board[0][0], this.#board[2][2]);
        }
        if (equals3(this.#board[2][0], this.#board[1][1], this.#board[0][2])) {
            winner = this.#board[2][0].symbol;
            this.#place_winning_line(this.#board[2][0], this.#board[0][2]);
        }

        if (winner == null && !this.#isMovesLeft(this.#board)) {
            return 'tie';
        } else {
            return winner;
        }
    }

    // TODO: Make it generic for n x n board
    #evaluate(b) {

        // Checking for Rows for X or O victory.
        for (let row = 0; row < this.#gridSize; row++) {
            if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
                if (b[row][0] == player1)
                    return +10;
                else if (b[row][0] == player2)
                    return -10;
            }
        }

        // Checking for Columns for X or O victory.
        for (let col = 0; col < this.#gridSize; col++) {
            if (b[0][col] == b[1][col] &&
                b[1][col] == b[2][col]) {
                if (b[0][col] == player1)
                    return +10;
                else if (b[0][col] == player2)
                    return -10;
            }
        }

        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if (b[0][0] == player1)
                return +10;

            else if (b[0][0] == player2)
                return -10;
        }

        if (b[0][2] == b[1][1] &&
            b[1][1] == b[2][0]) {
            if (b[0][2] == player1)
                return +10;

            else if (b[0][2] == player2)
                return -10;
        }

        // Else if none of them have
        // won then return 0
        return 0;
    }

    // This is the minimax function. It considers all the possible ways the game can go and returns the value of the board.
    #minimax(board, depth, isMax) {
        let score = this.#evaluate(board);
        // If Maximizer has won the game return his/her evaluated score
        if (score == 10)
            return score;

        // If Minimizer has won the game return his/her evaluated score
        if (score == -10)
            return score;

        // If there are no more moves and no winner then it is a tie
        if (this.#isMovesLeft(board) == false)
            return 0;

        // If this maximizer's move
        if (isMax) {
            let best = -Infinity;

            // Traverse all cells
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {

                    // Check if cell is empty
                    if (board[i][j] == '_') {

                        // Make the move
                        board[i][j] = player1;

                        // Call minimax recursively and choose the maximum value
                        best = Math.max(best, this.#minimax(board, depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = '_';
                    }
                }
            }
            return best;
        }
        // If this minimizer's move
        else {
            let best = Infinity;

            // Traverse all cells
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {

                    // Check if cell is empty
                    if (board[i][j] == '_') {

                        // Make the move
                        board[i][j] = player2;

                        // Call minimax recursively and choose the minimum value
                        best = Math.min(best, this.#minimax(board, depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = '_';
                    }
                }
            }
            return best;
        }
    }
}