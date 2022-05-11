let p5sketch = (sketch) => {
    let game;
    let socket;

    sketch.setup = () => {
        sketch.createCanvas(400, 400);
        sketch.frameRate(60);
        socket = io.connect('http://localhost:3000');
        socket.on('position', (data) => game.nextTurn(data.posx, data.posy));
        game = new TicTacToe(sketch, player);
    }

    sketch.mousePressed = () => {
        let i = Math.floor(sketch.mouseX / (sketch.width / game.gridSize));
        let j = Math.floor(sketch.mouseY / (sketch.width / game.gridSize));
        if (i >= game.gridSize || j >= game.gridSize || i < 0 || j < 0) return;
        if(game.checkIfEmpty(i, j)){
            if(game.currentPlayer != player) return;
            socket.emit('position', { posx: i, posy: j });
            game.nextTurn(i, j);
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
