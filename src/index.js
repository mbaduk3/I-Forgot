import 'phaser'
import { MainMenuScene } from './scenes/MainMenuScene'
import { SimpleScene } from './scenes/SimpleScene';

const gameConfig = {
    width: 680,
    height: 400,
    pixelArt: true,
    scene: [MainMenuScene, SimpleScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            },
            debug: true
        }
    }
};

new Phaser.Game(gameConfig);