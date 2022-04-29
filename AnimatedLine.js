class AnimatedLine {

	constructor(start, end, color = color(0, 0, 0), weight = 1) {
		this.start = p5.Vector.sub(start, p5.Vector.mult(p5.Vector.sub(end, start), 0.2));
		this.end = p5.Vector.sub(end, p5.Vector.mult(p5.Vector.sub(start, end), 0.2));
		this.entry_animation = new Animation(1200);
		this.color = color;
		this.weight = weight;
	}

	draw() {
		const end = p5.Vector.lerp(this.start, this.end, this.entry_animation.value());
		strokeWeight(this.weight);
		stroke(this.color);
		line(
			this.start.x, this.start.y,
			end.x, end.y
		);
		strokeWeight(1);
	}

}