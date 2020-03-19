
class BearNPC {
    
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    preload() {
        this.scene.load.spritesheet('bear_sheet', 'assets/Bear.png', {frameWidth: 16, frameHeight: 16});
    }

    create() {
        // Physics
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'bear_sheet');
        this.sprite.body.setSize(10, 8);
        this.sprite.body.setOffset(3, 8);
        this.sprite.setCollideWorldBounds(true);

        // Anims
        this.scene.anims.create({
            key: 'bear_walk_down',
            frames: this.scene.anims.generateFrameNames('bear_sheet', {start:0, end:3}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'bear_idle_down',
            frames: this.scene.anims.generateFrameNames('bear_sheet', {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'bear_walk_left',
            frames: this.scene.anims.generateFrameNames('bear_sheet', {start:4, end:7}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'bear_idle_left',
            frames: this.scene.anims.generateFrameNames('bear_sheet', {start: 5, end: 5}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'bear_walk_up',
            frames: this.scene.anims.generateFrameNames('bear_sheet', {start:8, end:11}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'bear_idle_up',
            frames: this.scene.anims.generateFrameNames('bear_sheet', {start: 9, end: 9}),
            frameRate: 8,
            repeat: -1
        });
        this.sprite.play('bear_walk_left');
    }

    update() {}
}

export default BearNPC