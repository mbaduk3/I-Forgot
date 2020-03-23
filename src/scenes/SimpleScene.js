import Player from "../characters/Player";
import BearNPC from '../characters/BearNPC'

export class SimpleScene extends Phaser.Scene {

    constructor() {
        super("SimpleScene")
    }

    preload() {
        this.player = new Player(this);
        this.player.preload();
        BearNPC.preload(this);
        this.load.image('forest_map_tiles', 'assets/forest_tiles.png');
        this.load.spritesheet('interact_x', 'assets/Interact.png', {frameWidth: 16, frameHeight: 16});
        this.load.tilemapTiledJSON('forest_map', 'assets/Maps/forest_map.json');
    }

    create() {
        let map = this.make.tilemap({key: 'forest_map'});
        let tileset = map.addTilesetImage('forest_tiles', 'forest_map_tiles');
        let map_layer_base = map.createStaticLayer('Base', tileset, 0, 0);
        this.physics.world.bounds.setTo(0, 0, 16*20, 16*20);
        this.fpsTxt = this.add.text(this.cameras.main.x, this.cameras.main.y, this.game.loop.actualFps);

        this.npcGroup = this.physics.add.group({allowGravity: false});
        this.npcArr = [];
        this.anims.create({
            key: 'interact', 
            frames: this.anims.generateFrameNames('interact_x', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1,
        });
        map.getObjectLayer('NPC').objects.forEach((obj) => {
            let npc = new BearNPC(this, obj.x, obj.y);
            npc.create();
            this.npcArr.push(npc);
            this.npcGroup.add(npc.sprite);
        });
        this.player.create();

        this.cur_keys = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(3.5);
        this.key_q = this.input.keyboard.addKey("q");
        this.key_x = this.input.keyboard.addKey("x");

        // this.physics.add.overlap(this.player.interactRect, this.npcGroup, function (p, npcSprite) {
        //     npcSprite.parent.interact_sprite.setVisible(true);
        // });
    }

    update() {
        this.player.update();

        if (Phaser.Input.Keyboard.JustDown(this.key_q)) {
            this.scene.start("MainMenuScene");
        }

        if (Phaser.Input.Keyboard.JustDown(this.key_x)) {
            console.log(this.player.interactRect);
        }

        this.npcGroup.getChildren().forEach((npcSprite) => {
            if (this.physics.overlap(this.player.interactRect, npcSprite)) {
                npcSprite.parent.canInteract = true;
            } else {
                npcSprite.parent.canInteract = false;
            }
            npcSprite.parent.update();
        });

        this.fpsTxt.setText(this.game.loop.actualFps);
    }

}
