let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

let human1 = ['O1', 'O2'];
let human2 = ['X1', 'X2'];
let currentPlayer = human1[0];

let status;
let socket;

let symbol;
let myTurn = false;

function setup() {
    createCanvas(420, 420);
    w = width / 3;
    h = height / 3;
    status = createP('');
    status.style('font-size', '26pt');
    status.html('Current player: ' + currentPlayer);
    socket = io.connect('http://localhost:3000');

    socket.emit('game.code', { host: isHost, lobbyCode: code });

    socket.on('game.invalid.code', () => {
        lobbyCode.html('Invalid code');
    });

    // Event is called when either player makes a move
    socket.on("move.made", (data) => {
        // Render the move
        game.nextTurn(data.position.x, data.position.y);

        // If the symbol is the same as the player's symbol,
        // we can assume it is their turn
        myTurn = data.symbol !== symbol;

        if (!game.gameOver) renderTurnMessage();
    }
    );

    // Set up the initial state when the game begins
    socket.on("game.begin", (data) => {
        // The server will assign X or O to the player
        symbol = data.symbol;

        // Give X the first turn
        myTurn = symbol === "O";
        renderTurnMessage();
    });

    // Disable the board if the opponent leaves
    socket.on("opponent.left", () => {
        status.html('Your opponent left the game');
    });

}

makeMove = (pos) => {
    // Emit the move to the server
    socket.emit("make.move", {
        symbol: symbol,
        position: pos
    });
}

renderTurnMessage = () => {
    // Disable the board if it is the opponents turn
    if (!myTurn) {
        status.html("Your opponent's turn");
        // Enable the board if it is your turn
    } else {
        status.html("Your turn");
    }
    let result = game.checkWinner();
    if (result != null) {
        game.gameOver = true;
        status.html(`${result} wins!`);
    }
}

function draw() {
    background(206, 226, 233);
    let w = width / 3;
    let h = height / 3;

    /*stroke(0);
    line(0, w, width, h);
    stroke(0);
    line(0, w * 2, width, h * 2);
    stroke(0);
    line(w, 0, w, height);
    stroke(0);
    line(w * 2, 0, w * 2, height);*/
    noStroke();
    fill(0, 0, 0);
    rect(135, 5, 10, 410, 20);
    rect(265, 5, 10, 410, 20);
    rect(5, 145, 410, 10, 20);
    rect(5, 275, 410, 10, 20);

    noLoop();

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[i][j];
            strokeWeight(6);
            if (spot == human1[0]) {
                noFill();
                stroke(255, 128, 51);
                ellipseMode(CENTER);
                ellipse(x, y, w / 2);
            }
            if (spot == human1[1]) {
                noFill();
                stroke(255, 0, 0);
                ellipseMode(CENTER);
                ellipse(x, y, w / 2);
            }
            if (spot == human2[0]) {
                let c = w / 4;

                stroke(255, 128, 51);
                line(x - c, y - c, x + c, y + c);
                stroke(255, 128, 51);
                line(x + c, y - c, x - c, y + c);
            }
            if (spot == human2[1]) {
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

function mousePressed() {
    if(!myTurn) return;
    if (currentPlayer == human1[0]) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '') {
            board[i][j] = human1[0];
            if (checkWinner() == null) {
                currentPlayer = human2[0];
                
            }
        }
    }
    if (currentPlayer == human1[1]) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '' || board[i][j] == human2[0]) {
            board[i][j] = human1[1];
            if (checkWinner() == null || checkWinner() == "tie") {
                currentPlayer = human2[1];

            }
        }
    }

    if (currentPlayer == human2[0]) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '') {
            board[i][j] = human2[0];
            if (checkWinner() == null) {
                currentPlayer = human1[1];

            }
        }
    }
    if (currentPlayer == human2[1]) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[i][j] == '' || board[i][j] == human1[0]) {
            board[i][j] = human2[1];
            if (checkWinner() == null || checkWinner() == "tie") {
                currentPlayer = human1[0];

            }
        }
    }
    status.html('Current player: ' + currentPlayer);
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
        if (currentPlayer == human1[0] || currentPlayer == human2[0]) {
            available = 0;
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                    if (board[i][j] == '')
                        available++;
                }
            }
        }

        if (currentPlayer == human1[1]) {
            available = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] != '' || board[i][j] == human2[0])
                        available++;
                }
            }
        }

        if (currentPlayer == human2[1]) {
            available = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] != '' || board[i][j] == human1[0])
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