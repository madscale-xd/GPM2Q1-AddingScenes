//credits portion (about)

export default class CredScene extends Phaser.Scene {
    constructor() {
        super('CredScene');
    }
    preload() {
        this.load.image('binaryBG','./assets/images/binarybg.png');
        this.load.image('credits','./assets/images/buttons/credits.png');
        this.load.image('menu','./assets/images/buttons/menu.png');
    }
    create() {
        // Credits text (developer information)
        this.add.image(735, 180, 'credits');
        this.add.text(735, 380, 'Developer\'s Full Name: Justin Kyle A. De Castro', { fontSize: '24px', fill: '#99dc5d' }).setOrigin(0.5);
        this.add.text(735, 440, 'Developer\'s Section: EMC131P - A223', { fontSize: '24px', fill: '#99dc5d' }).setOrigin(0.5); 
        this.add.text(735, 500, 'Developer\'s Program: EMC', { fontSize: '24px', fill: '#99dc5d' }).setOrigin(0.5); 
        
        // Back button event listeners and interactivity (returns you to the main menu)
        const menu1 = this.add.image(280, 600, 'menu');

        menu1.setInteractive(); 
        menu1.on('pointerdown', () => {
            this.scene.pause();
            this.scene.start('MainMenuScene'); 
        });
        menu1.on('pointerover', function () {
            menu1.setScale(1.1); 
        });
        menu1.on('pointerout', function () {
            menu1.setScale(1); 
        });

        //old screen filter
        this.add.image(0,0,'binaryBG').setOrigin(0);
    }
}