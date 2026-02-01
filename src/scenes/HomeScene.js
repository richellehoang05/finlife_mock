import Phaser from "phaser"
import { gameState } from "../GameState.js"

export class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene")
  }

preload() {
    this.load.image("userFr", "/pictures/userFr.png");
    this.load.image("home", "/pictures/home.png")
    this.load.image("nextButton", "/pictures/NEXT.png")
}

  create() {
    const { centerX, centerY } = this.cameras.main

    // Background
    const bg = this.add.image(centerX, centerY, "home")
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height)

    gameState.week += 1
    if ((gameState.week % 2) == 0) gameState.bank += 200

    // Add userFr image (top left corner)
        this.add.image(100, 45, 'userFr')
          .setOrigin(0.5)
          .setScale(0.5, 0.3);

    // BANK TEXT (always visible)
    this.bankText = this.add.text(20, 20, `Bank: $${gameState.bank}`, {
      fontSize: "22px",
      color: "#000000",
    })

    this.weekText = this.add.text(20, 50, `Week: ${gameState.week}`, {
      fontSize: "22px",
      color: "#000000",
    })
    // Escape key to return to MainMenu
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });
const messages = [
      `Welcome Home!`,
      `It is now week ${gameState.week}, and you have $${gameState.bank}.`,
      ]
    
    let next = 1

    // character check
    if (gameState.character.health <= 0) {
      next -= 1
      messages.push("Your health is at 0!")
      messages.push("Game Over!")
    } if (gameState.character.happiness <= 0) {
      next -= 1
      messages.push("Your happiness is at 0!")
      messages.push("Game Over!")
    } if (gameState.pet.happiness <= 0 || gameState.pet.health <= 0) {
      next -= 1
      messages.push("Your pet was not taken care of!")
      messages.push("Game Over!")
    }

  // show dialogue once
  this.showDialogue(messages)

    if (next < 1){
    // Add NEXT image button
    const nextBtn = this.add.image(this.cameras.main.width - 80, this.cameras.main.height - 60, "nextButton")
      .setScale(0.22)
      .setInteractive();
      gameState.reset()
    nextBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
    } else {
      // Add NEXT image button
    const nextBtn = this.add.image(this.cameras.main.width - 80, this.cameras.main.height - 60, "nextButton")
      .setScale(0.22)
      .setInteractive();
    nextBtn.on("pointerdown", () => {
      this.scene.start("GroceryScene");
    });
    }

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


