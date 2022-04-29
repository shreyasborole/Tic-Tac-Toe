class Animation {

    constructor(duration_ms) {
        this.start = millis();
        this.duration = duration_ms;
    }

    value() {
        let value = (millis() - this.start) / this.duration;
        this.finished = value >= 1.0;
        if (this.finished) return 1.0;
        return 0.5 - cos(PI * value) * 0.5;
    }

}