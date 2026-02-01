import { gameState } from "./GameState.js"

/**
 * Adds the selected character with Health and Happiness bars above it.
 * Call from any scene after character sprites (girl, boy) are loaded.
 *
 * @param {Phaser.Scene} scene - The Phaser scene to add the display to
 * @param {Object} options - Position and size
 * @param {number} options.x - Center X of the character
 * @param {number} options.y - Center Y of the character
 * @param {number} options.width - Display width of the character
 * @param {number} options.height - Display height of the character
 * @param {number} [options.depth=10] - Render depth
 * @returns {{ sprite: Phaser.GameObjects.Sprite, updateBars: () => void, destroy: () => void }}
 */
export function createCharacterDisplay(scene, options) {
  const { x, y, width, height, depth = 10 } = options

  const charType = gameState.character?.type ?? "A"
  const spriteKey = charType === "A" ? "girl" : "boy"

  const sprite = scene.add.sprite(x, y, spriteKey, 0)
    .setDisplaySize(width, height)
    .setOrigin(0.5, 0.5)
    .setDepth(depth)

  const barWidth = width * 0.56 // 20% shorter than original (0.7 * 0.8 = 0.56)
  const barHeight = 16
  const barLeft = x - barWidth / 2
  const barAreaTop = y - height / 2 - 70

  const healthLabel = scene.add.text(x, barAreaTop, "Health", {
    fontSize: "18px",
    color: "#ffffff",
  }).setOrigin(0.5, 0).setDepth(depth)

  const healthBarBg = scene.add.graphics().setDepth(depth)
  const healthBarFill = scene.add.graphics().setDepth(depth)

  const happinessLabel = scene.add.text(x, barAreaTop + 22 + barHeight + 8, "Happiness", {
    fontSize: "18px",
    color: "#ffffff",
  }).setOrigin(0.5, 0).setDepth(depth)

  const happinessBarBg = scene.add.graphics().setDepth(depth)
  const happinessBarFill = scene.add.graphics().setDepth(depth)

  function drawBars() {
    const health = gameState.character.health
    const happiness = gameState.character.happiness

    healthBarBg.clear()
    healthBarBg.fillStyle(0x555555)
    healthBarBg.fillRect(barLeft, barAreaTop + 22, barWidth, barHeight)

    healthBarFill.clear()
    healthBarFill.fillStyle(0xff0000)
    healthBarFill.fillRect(barLeft, barAreaTop + 22, barWidth * (health / 100), barHeight)

    happinessBarBg.clear()
    happinessBarBg.fillStyle(0x555555)
    happinessBarBg.fillRect(barLeft, barAreaTop + 22 + barHeight + 8 + 22, barWidth, barHeight)

    happinessBarFill.clear()
    happinessBarFill.fillStyle(0xffff00)
    happinessBarFill.fillRect(barLeft, barAreaTop + 22 + barHeight + 8 + 22, barWidth * (happiness / 100), barHeight)
  }

  drawBars()

  return {
    sprite,
    updateBars: drawBars,
    destroy() {
      sprite.destroy()
      healthLabel.destroy()
      happinessLabel.destroy()
      healthBarBg.destroy()
      healthBarFill.destroy()
      happinessBarBg.destroy()
      happinessBarFill.destroy()
    },
  }
}