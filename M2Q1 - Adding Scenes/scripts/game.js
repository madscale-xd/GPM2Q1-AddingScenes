//actual game

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.scoreText;
        this.player, this.cursors, this.viruses, this.files;
        this.platforms;

        //for ROYGBIV color cycling
        this.playerColors = [0xff0000, 0xFF6E00, 0xFFFF00, 0x00ff00, 0x0000ff, 0x7800FF, 0x9B26B6];
        this.currentColorIndex = 0;

        //for ease of modification to ramp up
        this.playerVelocity = 160;
    }
//initialize the whole thing

preload ()
{
    //old screen filter
    this.load.image('binaryBG','./assets/images/binarybg.png');
    //platforms
    this.load.image('codePrime', './assets/images/codePrime.png');
    this.load.image('code1', './assets/images/code1.png');
    this.load.image('code2', './assets/images/code2.png');
    this.load.image('code3', './assets/images/code3.png');
    this.load.image('code4', './assets/images/code4.png');
    this.load.image('code5', './assets/images/code5.png');
    this.load.image('code6', './assets/images/code6.png');
    this.load.image('code7', './assets/images/code7.png');
    //file (STAR)
    this.load.image('file', './assets/images/file.png');
    //virus (BOMB)
    this.load.image('virus', './assets/images/virus.png');
    // player
    this.load.spritesheet('extie',              //(8) the player entity is using a SPRITESHEET
        './assets/images/extie.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    this.load.audio('playBG','assets/audio/playBG.mp3');
    this.load.audio('deathBG','assets/audio/deathBG.mp3');
}

create ()
{
    this.playMusic = this.sound.add('playBG', {volume: 0.5, loop:true});
    this.playMusic.play();

    //platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(700, 740, 'codePrime').setScale(4).refreshBody();
    this.platforms.create(700, 680, 'codePrime').setScale(4).refreshBody();      //second base platform to allow jumping back up
    this.platforms.create(620, 330, 'code3').setScale(0.8).refreshBody();
    this.platforms.create(85, 250, 'code5').setScale(0.5,1.5).refreshBody();
    this.platforms.create(150, 500, 'code2').setScale(0.5,3).refreshBody();
    this.platforms.create(740, 490, 'code4').setScale(0.5,1.1).refreshBody();
    this.platforms.create(680, 172, 'code1');
    this.platforms.create(1200, 460, 'code7');
    this.platforms.create(1460, 275, 'code6').setScale(1.5,0.3).refreshBody();

    //player
    this.player = this.physics.add.sprite(Phaser.Math.Between(80, 1470-80), Phaser.Math.Between(80, 550), 'extie');
    this.physics.add.collider(this.player, this.platforms);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('extie', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'extie', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('extie', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    
    //files (STARS)
    this.files = this.physics.add.group({
        key: 'file',
        repeat: 4,
        setXY: { x: Phaser.Math.Between(20, 100), y:  Phaser.Math.Between(120, 300), stepX: Phaser.Math.Between(220, 340) }
    });
    
    this.files.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.files, this.platforms);
    this.physics.add.overlap(this.player, this.files, this.collectFile, null, this);

    //score         -->         (5) "Stars (DATA) Collected" UI on the Top-Right of the screen, updating as stars are collected
    this.scoreText = this.add.text(1020, 32, 'Data Collected: 0 mb', { fontSize: '32px', fill: '#00ce00' });

    //viruses (BOMBS)
    this.viruses = this.physics.add.group();
    this.physics.add.collider(this.viruses, this.platforms);
    this.physics.add.collider(this.player, this.viruses, this.hitVirus, null, this);

    //application of the old screen filter
    this.add.image(0,0,'binaryBG').setOrigin(0);
}

update ()
//player movement
{
    if (this.cursors.left.isDown)
{
    this.player.setVelocityX(-(this.playerVelocity));

    this.player.anims.play('left', true);
}
else if (this.cursors.right.isDown)
{
    this.player.setVelocityX(this.playerVelocity);

    this.player.anims.play('right', true);
}
else
{
    this.player.setVelocityX(0);

    this.player.anims.play('turn');
}

if (this.cursors.up.isDown && this.player.body.touching.down)
{
    this.player.setVelocityY(-330);
}
}

collectFile (player, file)     //function to modify SCORE, player & bomb SIZE & SPEED, player COLOR
{
    file.disableBody(true, true);

    this.score += 1;                         //(5) score update mechanics
    this.scoreText.setText('Data Collected: ' + this.score + ' mb');

    this.newFileX = Phaser.Math.Between(80, 1400);
    this.newFileY = Phaser.Math.Between(100, 500);
    this.newFile = this.files.create(this.newFileX, this.newFileY, 'file');     //(1)new (FILE) STAR everytime a player collects a STAR object
    this.newFile.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    if (this.files.countActive(true) === 0)
    {

        this.files.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
    }
    player.setTint(this.playerColors[this.currentColorIndex]);            //(2)change player COLOR (cycle thru ROYGBIV) everytime a STAR is collected
    this.currentColorIndex = (this.currentColorIndex + 1) % this.playerColors.length;

    if (this.score % 5 === 0) {  
        player.setScale(player.scaleX * 1.1, player.scaleY * 1.1);  //(4)every 5 (FILE) STARS collected, player grows in size by 10%

        this.playerVelocity+=20;
        this.virusSpeedIncrease = 50;
    
        this.viruses.children.iterate((virus) => {
            this.currentVelocityX = virus.body.velocity.x;
            this.currentVelocityY = virus.body.velocity.y;
        
            this.newVelocityX = this.currentVelocityX + this.virusSpeedIncrease;
            this.newVelocityY = this.currentVelocityY + this.virusSpeedIncrease;
        
            virus.setVelocity(this.newVelocityX, this.newVelocityY);
            virus.setScale(virus.scaleX * 1.12, virus.scaleY * 1.12);
        });
    
        this.x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
        this.virus = this.viruses.create(Phaser.Math.Between(100, 1300), 16, 'virus');
        this.virus.setBounce(1);
        this.virus.setCollideWorldBounds(true);
        this.virus.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

hitVirus (player, virus)      //(6) function to initiate GAME OVER sequence ("LOSE CONDITION upon 'BOMB' COLLISION")
{
    this.playMusic.stop();
    this.deathMusic = this.sound.add('deathBG', {volume: 0.5});
    this.deathMusic.play();

    this.physics.pause();

    this.player.setVisible(false);

    this.time.delayedCall(2000, () => {
        this.scene.start('GameOverScene', {score: this.score});  
        this.resetEverything();
    });
}

resetEverything() {
    this.score = 0;
    this.scoreText.setText('Data Collected: 0 mb');
    this.playerVelocity = 160;
}
//(7) assets are from HackerTyper.com (the platforms), freepik (the filter), and made by yours truly (player spritesheet, files, virus assets)

}