class Piece {

    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.entry_animation = new Animation(500);
    }

    // Each Piece should override this method
    draw() {
        console.log('NOT IMPLEMENTED!');
    }

    getCenter() {
        return createVector(
            (this.x + 0.5) * this.r * 2,
            (this.y + 0.5) * this.r * 2
        );
    }

}