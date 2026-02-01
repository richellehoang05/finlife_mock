import Phaser from "phaser"
import { gameState } from "../GameState.js"

export class BankScene extends Phaser.Scene {
  constructor() {
    super("BankScene")
  }

  /**
   * Load the assets (images, sounds, etc.)
   */
  preload() {
    this.load.image("userFrame", "/pictures/userFr.png")
  }

  create() {
    // Add picture as base layer
    this.add.image(0, 0, "userFrame").setOrigin(0, 0).setScale(0.7, 0.25)

    this.bankText = this.add.text(30, 22, `Bank: $${gameState.bank}`, {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#0a0a0a",
    })
    this.bankText.setScrollFactor(0)
    // Escape key to return to MainMenu
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });
  }

  update() {
    // Always sync with gameState so purchases in other scenes show correctly
    this.bankText.setText(`Bank: $${gameState.bank}`)
  }
}
