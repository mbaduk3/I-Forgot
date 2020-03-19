import Player from "../characters/Player";
import BearNPC from '../characters/BearNPC'

export class SimpleScene extends Phaser.Scene {

    constructor() {super("SimpleScene")}

    preload() {
        this.player = new Player(this);
        this.player.preload();
        this.bearNPC = new BearNPC(this, 50, 50);
        this.bearNPC.preload();
        this.load.image('forest_map_tiles', 'assets/forest_tiles.png');
        this.load.tilemapTiledJSON('forest_map', 'assets/Maps/forest_map.json');
    }

    create() {
        let map = this.make.tilemap({key: 'forest_map'});
        let tileset = map.addTilesetImage('forest_tiles', 'forest_map_tiles');
        let map_layer_base = map.createStaticLayer('Base', tileset, 0, 0)
        this.physics.world.bounds.setTo(0, 0, 16*20, 16*20);

        this.player.create();
        this.bearNPC.create();

        this.cur_keys = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setZoom(3.5);
        this.key_q = this.input.keyboard.addKey("q");
    }

    update() {
        this.player.update();

        if (Phaser.Input.Keyboard.JustDown(this.key_q)) {
            this.scene.start("MainMenuScene");
        }
    }

}
