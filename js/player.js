class Player extends Cube {
    constructor(options) {
        super(options);
        this.setColor('#dc265a');
        this.setScale(128, 128, 128);
        this.setStatic(false);
        this.mass = 5;
    }
}