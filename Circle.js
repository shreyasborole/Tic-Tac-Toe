class Circle extends Piece {

	constructor(x, y, r) {
		super(x, y, r);
		this.symbol = Circle.symbol;
	}

	draw() {
		const size = 15;
		noFill();
		strokeWeight(8);
		stroke(255, 77, 77);
		const center = this.getCenter();
		arc(center.x, center.y, this.r - size, this.r - size, -HALF_PI, TWO_PI * this.entry_animation.value() - HALF_PI, OPEN);
		strokeWeight(1);
	}

}

Circle.symbol = "O";