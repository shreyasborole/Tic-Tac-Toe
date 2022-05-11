class AnimatedLine {
	#sketch;

	constructor(sketch, start, end, color = color(0, 0, 0), weight = 1) {
		this.#sketch = sketch;
		this.start = p5.Vector.sub(start, p5.Vector.mult(p5.Vector.sub(end, start), 0.2));
		this.end = p5.Vector.sub(end, p5.Vector.mult(p5.Vector.sub(start, end), 0.2));
		this.entry_animation = new Animation(this.#sketch, 1200);
		this.color = color;
		this.weight = weight;
	}

	draw() {
		const end = p5.Vector.lerp(this.start, this.end, this.entry_animation.value());
		this.#sketch.strokeWeight(this.weight);
		this.#sketch.stroke(this.color);
		this.#sketch.line(
			this.start.x, this.start.y,
			end.x, end.y
		);
		this.#sketch.strokeWeight(1);
	}

}