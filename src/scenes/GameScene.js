import Phaser from "phaser"
import { gameState } from "../GameState.js"

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
  }

  /**
   * Load the assets (images, sounds, etc.)
   */
  preload() {
    this.load.image("townBG", "/pictures/town.png")
    this.load.image("nextButton", "/pictures/NEXT.png")
    this.load.image("userFr", "/pictures/userFr.png")
  }

  init(data) {
    this.character = data.character || "A"
  }

  create() {
    // Add background image
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'townBG')
      .setOrigin(0.5)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setAlpha(0.7)

    // Add userFr image (top left corner)
    this.add.image(100, 45, 'userFr')
      .setOrigin(0.5)
      .setScale(0.5, 0.3); 

    // UI
    this.bankText = this.add.text(20, 20, `Bank: $${gameState.bank}`, {
      fontSize: "22px",
      color: "#000000",
    })

    this.weekText = this.add.text(20, 50, `Week: ${gameState.week}`, {
      fontSize: "22px",
      color: "#000000",
    })

    // Salary event
    // this.time.addEvent({
    //   delay: 2000,
    //   loop: true,
    //   callback: () => {
    //     this.bankAmount += this.salary
    //     this.bankText.setText(`Bank: $${this.bankAmount}`)
    //   }
    // })

    // Dialogue queue
    this.showDialogue([
      "Welcome to FinLife!",
      "Your parents are busy working so you'll have to go shopping for your family.",
      "They've given you an allowance to pay for the things you need.",
      "If you have leftover money you can use it on your wants.",
      "Be careful! Watch your health and happiness bars, and make sure to buy what you NEED, before buying what you WANT.",
      "Items you NEED will show up in red, while items you WANT will show up in purple.",
      "Needs will elevate your health, and wants will elevate your happiness.",
      "Every two weeks you'll get your allowance, but be careful!",
      "You'll have to go shopping every WEEK.",
      "Have fun!"
    ])

    // Add NEXT image button
    const nextBtn = this.add.image(this.cameras.main.width - 80, this.cameras.main.height - 60, "nextButton")
      .setScale(0.22)
      .setInteractive();
    nextBtn.on("pointerdown", () => {
      this.scene.start("HomeScene");
    });

    // Escape key to return to MainMenu
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });
  }

  drawBars() {
    this.healthBar.clear()
    this.healthBar.fillStyle(0x555555)
    this.healthBar.fillRect(20, 110, 200, 20)

    this.healthBar.fillStyle(0xff0000)
    this.healthBar.fillRect(20, 110, 2 * gameState.character.health, 20)

    this.happinessBar.clear()
    this.happinessBar.fillStyle(0x555555)
    this.happinessBar.fillRect(20, 140, 200, 20)

    this.happinessBar.fillStyle(0xffff00)
    this.happinessBar.fillRect(20, 140, 2 * gameState.character.happiness, 20)
  }


  showDialogue(messages) {
    this.dialogueMessages = messages
    this.dialogueIndex = 0

    const centerX = this.cameras.main.centerX
    const centerY = this.cameras.main.height - 180

    this.dialogueBox = this.add.rectangle(centerX, centerY, 900, 220, 0x000000, 0.8)
    this.dialogueBox.setStrokeStyle(2, 0xffffff)

    this.dialogueText = this.add.text(centerX - 430, centerY - 70, "", {
      fontSize: "24px",
      color: "#ffffff",
      wordWrap: { width: 860 },
    })

    this.nextButton = this.add.image(centerX + 360, centerY + 60, "nextButton")
      .setScale(0.2)
      .setInteractive()

    this.nextButton.on("pointerdown", () => {
      this.nextDialogue()
    })

    this.nextDialogue()
  }

  nextDialogue() {
    if (!this.dialogueMessages) return

    if (this.dialogueIndex >= this.dialogueMessages.length) {
      this.dialogueBox.destroy()
      this.dialogueText.destroy()
      this.nextButton.destroy()
      return
    }

    this.dialogueText.setText(this.dialogueMessages[this.dialogueIndex])
    this.dialogueIndex++
  }
}
