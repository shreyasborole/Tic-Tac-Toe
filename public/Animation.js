class Animation {
	#sketch;

	constructor(sketch, duration_ms) {
		this.#sketch = sketch;
		this.start = this.#sketch.millis();
		this.duration = duration_ms;
	}

	value() {
		let value = (this.#sketch.millis() - this.start) / this.duration;
		this.finished = value >= 1.0;
		if (this.finished) return 1.0;
		return 0.5 - Math.cos(Math.PI * value) * 0.5;
	}

}