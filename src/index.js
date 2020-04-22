import 'phaser'
import { MainMenuScene } from './scenes/MainMenuScene'
import { Preload } from './scenes/Preload'
import { SimpleScene } from './scenes/SimpleScene';
import GameScene from './scenes/GameScene';

const gameConfig = {
    width: 800,
    height: 500,
    pixelArt: true,
    scene: [Preload, MainMenuScene],
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

var game = new Phaser.Game(gameConfig);