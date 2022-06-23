let p5sketch = (sketch) => {
    let game;
    let resultP;

    sketch.setup = () => {
        sketch.createCanvas(400, 400);
        sketch.frameRate(60);
        game = new TicTacToe(sketch, player1);
        resultP = sketch.createP(' ');
        resultP.style('font-size', '26pt');
    }

    sketch.mousePressed = () => {
        let i = Math.floor(sketch.mouseX / (sketch.width / game.gridSize));
        let j = Math.floor(sketch.mouseY / (sketch.width / game.gridSize));
        if (i >= game.gridSize || j >= game.gridSize || i < 0 || j < 0) return;
        if (game.checkIfEmpty(i, j)) {
            game.nextTurn(i, j);
        }
    }

    sketch.draw = () => {
        sketch.background(206, 226, 233);
        game.draw();

        if (!game.gameOver) {
            let result = game.checkWinner();
            if (result != null) {
                game.gameOver = true;
                if (result == 'tie') {
                    resultP.html("Tie!")
                } else {
                    resultP.html(`${result} wins!`);
                }
            }
        }
    }
}
