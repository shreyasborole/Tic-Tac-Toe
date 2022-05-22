let p5sketch = (sketch) => {
    let game;
    let socket;

    let symbol;
    let myTurn = true;

    let status;
    let lobbyCode;

    sketch.setup = () => {
        sketch.createCanvas(400, 400);
        sketch.frameRate(60);

        status = sketch.createP('');
        status.style('font-size', '26pt');
        lobbyCode = sketch.createP('');
        lobbyCode.style('font-size', '26pt');
        lobbyCode.html(code);

        game = new TicTacToe(sketch, player);

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

            // // If the game is still going, show who's turn it is
            // if (!isGameOver()) {
            //     renderTurnMessage();

            //     // If the game is over
            // } else {
            //     // Show the message for the loser
            //     if (myTurn) {
            //         status.html('Game Over! You lost');
            //     } else {
            //     // Show the message for the winner
            //         status.html('Game Over! You won');
            //     }

            // Disable the board
            // $(".board button").attr("disabled", true);
        }
        );

        // Set up the initial state when the game begins
        socket.on("game.begin", (data) => {
            // The server will assign X or O to the player
            symbol = data.symbol;

            // Give X the first turn
            myTurn = symbol === "X";
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
    }

    sketch.mousePressed = () => {
        if (!myTurn) return;
        let i = Math.floor(sketch.mouseX / (sketch.width / game.gridSize));
        let j = Math.floor(sketch.mouseY / (sketch.width / game.gridSize));
        if (i >= game.gridSize || j >= game.gridSize || i < 0 || j < 0) return;
        if (game.checkIfEmpty(i, j)) {
            // if (game.currentPlayer != player) return;
            // socket.emit('position', { posx: i, posy: j });
            // game.nextTurn(i, j);
            makeMove({ x: i, y: j });
        }
    }

    sketch.draw = () => {
        sketch.background(68, 55, 55);
        game.draw();

        if (!game.gameOver) {
            let result = game.checkWinner();
            if (result != null) {
                game.gameOver = true;
                let resultP = sketch.createP('');
                resultP.style('font-size', '32pt');
                if (result == 'tie') {
                    resultP.html("Tie!")
                } else {
                    resultP.html(`${result} wins!`);
                }
            }
        }
    }
}
