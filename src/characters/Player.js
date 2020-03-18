class Player {

    constructor(scene) {
        this.scene = scene;
        this.direction = "down";
        this.speed = 130;
        this.state = "idle";
        this.cur_keys = scene.input.keyboard.createCursorKeys();
    }

    preload() {
        this.scene.load.spritesheet('hedgehog_sheet', 'assets/Hedgehog.png', {frameWidth: 16, frameHeight: 16});
    }

    create() {

        // Physics
        this.sprite = this.scene.physics.add.sprite(100, 100, 'hedgehog_sheet');
        this.sprite.body.setSize(10, 8);
        this.sprite.body.setOffset(3, 8);
        this.sprite.setCollideWorldBounds(true);

        // Animations 
        this.scene.anims.create({
            key: 'hedgehog_walk_down',
            frames: this.scene.anims.generateFrameNames('hedgehog_sheet', {start:0, end:3}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'hedgehog_idle_down',
            frames: this.scene.anims.generateFrameNames('hedgehog_sheet', {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'hedgehog_walk_left',
            frames: this.scene.anims.generateFrameNames('hedgehog_sheet', {start:4, end:7}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'hedgehog_idle_left',
            frames: this.scene.anims.generateFrameNames('hedgehog_sheet', {start: 5, end: 5}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'hedgehog_walk_up',
            frames: this.scene.anims.generateFrameNames('hedgehog_sheet', {start:8, end:11}),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'hedgehog_idle_up',
            frames: this.scene.anims.generateFrameNames('hedgehog_sheet', {start: 9, end: 9}),
            frameRate: 8,
            repeat: -1
        });
        this.sprite.play('hedgehog_idle_down');
        
    }

    update() {

        // Handle input
        if (!this.cur_keys.up.isDown && !this.cur_keys.down.isDown && !this.cur_keys.left.isDown && !this.cur_keys.right.isDown) {
            this.state = "idle";
        } else {
            this.state = "walk";
            if (Phaser.Input.Keyboard.JustDown(this.cur_keys.up)) {
                this.direction = "up";
            }
            else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.down)) {
                this.direction = "down";
            }
            else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.left)) {
                this.direction = "left";
            }
            else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.right)) {
                this.direction = "right";
            }
        }

        // Update anims
        if (this.state == "idle") {
            this.sprite.setVelocity(0, 0);
            switch (this.direction) {
                case "up":
                    this.sprite.play('hedgehog_idle_up', true);
                    break;
                case "down":
                    this.sprite.play('hedgehog_idle_down', true);
                    break;
                case "left":
                    this.sprite.play('hedgehog_idle_left', true);
                    this.sprite.setFlipX(false);
                    break;
                case "right":
                    this.sprite.play('hedgehog_idle_left', true);
                    this.sprite.setFlipX(true);
                    break;
            }
        } else if (this.state == "walk") {
            switch (this.direction) {
                case "up":
                    this.sprite.play('hedgehog_walk_up', true);
                    this.sprite.setVelocity(0, -this.speed);
                    break;
                case "down":
                    this.sprite.play('hedgehog_walk_down', true);
                    this.sprite.setVelocity(0, this.speed);
                    break;
                case "left":
                    this.sprite.play('hedgehog_walk_left', true);
                    this.sprite.setVelocity(-this.speed, 0);
                    this.sprite.setFlipX(false);
                    break;
                case "right":
                    this.sprite.play('hedgehog_walk_left', true);
                    this.sprite.setVelocity(this.speed, 0);
                    this.sprite.setFlipX(true);
                    break;
            }
        }
    }

    setState(state) {
        this.state = state;
    }

    setDirection(dir) {
        this.direction = dir;
    }


}

export default Player