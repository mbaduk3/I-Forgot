import SimpleScene from './SimpleScene'
import { Utils } from 'phaser';

export class MainMenuScene extends Phaser.Scene {

    constructor() {super("MainMenuScene")}

    preload() {

    }

    create() {
        this.title = "I Forgot...";
        this.add.text(10, 10, this.title);

        this.options_obj = [];
        this.options = [{
            text: "New Game",
            onClick: "SimpleScene"}, 
            {text: "Help", 
            onClick: null}]
        this.options.forEach((opt, i) => {
            this.options_obj.push(this.add.text(10, i * 40 + 100, opt.text))});
        this.selected = 0;
        this.cur_keys = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey("ENTER");
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
            this.scene.start(this.options[this.selected].onClick);
        }
        this.options_obj.forEach(obj => obj.setAlpha(0.5));
        this.options_obj[this.selected].setAlpha(1);
    }
}