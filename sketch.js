let game = null;

function setup() {
    createCanvas(400, 400);
    frameRate(60);
	game = new TicTacToe(player1);
}

function mousePressed() {
    let i = floor(mouseX / (width / game.gridSize));
    let j = floor(mouseY / (width / game.gridSize));
    if (i >= game.gridSize || j >= game.gridSize) return;
	game.nextTurn(i, j);
}

function draw() {
    background(68, 55, 55);

	game.draw();

    if (!game.gameOver) {
        let result = game.checkWinner();
        if (result != null) {
            game.gameOver = true;
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