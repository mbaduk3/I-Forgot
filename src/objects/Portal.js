class Portal extends Phaser.Geom.Rectangle {

    constructor(x, y, width, height, to_room, to_spawn) {
        super(x, y, width, height);
        this.to_room = to_room;
        this.to_spawn = to_spawn;
    }

}

export default Portal