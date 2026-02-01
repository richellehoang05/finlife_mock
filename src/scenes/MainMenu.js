import Phaser from "phaser"

export class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu")
  }

  preload() {
    this.load.image('background', 'pictures/mainMenu.png');
    this.load.image('playButton', 'pictures/PLAY.png');
    this.load.image('decoration', 'pictures/balloon.png');
    this.load.image('finlifeLogo', 'pictures/finlife.png');
  }

  create() {

    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background').setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setAlpha(0.7);

    // Add the finlife logo image instead of text
    this.add.image(this.cameras.main.centerX, this.cameras.main.height * 0.4, 'finlifeLogo')
      .setOrigin(0.5)
      .setScale(0.95); 

    const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.height * 0.6, 'playButton').setOrigin(0.5).setScale(0.25);

    playButton.setInteractive()
    playButton.on("pointerdown", () => {
      this.scene.start("CharacterSelect")
    })

    this.add.image(this.cameras.main.centerX + 400, this.cameras.main.height * 0.6, 'decoration').setOrigin(0.5).setScale(0.4);
  }
}