import { scenes } from '../constants/GameConstants'
import GameScene from './GameScene';
import Player from '../characters/Player'

export class MainMenuScene extends Phaser.Scene {

    constructor() {super(scenes.MAIN_MENU)}

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
        this.disableInput = false;

        this.player = new Player(this, 0, 0);

        if (this.scene.get("room1") == null) {
            let room1 = new GameScene("room1", this.player);
            this.scene.add("room1", room1);
        }
        this.inTransition = false;
        
        this.events.on("transitionout", () => {
            this.inTransition = true;
            console.log("MainMenuScene: transition out")
            // this.cameras.main.fadeOut(300, 0, 0, 0);
        });
        this.events.on("transitionwake", () => console.log("MainMenuScene: transition wake"));
        this.events.on("transitionstart", () => {
            console.log("MainMenuScene: transition started")
            this.inTransition = true
            // this.cameras.main.fadeIn(1500, 0, 0, 0);
        });
        this.events.on('transitioncomplete', () => {
            console.log("MainMenuScene: transition complete");
            this.inTransition = false;
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
            if (this.scene.isSleeping("room1")) {
                this.scene.transition({
                    target: "room1", 
                    duration: 1000, 
                    onUpdate: this.transitionCam,
                });
            } else {
                this.player.scene = this.scene.get("room1");
                this.player.prevScene = this;
                this.scene.transition({
                    target: "room1", 
                    duration: 1000,
                    onUpdate: this.transitionCam
                })
            }
        }
        this.options_obj.forEach(obj => obj.setAlpha(0.5));
        this.options_obj[this.selected].setAlpha(1);
    }

    transitionCam(progress) {
        console.log(progress);
        this.cameras.main.setAlpha(progress);
    }
}