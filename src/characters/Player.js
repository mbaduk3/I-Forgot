import { assets, constAnims } from '../constants/GameConstants'

/*
    The player object is tranferable across rooms, but for each room it maintains
    a new copy of its arcade sprite and interact rect (ie. physics objects). 
*/
class Player {

    constructor(scene, x, y) {
        this.scene = scene;
        this.prevScene = null;
        this.direction = "down";
        this.speed = 130;
        this.state = "idle";
        this.x = x;
        this.y = y;
        this.justSpawned = true;
        this.targetSpawn = null;
        this.inTransition = false;
    }

    // Adds the player to the scene's current room. 
    create() {

        // Physics
        this.sprite = this.scene.physics.add.sprite(this.x, this.y, assets.PLAYER_SPRITESHEET);
        this.sprite.body.debugShowBody = true;
        this.scene.playerSprite = this.sprite;
        this.sprite.body.setSize(10, 8);
        this.sprite.body.setOffset(3, 8);
        this.sprite.setCollideWorldBounds(true);

        this.sprite.play(constAnims.PLAYER.WALK_DOWN, true);


        // Interact rect
        this.interactRect = this.scene.add.rectangle(this.sprite.x, this.sprite.y + this.sprite.height / 2, this.sprite.width, this.sprite.height);
        this.scene.physics.add.existing(this.interactRect);
        this.interactRect.body.setOffset(this.interactRect.width / 2, this.interactRect.height / 2);
        this.scene.interactRect = this.interactRect;

        // Keyboard input
        this.cur_keys = {
            up: this.scene.keys.key_up,
            down: this.scene.keys.key_down,
            left: this.scene.keys.key_left,
            right: this.scene.keys.key_right,
        };

    }

    update(time, delta) {
        this.sprite.preUpdate(time, delta); // Required for anims to work
        if (this.inTransition) {
            return;
        }

        // /* Does the player position need to be reset, so as to not trigger 
        //    the portal again? (just spawned)? */
        // if (this.justSpawned) {
        //     this.sprite = this.scene.playerSprite; // Each scene has its own player sprite.
        //     this.interactRect = this.scene.interactRect; // Each scene has its own interactRect.
        //     this.cur_keys = this.scene.cur_keys;
        //     if (this.targetSpawn != null) {
        //         let spawn = this.scene.playerSpawns[this.targetSpawn]
        //         this.x = spawn.x;
        //         this.sprite.x = spawn.x;
        //         this.y = spawn.y;
        //         this.sprite.y = spawn.y;
        //     }
        //     this.justSpawned = false;
        // } else {
        //     // Check portals collisions 
        //     this.scene.portalsArr.forEach((portal) => {
        //         if (Phaser.Geom.Rectangle.Overlaps(this.sprite.getBounds(), portal)) {
        //             let old_scene = this.scene;
        //             this.prevScene = old_scene;
        //             this.scene = this.scene.scene.get(portal.to_room);
        //             this.targetSpawn = portal.to_spawn;
        //             // Before we put to sleep, reset cursor keys.
        //             old_scene.cur_keys.up.reset();
        //             old_scene.cur_keys.down.reset();
        //             old_scene.cur_keys.left.reset();
        //             old_scene.cur_keys.right.reset();
        //             this.sprite.setVelocity(0, 0);
        //             this.state = "idle";
        //             this.inTransition = true;
        //             // Transition scenes, fade in between.
        //             // old_scene.scene.get(portal.to_room).inTransition = true;
        //             // old_scene.inTransition = true;
        //             old_scene.scene.transition({
        //                 target: portal.to_room,
        //                 duration: 1000, 
        //                 sleep: true,
        //                 onUpdate: (prog) => {
        //                     if (this.state.cameras) {
        //                         console.log(prog);
        //                         this.state.cameras.setAlpha(prog)
        //                     }
        //                 }
        //             });
        //             // old_scene.cameras.main.fade(400, 0, 0, 0);
        //         }
        //     });
        // }
        
        // Update depth
        this.sprite.depth = this.sprite.y;
        this.sprite.update(time, delta);

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

        this.handleInput();

        // Update anims
        if (this.state == "idle") {
            this.sprite.setVelocity(0, 0);
            switch (this.direction) {
                case "up":
                    this.sprite.play(constAnims.PLAYER.IDLE_UP, true);
                    break;
                case "down":
                    this.sprite.play(constAnims.PLAYER.IDLE_DOWN, true);
                    break;
                case "left":
                    this.sprite.play(constAnims.PLAYER.IDLE_LEFT, true);
                    this.sprite.setFlipX(false);
                    break;
                case "right":
                    this.sprite.play(constAnims.PLAYER.IDLE_LEFT, true);
                    this.sprite.setFlipX(true);
                    break;
            }
        } else if (this.state == "walk") {
            switch (this.direction) {
                case "up":
                    this.sprite.play(constAnims.PLAYER.WALK_UP, true);
                    this.sprite.setVelocity(0, -this.speed);
                    break;
                case "down":
                    this.sprite.play(constAnims.PLAYER.WALK_DOWN, true);
                    this.sprite.setVelocity(0, this.speed);
                    break;
                case "left":
                    this.sprite.play(constAnims.PLAYER.WALK_LEFT, true);
                    this.sprite.setVelocity(-this.speed, 0);
                    this.sprite.setFlipX(false);
                    break;
                case "right":
                    this.sprite.play(constAnims.PLAYER.WALK_LEFT, true);
                    this.sprite.setVelocity(this.speed, 0);
                    this.sprite.setFlipX(true);
                    break;
            }
        }
    }

    // Adjusts state and direction based on cursor key input. 
    handleInput() {
        if (!this.cur_keys.up.isDown && !this.cur_keys.down.isDown && !this.cur_keys.left.isDown && !this.cur_keys.right.isDown) {
            this.state = "idle";
        } else {
            this.state = "walk";
            if (Phaser.Input.Keyboard.JustDown(this.cur_keys.up)) {
                this.direction = "up";
            } else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.down)) {
                this.direction = "down";
            } else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.left)) {
                this.direction = "left";
            } else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.right)) {
                this.direction = "right";
            }
        }
    }


    static createAnims(scene) {
        scene.anims.create({
            key: constAnims.PLAYER.WALK_DOWN,
            frames: scene.anims.generateFrameNumbers(assets.PLAYER_SPRITESHEET, {start:0, end:3}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: constAnims.PLAYER.IDLE_DOWN,
            frames: scene.anims.generateFrameNumbers(assets.PLAYER_SPRITESHEET, {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: constAnims.PLAYER.WALK_LEFT,
            frames: scene.anims.generateFrameNumbers(assets.PLAYER_SPRITESHEET, {start:4, end:7}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: constAnims.PLAYER.IDLE_LEFT,
            frames: scene.anims.generateFrameNumbers(assets.PLAYER_SPRITESHEET, {start: 5, end: 5}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: constAnims.PLAYER.WALK_UP,
            frames: scene.anims.generateFrameNumbers(assets.PLAYER_SPRITESHEET, {start:8, end:11}),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: constAnims.PLAYER.IDLE_UP,
            frames: scene.anims.generateFrameNumbers(assets.PLAYER_SPRITESHEET, {start: 9, end: 9}),
            frameRate: 8,
            repeat: -1
        });
    }

}

export default Player;