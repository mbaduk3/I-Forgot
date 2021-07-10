import { assets, constAnims } from '../constants/GameConstants'

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
        this.speed = 30;
        this.state = "idle";
        this.direction = "down";
    }

    static preload(scene, name) {
        scene.load.spritesheet(name + '_sheet', 'assets/Sprites/' + name + '.png', {frameWidth: 16, frameHeight: 16});
        scene.load.json(name + '_json', 'assets/Dialog/' + name + '.json');
    }

    create() { 
        // Interact
        this.interact_sprite = this.scene.physics.add.sprite(this.x, this.y - 16, assets.INTERACT_X);
        this.interact_sprite.play(constAnims.INTERACT_X);
        this.interact_sprite.setVisible(false);
        this.interact_sprite.depth = 1000;

        // Input key
        this.key_x = this.scene.input.keyboard.addKey("x");

        // Physics
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, this.name + '_sprite_' + this.id);
        this.sprite.play(this.name + '_idle_down', true);

        // Dialog
        this.dialog = this.scene.cache.json.get(this.name + '_json');

        // Random walk
        let delay = Math.floor(Math.random() * 2000);
        let startAt = Math.floor(Math.random() * delay);
        let randomWalkConfig = {
            delay: delay,
            startAt: startAt,
            loop: true,
            callback: () => this.randomWalk()
        }
        this.scene.time.addEvent(randomWalkConfig);
    }

    /* 
        Phaser wipes npc data after you add it to a group? So this sets stuff 
        after it is added.
    */
    afterGroupCreate() {
        this.sprite.body.setSize(10, 8);
        this.sprite.body.setOffset(3, 8);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.immovable = true;
        // this.sprite.body.setOffset(11, 16);

        this.sprite.depth = this.sprite.y;
        this.sprite.parent = this;
    }

    update(time, delta) {

        this.sprite.preUpdate(time, delta);
        this.interact_sprite.preUpdate(time, delta);
        
        if (this.canInteract) {
            this.interact_sprite.setVisible(true);
            if (Phaser.Input.Keyboard.JustDown(this.key_x)) {
                this.interact();
            }
        } else {
            this.interact_sprite.setVisible(false);
        }

        // Update anims
        let mod_direction= this.direction;
        if (this.direction === "right") mod_direction = "left";
        this.sprite.play(this.name + "_" + this.state+ "_" + mod_direction, true);
        if (this.direction === "right") {
            this.sprite.setFlipX(true);
        } else if (this.direction === "left") {
            this.sprite.setFlipX(false);
        }

        this.interact_sprite.setPosition(this.sprite.x, this.sprite.y - 16);
    }

    interact() {
        console.log(this.dialog.text[this.dialogPointer]);
        this.dialogPointer = this.dialogPointer + 1;
        if (this.dialogPointer >= this.dialog.text.length) {
            this.dialogPointer = 0;
        }
    }

    randomWalk() {
        this.state = "idle";
        this.sprite.setVelocity(0, 0);
        let move = Math.floor(Math.random() * 2);
        if (move == 1) {
            this.state = "walk";
            let dir = Math.floor(Math.random() * 5);
            switch (dir) {
                case 0: // Left
                    this.sprite.setVelocity(-this.speed, 0);
                    this.direction = "left";
                    break;
                case 1: // Right
                    this.sprite.setVelocity(this.speed, 0);
                    this.direction = "right";
                    break;
                case 2: // Up
                    this.sprite.setVelocity(0, -this.speed);
                    this.direction = "up";
                    break;
                case 3: // Down
                    this.sprite.setVelocity(0, this.speed);
                    this.direction = "down";
                    break;
            }
        }
        this.sprite.depth = this.sprite.y;
    }

    static createAnims(scene, name) {
        scene.anims.create({
            key: name + '_walk_down',
            frames: scene.anims.generateFrameNumbers(name + '_sheet', {start:0, end:3}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: name + '_idle_down',
            frames: scene.anims.generateFrameNames(name + '_sheet', {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: name + '_walk_left',
            frames: scene.anims.generateFrameNames(name + '_sheet', {start:4, end:7}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: name + '_idle_left',
            frames: scene.anims.generateFrameNames(name + '_sheet', {start: 5, end: 5}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: name + '_walk_up',
            frames: scene.anims.generateFrameNames(name + '_sheet', {start:8, end:11}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: name + '_idle_up',
            frames: scene.anims.generateFrameNames(name + '_sheet', {start: 9, end: 9}),
            frameRate: 8,
            repeat: -1
        });
    }

}

export default NPC;