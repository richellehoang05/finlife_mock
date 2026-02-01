import { gameState } from "./GameState.js"

/**
 * Adds the pet with Health and Happiness bars above it.
 * Call from any scene after pet spritesheet is loaded.
 *
 * @param {Phaser.Scene} scene - The Phaser scene to add the display to
 * @param {Object} options - Position and size
 * @param {number} options.x - Center X of the pet
 * @param {number} options.y - Center Y of the pet
 * @param {number} options.width - Display width of the pet
 * @param {number} options.height - Display height of the pet
 * @param {number} [options.depth=10] - Render depth
 * @returns {{ sprite: Phaser.GameObjects.Sprite, updateBars: () => void, destroy: () => void }}
 */
export function createPetDisplay(scene, options) {
  const { x, y, width, height, depth = 10 } = options

  // Create animation if it doesn't exist
  if (!scene.anims.exists("dogIdle")) {
    scene.anims.create({
      key: "dogIdle",
      frames: scene.anims.generateFrameNumbers("dog", { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1,
    })
  }

  // Create sprite - use sprite key and initial frame
  const sprite = scene.add.sprite(x, y, "dog", 0)
    .setDisplaySize(width, height)
    .setOrigin(0.5, 0.5)
    .setDepth(depth)
  
  // Play animation
  sprite.play("dogIdle")

  const barWidth = width * 0.7
  const barHeight = 12
  const barLeft = x - barWidth / 2
  const barAreaTop = y - height / 2 - 50

  const healthLabel = scene.add.text(x, barAreaTop, "Health", {
    fontSize: "14px",
    color: "#ffffff",
  }).setOrigin(0.5, 0).setDepth(depth)

  const healthBarBg = scene.add.graphics().setDepth(depth)
  const healthBarFill = scene.add.graphics().setDepth(depth)

  const happinessLabel = scene.add.text(x, barAreaTop + 18 + barHeight + 6, "Happiness", {
    fontSize: "14px",
    color: "#ffffff",
  }).setOrigin(0.5, 0).setDepth(depth)

  const happinessBarBg = scene.add.graphics().setDepth(depth)
  const happinessBarFill = scene.add.graphics().setDepth(depth)

  function drawBars() {
    const health = gameState.pet.health
    const happiness = gameState.pet.happiness

    healthBarBg.clear()
    healthBarBg.fillStyle(0x555555)
    healthBarBg.fillRect(barLeft, barAreaTop + 18, barWidth, barHeight)

    healthBarFill.clear()
    healthBarFill.fillStyle(0xff0000)
    healthBarFill.fillRect(barLeft, barAreaTop + 18, barWidth * (health / 100), barHeight)

    happinessBarBg.clear()
    happinessBarBg.fillStyle(0x555555)
    happinessBarBg.fillRect(barLeft, barAreaTop + 18 + barHeight + 6 + 18, barWidth, barHeight)

    happinessBarFill.clear()
    happinessBarFill.fillStyle(0xffff00)
    happinessBarFill.fillRect(barLeft, barAreaTop + 18 + barHeight + 6 + 18, barWidth * (happiness / 100), barHeight)
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
