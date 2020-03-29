import SimpleScene from './SimpleScene'
import { Utils } from 'phaser';
import GameScene from './GameScene';
import Player from '../characters/Player'

export class MainMenuScene extends Phaser.Scene {

    constructor() {super("MainMenuScene")}

    preload() {
        Player.preload(this);
    }

    create() {
        this.title = "I Forgot...";
        this.add.text(10, 10, this.title);

        this.options_obj = [];
        this.options = [{
            text: "New Game",
            onClick: "room1"}, 
            {text: "Help", 
            onClick: null}]
        this.options.forEach((opt, i) => {
            this.options_obj.push(this.add.text(10, i * 40 + 100, opt.text))});
        this.selected = 0;
        this.cur_keys = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey("ENTER");

        this.player = new Player(this, 0, 0);

        if (this.scene.get("room1") == null) {
            let room1 = new GameScene("room1", this.player);
            this.scene.add("room1", room1);
        }
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cur_keys.up) || 
            Phaser.Input.Keyboard.JustDown(this.cur_keys.left)) {
                this.selected = Math.abs(this.selected - 1) % this.options.length;
            }
        else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.down) || 
                 Phaser.Input.Keyboard.JustDown(this.cur_keys.right)) {
                this.selected = Math.abs(this.selected + 1) % this.options.length;
            }
        else if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            if (this.scene.isSleeping("room1")) {
                this.scene.switch("room1");
            } else {
                this.player.scene = this.scene.get("room1");
                this.player.prevScene = this;
                this.scene.start("room1");
            }
        }
        this.options_obj.forEach(obj => obj.setAlpha(0.5));
        this.options_obj[this.selected].setAlpha(1);
    }
}