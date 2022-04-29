let game_over = false;

let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

let players = [{
    _class: Cross,
    symbol: Cross.symbol
},
{
    _class: Circle,
    symbol: Circle.symbol
}
];

let grid_lines = [];
const grid_size = 3;
const grid_width = 8;
const grid_padding = 70;

let currentPlayer;
let available = [];
let winning_line = null;

function setup() {
    createCanvas(400, 400);
    frameRate(60);
    // currentPlayer = floor(random(players.length));
    currentPlayer = player;
    for (let j = 0; j < grid_size; j++) {
        for (let i = 0; i < grid_size; i++) {
            available.push([i, j]);
        }
    }
    createGrid(grid_size);
    // setInterval(nextTurn, 1000);
    // nextTurn();
}

function equals3(a, b, c) {
    return (a && b && c && a.symbol == b.symbol && b.symbol == c.symbol);
}

function place_winning_line(a, b) {
    winning_line = new AnimatedLine(a.getCenter(), b.getCenter(), color(246, 233, 233, 200), 7);
}

function checkWinner() {
    let winner = null;

    // Horizontal
    for (let i = 0; i < grid_size; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0].symbol;
            place_winning_line(board[i][0], board[i][2]);
        }
    }

    // Vertical
    for (let i = 0; i < grid_size; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i].symbol;
            place_winning_line(board[0][i], board[2][i]);
        }
    }

    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0].symbol;
        place_winning_line(board[0][0], board[2][2]);
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0].symbol;
        place_winning_line(board[2][0], board[0][2]);
    }

    if (winner == null && available.length == 0) {
        return 'tie';
    } else {
        return winner;
    }

}

function mousePressed() {
    let i = floor(mouseX / (width / grid_size));
    let j = floor(mouseY / (width / grid_size));
    if (i >= grid_size || j >= grid_size) return
    if (currentPlayer == player) {
        if (board[i][j] == null) {
            board[i][j] = new players[0]._class(i, j, width / 6);
            currentPlayer = opponent;
        }
        console.log(board);
        nextTurn()
    }
}

function convertBoard(gridSize) {
    let tempBoard = [];
    let temp = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] == null)
                temp.push('_');
            else {
                if (board[i][j].symbol == 'X')
                    temp.push('x');
                else
                    temp.push('o');
            }
        }
        tempBoard.push(temp);
        temp = [];
    }
    console.log(tempBoard);
    return tempBoard;
}

function nextTurn() {
    if (game_over) return;
    // let index = floor(random(available.length));
    // let spot = available.splice(index, 1)[0];

    let spot = findBestMove(convertBoard(grid_size));
    // let i = spot['i'];
    // let j = spot['j'];
    let i = spot.row;
    let j = spot.col;
    console.log(spot)
    board[i][j] = new players[currentPlayer == opponent ? 1 : 0]._class(i, j, width / 6);
    currentPlayer = player;
    // currentPlayer = (currentPlayer + 1) % players.length;
}

function createGrid(size) {
    for (let i = 1; i < grid_size; i++) {
        const start_v = createVector(width / grid_size * i, 0 + grid_padding);
        const end_v = createVector(width / grid_size * i, height - grid_padding);
        const start_h = createVector(0 + grid_padding, height / grid_size * i);
        const end_h = createVector(width - grid_padding, height / grid_size * i);
        if (i % 2 == 0) {
            grid_lines.push(new AnimatedLine(end_v, start_v, color(246, 233, 233, 240), grid_width))
            grid_lines.push(new AnimatedLine(end_h, start_h, color(246, 233, 233, 240), grid_width))
        }
        else {
            grid_lines.push(new AnimatedLine(start_v, end_v, color(246, 233, 233, 240), grid_width))
            grid_lines.push(new AnimatedLine(start_h, end_h, color(246, 233, 233, 240), grid_width))
        }
    }
}

function drawGrid() {
    for (let line of grid_lines) {
        line.draw()
    }
}

function updateGrid(size) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let spot = board[i][j];
            if (spot) spot.draw();
        }
    }
}

function draw() {
    background(68, 55, 55);

    drawGrid();

    updateGrid(grid_size);

    if (winning_line) winning_line.draw();

    if (!game_over) {
        let result = checkWinner();
        if (result != null) {
            game_over = true;
            let resultP = createP('');
            resultP.style('font-size', '32pt');
            if (result == 'tie') {
                resultP.html("Tie!")
            } else {
                resultP.html(`${result} wins!`);
            }
        }
    }
}