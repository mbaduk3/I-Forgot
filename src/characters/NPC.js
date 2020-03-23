class NPC extends Phaser.GameObjects.GameObject {

    constructor(name, scene, x, y, id) {
        super(scene, 'npc');
        this.name = name;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.canInteract = false;
        this.dialogPointer = 0;
        this.npcId = id;
    }

    static preload(scene, name) {
        scene.load.spritesheet(name + '_sheet', 'assets/Sprites/' + name + '.png', {frameWidth: 16, frameHeight: 16});
        scene.load.json(name + '_json', 'assets/Dialog/' + name + '.json');
    }

    create() {
        // Interact
        this.interact_sprite = this.scene.add.sprite(this.x, this.y - 16, 'interact');
        this.interact_sprite.play('interact');
        this.interact_sprite.setVisible(false);
        this.interact_sprite.depth = 1000;

        // Input key
        this.key_x = this.scene.input.keyboard.addKey("x");

        // Physics
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.name + '_sprite_' + this.id);
        this.sprite.body.setSize(10, 8);
        this.sprite.body.setOffset(3, 8);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.depth = this.sprite.y;
        this.sprite.parent = this;

        // Anims
        this.scene.anims.create({
            key: this.name + '_walk_down',
            frames: this.scene.anims.generateFrameNames(this.name + '_sheet', {start:0, end:3}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_idle_down',
            frames: this.scene.anims.generateFrameNames(this.name + '_sheet', {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_walk_left',
            frames: this.scene.anims.generateFrameNames(this.name + '_sheet', {start:4, end:7}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_idle_left',
            frames: this.scene.anims.generateFrameNames(this.name + '_sheet', {start: 5, end: 5}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_walk_up',
            frames: this.scene.anims.generateFrameNames(this.name + '_sheet', {start:8, end:11}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_idle_up',
            frames: this.scene.anims.generateFrameNames(this.name + '_sheet', {start: 9, end: 9}),
            frameRate: 8,
            repeat: -1
        });
        this.sprite.play(this.name + '_walk_left');

        // Dialog
        this.dialog = this.scene.cache.json.get(this.name + '_json');
    }

    update() {
        if (this.canInteract) {
            this.interact_sprite.setVisible(true);
            if (Phaser.Input.Keyboard.JustDown(this.key_x)) {
                this.interact();
            }
        } else {
            this.interact_sprite.setVisible(false);
        }
    }

    interact() {
        console.log(this.dialog.text[this.dialogPointer]);
        this.dialogPointer = this.dialogPointer + 1;
        if (this.dialogPointer >= this.dialog.text.length) {
            this.dialogPointer = 0;
        }
    }

}

export default NPC;