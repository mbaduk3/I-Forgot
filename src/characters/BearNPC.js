
class BearNPC extends Phaser.GameObjects.GameObject {
    
    constructor(scene, x, y) {
        super(scene, 'npc');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.canInteract = false;
    }

    static preload(scene) {
        scene.load.spritesheet('bear_sheet', 'assets/Bear.png', {frameWidth: 16, frameHeight: 16});
    }

    create() {
        // Interact
        this.interact_sprite = this.scene.add.sprite(this.x, this.y - 16, 'interact');
        this.interact_sprite.play('interact');
        this.interact_sprite.setVisible(false);

        // Physics
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'bear_sheet');
        this.sprite.body.setSize(10, 8);
        this.sprite.body.setOffset(3, 8);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.depth = this.sprite.y;
        this.sprite.parent = this;

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

    update() {
        if (this.canInteract) {
            this.interact_sprite.setVisible(true);
        } else {
            this.interact_sprite.setVisible(false);
        }
    }
}

export default BearNPC