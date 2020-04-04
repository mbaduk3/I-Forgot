import Player from "../characters/Player";
import NPC from "../characters/NPC";
import Portal from '../objects/Portal'
import PlayerSpawn from '../objects/PlayerSpawn'

/* 
    The main gameplay scene. 
    Each instance of GameScene represents a separate "room" in the game.
    Differentiate rooms based on the "key" passed into constructor. 
*/
class GameScene extends Phaser.Scene {

    // TODO: fade-in/out scene transitions

    constructor(key, player) {
        super({
            key: key,
            plugins: ['Loader', 'InputPlugin', 'Clock', 'TweenManager', 
                      'DataManager']
        });
        this.name = key;
        this.player = player;
        this.inTransition = true;
    }

    create() {
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
        this.key_q = this.input.keyboard.addKey("q");
        this.key_x = this.input.keyboard.addKey("x");
        this.key_p = this.input.keyboard.addKey("p");
        this.key_s = this.input.keyboard.addKey("s");
        this.key_k = this.input.keyboard.addKey("k");
        this.cur_keys = this.input.keyboard.createCursorKeys();

        // Init physics
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        this.createPlayer(0, 0);

        // Register events
        this.events.on("transitionout", () => {
            this.inTransition = true;
            console.log(this.name + ": transition out")
            // this.cameras.main.fadeOut(300, 0, 0, 0);
        });
        this.events.on("transitionwake", () => console.log(this.name + ": transition wake"));
        this.events.on("transitionstart", () => {
            console.log(this.name + ": transition started");
            this.inTransition = true;
            // this.cameras.main.fadeIn(1500, 0, 0, 0);
            // this.cameras.main.setAlpha(0.5);
        });
        this.events.on('transitioncomplete', () => {
            console.log(this.name + ": transition complete");
            this.inTransition = false;
            this.player.inTransition = false;
            this.player.justSpawned = true;
            this.player.scene = this;
            // this.cameras.main.setAlpha(1);
        });
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
         
        if (this.inTransition) {
            return;
        }
        
        // Keyboard input update
        if (Phaser.Input.Keyboard.JustDown(this.key_q)) {
            this.scene.transition({
                target: "MainMenuScene",
                duration: 1000, 
                sleep: true
            });
        } else if (Phaser.Input.Keyboard.JustDown(this.key_p)) {
            console.log(this.player);
        } else if (Phaser.Input.Keyboard.JustDown(this.key_s)) {
            console.log(this);
        } else if (Phaser.Input.Keyboard.JustDown(this.key_k)) {
            this.input.emit("k"); 
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

    transitionStartHandler() {
        console.log("transition start");
        this.inTransition = false;
    }

    readyHandler() {
        console.log("ready!");
        // this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    transitionCam(progress) {
        console.log(progress);
        this.cameras.main.setAlpha(progress);
    }

}

export default GameScene;