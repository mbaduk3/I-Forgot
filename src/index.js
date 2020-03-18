import 'phaser'
import { SimpleScene } from './scenes/SimpleScene'

const gameConfig = {
    width: 680,
    height: 400,
    pixelArt: true,
    scene: SimpleScene,
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