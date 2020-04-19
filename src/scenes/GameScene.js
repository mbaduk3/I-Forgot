import Player from "../characters/Player";
import NPC from "../characters/NPC";
import Portal from '../objects/Portal'
import PlayerSpawn from '../objects/PlayerSpawn'
import { scenes, constAnims } from '../constants/GameConstants'
import Room from "../aux/Room";

/* 
    The main gameplay scene. 
    Game "rooms" are differentiated by entires in the rooms object. 
    Rooms are DisplayLists. 

    The process flow for creating a room is: 
        1. Create the empty template room object.
        2. Create the map. 
        3. Populate the map with gameobjects (player, npc, etc).
        4. Generate physics rules for all gameobjects. 
*/
class GameScene extends Phaser.Scene {

    // TODO: figure out why physics debug broken
    // TODO: why does adding through scene.physics.add work, but scene.add doesn't?

    constructor(key) {
        super({
            key: key,
            plugins: ['Loader', 'InputPlugin', 'Clock', 'TweenManager', 
                      'DataManager']
        });
        this.name = key;
        this.rooms = {}
        this.curRoomKey = null;
    }

    /*
        Creates an empty template Room.
    */
    createRoom(key) {
        this.rooms[key] = new Room();
        this.rooms[key].displayList = new Phaser.GameObjects.DisplayList(this);
        this.rooms[key].updateList = new Phaser.GameObjects.UpdateList(this);
        this.rooms[key].physics.bodies = new Phaser.Structs.Set();
        this.rooms[key].physics.staticBodies = new Phaser.Structs.Set();
    }

    /*
        Creates the map for a room. Then switches the scene to 
        that room.
    */
    createMap(key) {
        this.switchRoom(key);
        let map = this.make.tilemap({key: key + "_map"});
        let tileset = map.addTilesetImage(key + "_tiles");
        map.createStaticLayer("Base", tileset);

        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        this.rooms[key].map = map;
    }

    /*
        Populates a map with all of its gameobjects. 
        Must call createRoom(key) and createMap(key) beforehand. 
    */
    populateMap(key) {
        this.switchRoom(key);
        this.createPlayer(0, 0);

        // Map NPC layer
        this.npcGroup = this.physics.add.group({allowGravity: false});
        let map = this.rooms[key].map;
        map.getObjectLayer('NPC').objects.forEach((obj) => {
            let npc = new NPC(obj.name, this, obj.x, obj.y, obj.id);
            npc.create();
            this.npcGroup.add(npc.sprite);
            npc.afterGroupCreate();
        });
        this.rooms[key].npcGroup = this.npcGroup;
    }

    /*
        Generates physics rules for a room's gameobjects.
        Must call createRoom(key), createMap(key) and populateMap(key) beforehand.
    */
    generatePhysics(key) {
        this.switchRoom(key);
        this.physics.add.collider(this.player.sprite, this.npcGroup);
    }

