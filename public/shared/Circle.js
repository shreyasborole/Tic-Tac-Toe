class Circle extends Piece {

	constructor(sketch, x, y, r) {
		super(sketch, x, y, r);
		this.symbol = Circle.symbol;
	}

	draw() {
		const size = 15;
		this.sketch.noFill();
		this.sketch.strokeWeight(8);
		this.sketch.stroke(255, 77, 77);
		const center = this.getCenter();
		this.sketch.arc(center.x, center.y, this.r - size, this.r - size, -this.sketch.HALF_PI, this.sketch.TWO_PI * this.entry_animation.value() - this.sketch.HALF_PI, this.sketch.OPEN);
		this.sketch.strokeWeight(1);
	}

}

Circle.symbol = "O";