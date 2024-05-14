//game over screen

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('binaryBG','./assets/images/binarybg.png');
        this.load.image('gameOver','./assets/images/buttons/gameover.png');
        this.load.image('relink','./assets/images/buttons/relink.png');
        this.load.image('menu','./assets/images/buttons/menu.png');
        this.load.audio('defeatBG','assets/audio/defeatBG.mp3');
    }

    create(data) {
        //defeatMusic
        this.defeatMusic = this.sound.add('defeatBG', {volume: 1.2, loop:true});
        this.defeatMusic.play();
        
        this.add.image(735, 180, 'gameOver');

        let finalScore = data.score;
        this.add.text(735, 380, `Amount of Data Backed Up:`, { fontSize: '64px', fill: '#99dc5d' }).setOrigin(0.5);
        this.add.text(735, 460, `${finalScore} Megabytes`, { fontSize: '64px', fill: '#99dc5d' }).setOrigin(0.5);

        const relinkB = this.add.image(380, 610, 'relink');
        const menuB = this.add.image(1090, 610, 'menu');

        // relink button event listeners and interactivity (restarts the game scene)
        relinkB.on('pointerover', function () {
            relinkB.setScale(1.1); 
        });
        relinkB.on('pointerout', function () {
            relinkB.setScale(1); 
        });
        relinkB.setInteractive().on('pointerdown', () => {
            this.defeatMusic.stop();
            this.scene.pause();
            this.scene.start('GameScene');
        });

        //menu button event listeners and interactivity (takes you to menu)
        menuB.on('pointerover', function () {
            menuB.setScale(1.1); 
        });
        menuB.on('pointerout', function () {
            menuB.setScale(1); 
        });
        menuB.setInteractive().on('pointerdown', () => {
            this.defeatMusic.stop();
            this.scene.pause();
            this.scene.start('MainMenuScene');
        });

        //old screen filter
        this.add.image(0,0,'binaryBG').setOrigin(0);
    }
}