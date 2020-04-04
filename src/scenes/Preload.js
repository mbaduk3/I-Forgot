import { assets, scenes } from '../constants/GameConstants'
import NPC from '../characters/NPC';

/* 
    Auxilliary scene which preloads most game assets. 
    Only to be launched once. 
*/
export class Preload extends Phaser.Scene {

    constructor() {
        super(scenes.PRELOAD);
    }

    preload() {
        // Preload player sheet
        this.load.spritesheet(assets.PLAYER_SPRITESHEET, 'assets/Sprites/Hedgehog.png', {frameWidth: 16, frameHeight: 16});
        // Preload player interact
        this.load.spritesheet(assets.INTERACT_X, 'assets/Sprites/Interact.png', {frameWidth: 16, frameHeight: 16});
        // Preload NPCs
        NPC.preload(this, assets['BEAR']);
        NPC.preload(this, assets['MOUSE']);
        // Preload TileSheets
        this.load.image(assets.rooms.ROOM1 + "_tiles", "assets/Sprites/room1_tiles.png");
        this.load.image(assets.rooms.ROOM2 + "_tiles", "assets/Sprites/room2_tiles.png");
        // Preload TileMaps
        this.load.tilemapTiledJSON(assets.rooms.ROOM1+ "_map", 'assets/Maps/' + assets.rooms.ROOM1 + "_map.json");
        this.load.tilemapTiledJSON(assets.rooms.ROOM2+ "_map", 'assets/Maps/' + assets.rooms.ROOM2 + "_map.json");
    }

    create() {
        // Launch main menu
        this.scene.launch(scenes.MAIN_MENU);

        // Remove this scene (no longer needed)
        this.scene.remove(scenes.PRELOAD);
    }
}
