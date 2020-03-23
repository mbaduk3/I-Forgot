class NPC {

    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
    }

    create() {
        this.interact_sprite = this.scene.add.sprite(this.x, this.y, 'interact_sprite');
        this.interact_sprite.setVisible(false);
    }

}

export default NPC;