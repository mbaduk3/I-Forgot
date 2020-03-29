class Player {

    /* 
    TODO: Make the player object transferable between scenes.
    */

    constructor(scene, x, y) {
        this.scene = scene;
        this.prevScene = null;
        this.direction = "down";
        this.speed = 130;
        this.state = "idle";
        this.cur_keys = scene.input.keyboard.createCursorKeys();
        this.x = x;
        this.y = y;
        this.justSpawned = true;
        this.targetSpawn = null;
    }

    static preload(scene) {
        scene.load.spritesheet('hedgehog_sheet', 'assets/Sprites/Hedgehog.png', {frameWidth: 16, frameHeight: 16});
    }

    create() {

        // Physics
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'hedgehog_sheet');
        this.scene.playerSprite = this.sprite;
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


        // Interact rec 
        this.interactRect = this.scene.add.rectangle(this.sprite.x, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height);
        this.scene.physics.add.existing(this.interactRect);
        this.interactRect.body.setOffset(this.interactRect.width / 2, this.interactRect.height / 2);

        // Input keys
        this.cur_keys = this.scene.input.keyboard.createCursorKeys();
    }

    update() {
        // Update depth
        this.sprite.depth = this.sprite.y;

        if (this.justSpawned) {
            this.sprite = this.scene.playerSprite;
            this.cur_keys = this.scene.input.keyboard.createCursorKeys();
        }

        // Update interact rect
        switch (this.direction) {
            case "up":
                this.interactRect.setPosition(this.sprite.x - this.sprite.width / 2, this.sprite.y - this.sprite.height);
                break;
            case "down":
                this.interactRect.setPosition(this.sprite.x - this.sprite.width / 2, this.sprite.y + this.sprite.height / 2);
                break;
            case "left": 
                this.interactRect.setPosition(this.sprite.x - this.sprite.width - 5, this.sprite.y - this.sprite.height / 2);
                break;
            case "right": 
                this.interactRect.setPosition(this.sprite.x + 5, this.sprite.y - this.sprite.height / 2);
                break;
        }

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

        // Does the player position need to be reset (just spawned)?
        if (this.justSpawned && this.targetSpawn != null) {
            let spawn = this.scene.playerSpawns[this.targetSpawn]
            this.x = spawn.x;
            this.sprite.x = spawn.x;
            this.y = spawn.y;
            this.sprite.y = spawn.y;
            this.state = "idle";
            this.sprite.setVelocity(0, 0);
            this.justSpawned = false;
        } else {
            // Check portals collisions 
            this.scene.portalsArr.forEach((portal) => {
                if (Phaser.Geom.Rectangle.Overlaps(this.sprite.getBounds(), portal)) {
                    this.justSpawned = true;
                    let old_scene = this.scene;
                    this.prevScene = old_scene;
                    this.scene = this.scene.scene.get(portal.to_room);
                    this.targetSpawn = portal.to_spawn;
                    // Before we put to sleep, reset all input.
                    old_scene.scene.run(portal.to_room);
                    old_scene.scene.sleep(old_scene.name);
                }
            });
        }

    }

}

export default Player;