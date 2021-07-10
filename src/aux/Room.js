/* 
    A container for updateList, displayList and map objects. 
    The main game scene will store a map of Room objects. Switching between 
    them will update the display and update lists. 
*/
class Room {

    constructor() {
        this.displayList = null; 
        this.updateList = null;
        this.map = null; // A pointer to the TileMap object. 
        this.physics = { 
            bodies: new Phaser.Structs.Set(),
            staticBodies: new Phaser.Structs.Set(),
        },
        this.player = {
            sprite: null,
            interactRect: null,
        }
        this.npcGroup = null;
        this.portalsArr = null;
        this.playerSpawns = null;
        this.debugGraphic = null;
    }

}

export default Room;