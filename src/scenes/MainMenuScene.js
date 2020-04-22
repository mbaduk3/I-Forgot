import { scenes } from '../constants/GameConstants'
import GameScene from './GameScene';
import Player from '../characters/Player'

export class MainMenuScene extends Phaser.Scene {

    constructor() {super(scenes.MAIN_MENU)}

    create() {
        this.title = "I Forgot...";
        this.add.text(10, 10, this.title);
        this.name = "MainMenuScene";
        this.options_obj = [];
        this.options = [{
            text: "New Game",
            onClick: scenes.ROOM1}, 
            {text: "Help", 
            onClick: null}]
        this.options.forEach((opt, i) => {
            this.options_obj.push(this.add.text(10, i * 40 + 100, opt.text))});
        this.selected = 0;
        this.cur_keys = this.input.keyboard.createCursorKeys();
        this.enter = this.input.keyboard.addKey("ENTER");
        this.disableInput = false;

        if (this.scene.get(scenes.ROOM1) == null) {
            let room1 = new GameScene(scenes.ROOM1);
            this.scene.add(scenes.ROOM1, room1);
        }
        this.inTransition = false;
        
        this.events.on('transitionout', () => {
            // console.log(this.name + ": transition out");
            this.inTransition = true;
            this.cameras.main.fadeOut(0);
        })
        this.events.on('transitionstart', () => {
            // console.log(this.name + ": transition started");
            this.inTransition = true;
            this.cameras.main.fadeOut(0);
        });
        this.events.on('transitioncomplete', () => {
            // console.log(this.name + ": transition complete");
            this.inTransition = false;
            this.cameras.main.fadeIn(500, 0, 0, 0, (cam, p) => {
                if (p > 0.99) {
                    this.cameras.main.alpha = 1;
                }
            });
        });
    }

    update() {
        if (this.inTransition) {
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(this.cur_keys.up) || 
            Phaser.Input.Keyboard.JustDown(this.cur_keys.left)) {
                this.selected = Math.abs(this.selected - 1) % this.options.length;
            }
        else if (Phaser.Input.Keyboard.JustDown(this.cur_keys.down) || 
                 Phaser.Input.Keyboard.JustDown(this.cur_keys.right)) {
                this.selected = Math.abs(this.selected + 1) % this.options.length;
            }
        else if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.scene.transition({
                target: scenes.ROOM1, 
                duration: 100, 
            });
        }
        this.options_obj.forEach(obj => obj.setAlpha(0.5));
        this.options_obj[this.selected].setAlpha(1);
    }

}