import { assets, constAnims, events} from '../constants/GameConstants'
import EventDispatcher from '../aux/EventDispatcher'

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
        this.inactive = true;
        this.to_spawn = null;
        this.emitter = EventDispatcher.getInstance();
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

        this.emitter.on(events.ROOM_TRANSITION_END, () => {
            let room = this.scene.rooms[this.scene.curRoomKey];
            this.jumpToPos(room.playerSpawns[this.to_spawn].x, room.playerSpawns[this.to_spawn].y);
            this.setActive(true);
        });

        this.inactive = false;
    }

    update(time, delta) {
        if (this.inactive) return; // If inactive, don't update. 
        this.sprite.preUpdate(time, delta); // Required for anims to work
        this.checkPortalCollision(); // Update portal collisions
        this.sprite.depth = this.sprite.y; // Update depth
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

    // Sets the player's activity. 
    // Setting to false will stop the player from updating.
    setActive(b) {
        this.inactive = !b;
        let room = this.scene.rooms[this.scene.curRoomKey];
        room.player["sprite"].active = b;
        room.player["interactRect"].active = b;
    }

    // Sets player's position to [x, y].
    jumpToPos(x, y) {
        this.x = x; this.y = y;
        this.sprite.x = x; this.sprite.y = y;
    }

    // Checks the player against collisions with portals.
    // Triggers a room change if detected. 
    checkPortalCollision() {
        /*
            If the player steps in a portal:
            1. Deactivate the player to prevent retriggering portal. 
            2. Trigger transitionRoom(target_room). 
            3. Emit the ROOM_TRANISITION event, passing the room to transition to. 
            Note: (the following steps are handled by an event listener for the camera fade finish).
            4. Jump the player to the specified spawn position. 
            5. Reactivate the player. 
        */
       let room = this.scene.rooms[this.scene.curRoomKey];
       room.portalsArr.forEach((portal) => {
            if (Phaser.Geom.Rectangle.Overlaps(this.sprite.getBounds(), portal)) {
                // this.targetSpawn = portal.to_spawn;
                this.setActive(false);
                this.scene.transitionRoom(portal.to_room);
                this.to_spawn = portal.to_spawn;
                this.emitter.emit(events.ROOM_TRANSITION_START, portal.to_room);
                return;
            }
        });
    }

}

export default Player;