//main menu scene

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('binaryBG','./assets/images/binarybg.png');
        this.load.image('title','./assets/images/buttons/title.png');
        this.load.image('launch','./assets/images/buttons/launch.png');
        this.load.image('about','./assets/images/buttons/about.png');
        this.load.image('exit','./assets/images/buttons/exit.png');
        this.load.audio('menuBG','assets/audio/menuBG.mp3');
    }

    create() {
        this.add.image(735, 140, 'title');
        const launch = this.add.image(735, 380, 'launch');
        const about = this.add.image(380, 570, 'about');
        const exit = this.add.image(1090, 570, 'exit');

        if (!this.menuMusic || !this.menuMusic.isPlaying) { //prevent bgm from duplicating
            this.menuMusic = this.sound.add('menuBG', { volume: 1.5, loop: true });
            this.menuMusic.play();
        }

        //launch button interactivity
        launch.setInteractive();
        launch.on('pointerover', function () {
            launch.setScale(1.1); 
        });

        launch.on('pointerout', function () {
            launch.setScale(1); 
        });

        launch.setInteractive().on('pointerdown', () => {
            this.menuMusic.stop();
            this.scene.pause();
            this.scene.start('GameScene');
        });

         //about button interactivity (brings you to credits)
         about.setInteractive();
         about.on('pointerover', function () {
            about.setScale(1.1); 
         });
 
         about.on('pointerout', function () {
            about.setScale(1); 
         });
 
        about.setInteractive().on('pointerdown', () => {
            this.scene.pause();
            this.scene.start('CredScene');
        });

          //exit button interactivity (prompts an alert)
          exit.setInteractive();
          exit.on('pointerover', function () {
            exit.setScale(1.1); 
        });

        exit.on('pointerout', function () {
            exit.setScale(1); 
        });

        exit.setInteractive().on('pointerdown', () => {
            alert('-----ABORTING OPERATION-----\n\nYou have chickened out, allowing the Virus to run rampant on the system. How dare you?');
        });

        this.add.image(0,0,'binaryBG').setOrigin(0);
    }
}