//sceneManager file

import MainMenuScene from '../scripts/menuScene.js';
import GameScene from '../scripts/game.js';
import GameOverScene from '../scripts/gameOver.js';
import CredScene from '../scripts/credits.js';

var config = {
    type: Phaser.AUTO,
    width: 1470,
    height: 720,
    scene: [MainMenuScene, GameScene, GameOverScene, CredScene], //leftmost gets loaded FIRST
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);