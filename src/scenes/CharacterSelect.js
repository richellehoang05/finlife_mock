import Phaser from "phaser"
import { gameState } from "../GameState.js"

// Adjust frameWidth, frameHeight, and end frame to match your spritesheet layout
const FRAME_WIDTH = 32
const FRAME_HEIGHT = 32
const FRAME_COUNT = 4 // frames 0-3 (adjust if your spritesheet has more/fewer)

// Character display size on screen
const CHARACTER_SIZE = 200

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect")
  }

  /**
   * Load the assets (images, sounds, etc.)
   */
  preload() {
    this.load.image("charSelBG", "/pictures/charSelBG.png")
    this.load.image("chooseChar", "/pictures/chooseChar.png")
    this.load.image("startButton", "/pictures/START.png")
    this.load.spritesheet("girl", "/resources/girlchar.png", {
      frameWidth: FRAME_WIDTH,
      frameHeight: FRAME_HEIGHT,
    })
    this.load.spritesheet("boy", "/resources/boychar.png", {
      frameWidth: FRAME_WIDTH,
      frameHeight: FRAME_HEIGHT,
    })
  }

  /**
   * Create the scene (add sprites, buttons, etc.)
   */
  create() {
    // Add background image
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'charSelBG')
      .setOrigin(0.5)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setAlpha(0.7)

    // Girl animation
    this.anims.create({
      key: "girlIdle",
      frames: this.anims.generateFrameNumbers("girl", { start: 0, end: FRAME_COUNT - 1 }),
      frameRate: 8,
      repeat: -1,
    })
    // Boy animation
    this.anims.create({
      key: "boyIdle",
      frames: this.anims.generateFrameNumbers("boy", { start: 0, end: FRAME_COUNT - 1 }),
      frameRate: 8,
      repeat: -1,
    })

    const centerX = this.cameras.main.centerX
    const centerY = this.cameras.main.centerY
    const screenWidth = this.cameras.main.width
    const screenHeight = this.cameras.main.height

    this.add.image(centerX, centerY - 250, "chooseChar").setOrigin(0.5)

    // Character A - Girl (left) - click to select
    const girlSprite = this.add.sprite(centerX - 180, centerY, "girl")
    girlSprite.setDisplaySize(CHARACTER_SIZE, CHARACTER_SIZE)
    girlSprite.play("girlIdle")
    girlSprite.setInteractive({ useHandCursor: true })
    girlSprite.on("pointerdown", () => {
      this.selectCharacter(girlSprite, "A")
    })

    // Character B - Boy (right) - click to select
    const boySprite = this.add.sprite(centerX + 180, centerY, "boy")
    boySprite.setDisplaySize(CHARACTER_SIZE, CHARACTER_SIZE)
    boySprite.play("boyIdle")
    boySprite.setInteractive({ useHandCursor: true })
    boySprite.on("pointerdown", () => {
      this.selectCharacter(boySprite, "B")
    })

    // Escape key to return to MainMenu
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });

    // Next button - centered, below characters (position proportional to CHARACTER_SIZE)
    this.selectedCharacter = null
    const nextButtonY = centerY + CHARACTER_SIZE / 2 + 80
    const nextButton = this.add.image(centerX, nextButtonY, "startButton").setOrigin(0.5).setScale(0.5)

    nextButton.setInteractive({ useHandCursor: true })
    nextButton.on("pointerdown", () => {
      if (this.selectedCharacter) {
        gameState.character.type = this.selectedCharacter  // Save to gameState
        this.scene.start("GameScene", { character: this.selectedCharacter })
      }
    })
  }

  selectCharacter(selectedSprite, character) {
    this.selectedCharacter = character

    // Clear previous highlight
    if (this.selectionHighlight) {
      this.selectionHighlight.destroy()
    }

    // Draw highlight frame around selected character
    const pad = 8
    const w = CHARACTER_SIZE + pad * 2
    const h = CHARACTER_SIZE + pad * 2
    const x = selectedSprite.x - w / 2
    const y = selectedSprite.y - h / 2

    this.selectionHighlight = this.add.graphics()
    this.selectionHighlight.lineStyle(4, 0x4caf50)
    this.selectionHighlight.strokeRect(x, y, w, h)
    this.selectionHighlight.setDepth(10)
  }
}