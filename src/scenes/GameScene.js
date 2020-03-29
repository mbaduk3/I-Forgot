import Player from "../characters/Player";
import NPC from "../characters/NPC";
import Portal from '../objects/Portal'
import PlayerSpawn from '../objects/PlayerSpawn'

/* 
    Each instance of GameScene represents a separate "room" in the game.
    Differentiate rooms based on the "key" passed into constructor. 
*/
class GameScene extends Phaser.Scene {

    constructor(key, player) {
        super({
            key: key,
            plugins: ['Loader', 'InputPlugin', 'Clock', 'TweenManager', 
                      'DataManager']
        });
        this.name = key;
        this.player = player;
    }

    preload() {
        NPC.preload(this, "Bear");
        NPC.preload(this, "Mouse");
        this.load.image(this.name + "_tiles", "assets/Sprites/" + this.name + "_tiles.png");
        this.load.spritesheet('interact_x', 'assets/Sprites/Interact.png', {frameWidth: 16, frameHeight: 16});
        this.load.tilemapTiledJSON(this.name + "_map", 'assets/Maps/' + this.name + "_map.json");
        console.log(this.name + " preloaded");
    }

    create() {
        // Init universal anims
        this.anims.create({
            key: 'interact', 
            frames: this.anims.generateFrameNames('interact_x', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1,
        });

        // Map Base layer
        let map = this.make.tilemap({key: this.name + "_map"});
        let tileset = map.addTilesetImage(this.name + "_tiles");
        map.createStaticLayer("Base", tileset);

        // Map NPC layer
        this.npcGroup = this.physics.add.group({allowGravity: false});
        map.getObjectLayer('NPC').objects.forEach((obj) => {
            let npc = new NPC(obj.name, this, obj.x, obj.y, obj.id);
            npc.create();
            this.npcGroup.add(npc.sprite);
            npc.afterGroupCreate();
        });

        // Map Portals layer
        this.portalsArr = [];
        map.getObjectLayer('Portals').objects.forEach((obj) => {
            let portal = new Portal(obj.x, obj.y, obj.width, obj.height, obj.name, obj.type);
            this.portalsArr.push(portal);
            if (this.scene.get(portal.to_room) == null) {
                this.scene.add(portal.to_room, new GameScene(portal.to_room, this.player), false);
            }
        });

        // Map Player Spawns layer
        this.playerSpawns = {};
        map.getObjectLayer("Player_Spawns").objects.forEach((obj) => {
            let key = obj.name;
            let spawn = new PlayerSpawn(obj.name, obj.x, obj.y);
            this.playerSpawns[key] = spawn;
        })

        // Init camera
        this.cameras.main.setZoom(3.5);
        this.cameras.main.setLerp(0.3, 0.3);

        // Init keyboard inputs
        this.cur_keys = this.input.keyboard.createCursorKeys();
        this.key_q = this.input.keyboard.addKey("q");
        this.key_x = this.input.keyboard.addKey("x");
        this.key_p = this.input.keyboard.addKey("p");
        this.key_s = this.input.keyboard.addKey("s");

        // Init physics
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        this.createPlayer(0, 0);

        console.log(this.name + " created");
    }

    createPlayer(x, y) {
        // Create player
        this.player.create();

        // Player physics
        this.physics.add.collider(this.player.sprite, this.npcGroup);

        // Player camera
        this.cameras.main.startFollow(this.player.sprite);
    }

    update() {

        // Keyboard input update
        if (Phaser.Input.Keyboard.JustDown(this.key_q)) {
            this.scene.switch("MainMenuScene");
        } else if (Phaser.Input.Keyboard.JustDown(this.key_p)) {
            console.log(this.player);
        } else if (Phaser.Input.Keyboard.JustDown(this.key_s)) {
            console.log(this);
        }

        // Update NPCs
        this.npcGroup.getChildren().forEach((npcSprite) => {
            // Overlap
            if (this.physics.overlap(this.player.interactRect, npcSprite)) {
                npcSprite.parent.canInteract = true;
            } else {
                npcSprite.parent.canInteract = false;
            }
            // Update
            npcSprite.parent.update();
        });

        // Player update
        this.player.update();
    }

    getPlayerSpawns() {
        return this.playerSpawns;
    }
}

export default GameScene;