    create() {
        this.initPlayer();
        
        // Init camera
        this.cameras.main.setZoom(3.5);
        this.cameras.main.setLerp(0.3, 0.3);
        this.cameras.main.alpha = 0;

        // Init keyboard inputs
        this.keys = {};
        this.keys.key_q = this.input.keyboard.addKey("q");
        this.keys.key_x = this.input.keyboard.addKey("x");
        this.keys.key_p = this.input.keyboard.addKey("p");
        this.keys.key_s = this.input.keyboard.addKey("s");
        this.keys.key_k = this.input.keyboard.addKey("k");
        this.keys.key_j = this.input.keyboard.addKey("j");
        let cur_keys = this.input.keyboard.createCursorKeys();
        this.keys.key_up = cur_keys.up;
        this.keys.key_down = cur_keys.down;
        this.keys.key_left = cur_keys.left;
        this.keys.key_right = cur_keys.right;

        this.createRoom(scenes.ROOM1);
        this.createMap(scenes.ROOM1);

        // // Map Portals layer
        // this.portalsArr = [];
        // map.getObjectLayer('Portals').objects.forEach((obj) => {
        //     let portal = new Portal(obj.x, obj.y, obj.width, obj.height, obj.name, obj.type);
        //     this.portalsArr.push(portal);
        //     // if (this.scene.get(portal.to_room) == null) {
        //     //     this.scene.add(portal.to_room, new GameScene(portal.to_room, this.player), false);
        //     // }
        // });

        // // Map Player Spawns layer
        // this.playerSpawns = {};
        // map.getObjectLayer("Player_Spawns").objects.forEach((obj) => {
        //     let key = obj.name;
        //     let spawn = new PlayerSpawn(obj.name, obj.x, obj.y);
        //     this.playerSpawns[key] = spawn;
        // })

        this.populateMap(scenes.ROOM1);
        this.generatePhysics(scenes.ROOM1);

        this.createRoom(scenes.ROOM2);
        this.createMap(scenes.ROOM2);
        this.populateMap(scenes.ROOM2);
        this.generatePhysics(scenes.ROOM2);

        this.events.on('transitionout', () => {
            // console.log(this.name + ": transition out");
            this.cameras.main.fadeOut(0);
        })
        this.events.on('transitionstart', () => {
            // console.log(this.name + ": transition started");
            // this.cameras.main.fadeOut(0);
        });
        this.events.on('transitioncomplete', () => {
            // console.log(this.name + ": transition complete");
            this.cameras.main.alpha = 1;
            this.cameras.main.fadeIn(500, 0, 0, 0, (cam, p) => {
                if (p > 0.99) {
                    this.cameras.main.alpha = 1;
                }
            });
            for (let k of Object.values(this.keys)) {
                k.reset(); // Reset keys in between scene change.
            };
        });
    }

    // Should only be called once 
    initPlayer() {
        this.player = new Player(this, 0, 0);
    }

    // Called once in the initialization of each room.
    createPlayer(x, y) {
        // Create player
        this.player.scene = this;
        this.player.create();
        this.rooms[this.curRoomKey].player.sprite = this.player.sprite;
        this.rooms[this.curRoomKey].player.interactRect = this.player.interactRect;

        // Player camera
        this.cameras.main.startFollow(this.player.sprite);
    }

    update(time, delta) {         
        if (this.inTransition) {
            return;
        }
        
        // Keyboard input update
        if (Phaser.Input.Keyboard.JustDown(this.keys.key_q)) {
            this.scene.transition({
                target: "MainMenuScene",
                duration: 100, 
                sleep: true
            });
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.key_p)) {
            console.log(this.player);
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.key_s)) {
            console.log(this);
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.key_k)) {
            this.transitionRoom(scenes.ROOM2);
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.key_j)) {
            this.transitionRoom(scenes.ROOM1);
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
            npcSprite.parent.update(time, delta);
        });

        // Player update
        this.player.update(time, delta);
    }

    
    /*
        Transitions to the room specified by [key] with a camera fade.
    */
    transitionRoom(key) {
        this.cameras.main.fadeOut(200, 0, 0, 0, (cam, p) => {
            if (p > 0.99) {
                this.switchRoom(key);
                this.cameras.main.fadeIn(200, 10, 10, 10);
            }}
        );
    }

    /*
        Switches the scene to the room specifed by given key.
        Note: createRoom(key) must have been called first before switching.
        Note: to transition rooms in-game, use transitionRoom().
    */
    switchRoom(key) {
        let room = this.rooms[key];
        this.sys.displayList = room.displayList;
        this.sys.updateList = room.updateList;
        this.children = room.displayList;
        this.physics.world.bodies = room.physics.bodies;
        this.physics.world.staticBodies = room.physics.staticBodies;
        let map = this.rooms[key].map;
        if (map != null) {
            this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);
        }
        if (this.player != null) {
            this.player.sprite = room.player.sprite;
            this.player.interactRect = room.player.interactRect;
            if (this.player.sprite != null) {
                this.cameras.main.startFollow(this.player.sprite);
                this.cameras.main.setLerp(0.3, 0.3);
            }
        }
        this.npcGroup = room.npcGroup;
        this.curRoomKey = key;
    }

}

export default GameScene;