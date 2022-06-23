class Cross extends Piece {

	constructor(sketch, x, y, r) {
		super(sketch, x, y, r);
		this.symbol = Cross.symbol;
	}

	draw() {
		const size = 15;
		const center = this.getCenter();
		const top_left = this.sketch.createVector(center.x - this.r * 0.5 + size, center.y - this.r * 0.5 + size);
		const top_right = this.sketch.createVector(center.x + this.r * 0.5 - size, center.y - this.r * 0.5 + size);
		const bottom_left = this.sketch.createVector(center.x - this.r * 0.5 + size, center.y + this.r * 0.5 - size);
		const bottom_right = this.sketch.createVector(center.x + this.r * 0.5 - size, center.y + this.r * 0.5 - size);

		const value = this.entry_animation.value();

		this.sketch.strokeWeight(8);
		this.sketch.stroke(255, 128, 51);

		const l1_end = p5.Vector.lerp(top_left, bottom_right, Math.min(1, value * 2));
		this.sketch.line(
			top_left.x, top_left.y,
			l1_end.x, l1_end.y
		);

		if (value > 0.5) {
			const l2_end = p5.Vector.lerp(top_right, bottom_left, Math.max(0, value * 2 - 1));
			this.sketch.line(
				top_right.x, top_right.y,
				l2_end.x, l2_end.y
			);
		}
		this.sketch.stroke(0);
		this.sketch.strokeWeight(1);
	}

}

Cross.symbol = "X";