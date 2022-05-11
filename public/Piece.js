class Piece {
    constructor(sketch, x, y, r) {
        this.sketch = sketch;
        this.x = x;
        this.y = y;
        this.r = r;
        this.entry_animation = new Animation(this.sketch, 500);
    }

    // Each Piece should override this method
    draw() {
        console.log('NOT IMPLEMENTED!');
    }

    getCenter() {
        return this.sketch.createVector(
            (this.x + 0.5) * this.r * 2,
            (this.y + 0.5) * this.r * 2
        );
    }

}