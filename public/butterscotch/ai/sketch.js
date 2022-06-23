let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

let human = ['O1', 'O2'];
let ai = ['X1', 'X2'];
let currentPlayer = human[0];
let w;
let h;

let status;

function setup() {
    createCanvas(420, 420);
    w = width / 3;
    h = height / 3;
    bestMove();
    status = createP('');
    status.style('font-size', '26pt');
    status.html('Current player: ' + currentPlayer);
}

function mousePressed() {
    if (currentPlayer == human[0]) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '') {
            board[i][j] = human[0];
            if (checkWinner() == null) {
                currentPlayer = ai[0];
                bestMove();
            }
        }
    }
    if (currentPlayer == human[1]) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '' || board[i][j] == ai[0]) {
            board[i][j] = human[1];
            if (checkWinner() == null || checkWinner() == "tie") {
                currentPlayer = ai[1];
                bestMove();
            }
        }
    }
    status.html('Current player: ' + currentPlayer);
}

//minimax
let scores = {
    X1: 10,
    X2: 10,
    O1: -10,
    O2: -10,
    tie: 0
}

function bestMove() {
    //AI[0]'s turn
    if (currentPlayer == ai[0]) {
        let bestScore = -Infinity;
        let move;
        console.log("a0");
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    value = board[i][j];
                    board[i][j] = ai[0];
                    let score = minimax(board, 0, false, ai[0]);
                    console.log("score at " + i, j + " in a1 is " + score);
                    board[i][j] = value;
                    if (score > bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                }
            }
        }
        board[move.i][move.j] = ai[0];
        if (checkWinner() == null || checkWinner() == "tie")
            currentPlayer = human[1];
    }

    //AI[1]'s turn
    if (currentPlayer == ai[1]) {
        let bestScore = -Infinity;
        let move;
        console.log("a1");
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == human[0] || board[i][j] == '') {
                    value = board[i][j];
                    board[i][j] = ai[1];
                    let score = minimax(board, 0, false, ai[1]);
                    console.log("score at " + i, j + " in a1 is " + score);
                    board[i][j] = value;
                    if (score > bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                }
            }
        }
        board[move.i][move.j] = ai[1];
        if (checkWinner() == null)
            currentPlayer = human[0];
    }
}

function equals3(a, b, c) {
    if (a == 'X1' || a == 'X2')
        a = 'X';

    if (a == 'O1' || a == 'O2')
        a = 'O';

    if (b == 'X1' || b == 'X2')
        b = 'X';

    if (b == 'O1' || b == 'O2')
        b = 'O';

    if (c == 'X1' || c == 'X2')
        c = 'X';

    if (c == 'O1' || c == 'O2')
        c = 'O';

    return (a == b && b == c && a != "");
}

function checkWinner() {

    let winner = null;

    //horizontal
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }

    //vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    //diagonal1
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    //diagonal2
    if (equals3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
    }

    let available;
    if (winner == null) {
        if (currentPlayer == human[0] || currentPlayer == ai[0]) {
            available = 0;
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                    if (board[i][j] == '')
                        available++;
                }
            }
        }

        if (currentPlayer == human[1]) {
            available = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] != '' || board[i][j] == ai[0])
                        available++;
                }
            }
        }

        if (currentPlayer == ai[1]) {
            available = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] != '' || board[i][j] == human[0])
                        available++;
                }
            }
        }
    }

    if (winner == null && available == 0) {
        return 'tie';
    } else {
        return winner;
    }
}

function draw() {
    background(206, 226, 233);
    let w = width / 3;
    let h = height / 3;

    noStroke();
    fill(0, 0, 0);
    rect(135, 5, 10, 410, 20);
    rect(265, 5, 10, 410, 20);
    rect(5, 145, 410, 10, 20);
    rect(5, 275, 410, 10, 20);
    /*
    stroke(0);
    line(0, w, width, h);
    stroke(0);
    line(0, w * 2, width, h * 2);
    stroke(0);
    line(w, 0, w, height);
    stroke(0);
    line(w * 2, 0, w * 2, height);*/

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            if (spot == human[0]) {
                noFill();
                stroke(255, 128, 51);
                ellipseMode(CENTER);
                ellipse(x, y, w / 2);
            }
            strokeWeight(6);
            if (spot == human[1]) {
                noFill();
                stroke(255, 0, 0);
                ellipseMode(CENTER);
                ellipse(x, y, w / 2);
            }
            if (spot == ai[0]) {
                let c = w / 4;
                stroke(255, 128, 51);
                line(x - c, y - c, x + c, y + c);
                stroke(255, 128, 51);
                line(x + c, y - c, x - c, y + c);
            }
            if (spot == ai[1]) {
                let c = w / 4;
                stroke(255, 0, 0);
                line(x - c, y - c, x + c, y + c);
                stroke(255, 0, 0);
                line(x + c, y - c, x - c, y + c);
            }
        }
    }
    let result = checkWinner();
    if (result != null) {
        noLoop();
        createP(result === 'tie' ? 'tie' : result + ' won').style('color', '#DE3163').style('font-size', '32pt');
    }
    //bestMove();
}

function minimax(board, depth, isMaximizing, player) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (player == ai[0]) {
        if (isMaximizing) {
            let bestScore = -Infinity;
            let value;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == '') {
                        value = board[i][j];
                        board[i][j] = ai[0];
                        let score = minimax(board, depth + 1, false, ai[0]);
                        board[i][j] = value;
                        bestScore = max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            let value;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == human[0] || board[i][j] == '') {
                        value = board[i][j];
                        board[i][j] = human[1];
                        let score = minimax(board, depth + 1, true, ai[0]);
                        board[i][j] = value;
                        bestScore = min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }
    if (player == ai[1]) {
        if (isMaximizing) {
            let bestScore = -Infinity;
            let value;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == human[0] || board[i][j] == '') {
                        value = board[i][j];
                        board[i][j] = ai[1];
                        let score = minimax(board, depth + 1, false, ai[1]);
                        board[i][j] = value;
                        bestScore = max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] == '') {
                        board[i][j] = human[0];
                        let score = minimax(board, depth + 1, true, ai[1]);
                        board[i][j] = '';
                        bestScore = min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }
}
//minimax end