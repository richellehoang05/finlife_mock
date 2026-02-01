import Phaser from "phaser"
import { gameState } from "../GameState.js"
import { createCharacterDisplay } from "../CharacterDisplay.js"
import { createPetDisplay } from "../PetDisplay.js"

export class DepartmentStoreScene extends Phaser.Scene {
  constructor() {
    super("DepartmentStoreScene")
  }

  preload() {
    this.load.image("shelf", "resources/depshelf.avif")
    this.load.image("nextButton", "/pictures/NEXT.png")

    this.load.spritesheet("girl", "resources/girlchar.png", {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet("boy", "resources/boychar.png", {
      frameWidth: 32,
      frameHeight: 32,
    })

    this.load.spritesheet("dog", "resources/dog.png", {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image("bandages", "Pixel_Mart/bandage_box.png")
    this.load.image("batteries", "Pixel_Mart/batteries.png")
    this.load.image("lotion", "Pixel_Mart/body_lotion.png")
    this.load.image("pan", "Pixel_Mart/frying pan.png")
    this.load.image("detergent", "Pixel_Mart/detergent.png")
    this.load.image("sanitizer", "Pixel_Mart/hand_sanitiser.png")
    this.load.image("soap", "Pixel_Mart/soap.png")
    this.load.image("bulb", "Pixel_Mart/light_bulb.png")
    this.load.image("toiletpaper", "Pixel_Mart/toilet_paper.png")
    this.load.image("ducktopus", "Pixel_Mart/rubber_ducktopus.png")
    this.load.image("pencilcase", "Pixel_Mart/pencil_box.png")
    this.load.image("duck", "Pixel_Mart/rubber_duck.png")
  }

  create() {
    const { centerX, centerY } = this.cameras.main

    gameState.currentGroceryList.forEach((item) => {
      if (gameState.needItems.includes(item.key)) {
        if (item == "dogfood") {
          gameState.pet.health -= 20
        } else {
          gameState.character.health -= 10
        }
      }
      if (gameState.wantItems.includes(item.key)) {
        gameState.character.happiness -= 10
      }
    })

    // Background
    const bg = this.add.image(centerX, centerY, "shelf")
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height)

    // BANK TEXT (always visible)
    this.bankText = this.add.text(20, 20, `Bank: $${gameState.bank}`, {
      fontSize: "22px",
      color: "#000000",
    })

    this.weekText = this.add.text(20, 50, `Week: ${gameState.week}`, {
      fontSize: "22px",
      color: "#000000",
    })

    // Store items
    this.items = [
      { key: "bandages", name: "Bandages", price: 7 },
      { key: "batteries", name: "Batteries", price: 12 },
      { key: "lotion", name: "Lotion", price: 8 },
      { key: "pan", name: "Frying Pan", price: 25 },
      { key: "detergent", name: "Detergent", price: 11 },
      { key: "sanitizer", name: "Hand Sanitizer", price: 2 },
      { key: "soap", name: "Soap", price: 3 },
      { key: "bulb", name: "Light Bulb", price: 6 },
      { key: "toiletpaper", name: "Toilet Paper", price: 4 },
      { key: "ducktopus", name: "Ducktopus", price: 15 },
      { key: "pencilcase", name: "Pencil Case", price: 13 },
      { key: "duck", name: "Rubber Duck", price: 12 },
    ]

    if (gameState.currentDeptList.length === 0) {
      gameState.currentDeptList = this.generateDeptList(this.items)
    }
    this.drawDeptList()

    // Add character display with bars (below the item list)
    // List ends around y: 20 + 40 + (5 * 30) = 210 for 6 items
    // Position character below the list
    const listEndY = 20 + 40 + (gameState.currentDeptList.length * 30)
    const characterY = listEndY + 100 + (this.cameras.main.height / 4) // more padding to move character lower
    const characterX = this.cameras.main.width - 20 - (this.cameras.main.width / 6) // Aligned with list on right side
    const charScale = 0.9 // Scale factor for character size
    const baseCharacterWidth = this.cameras.main.width / 3
    const baseCharacterHeight = this.cameras.main.height / 2
    const characterWidth = baseCharacterWidth * charScale
    const characterHeight = baseCharacterHeight * charScale
    
    this.characterDisplay = createCharacterDisplay(this, {
      x: characterX,
      y: characterY,
      width: characterWidth,
      height: characterHeight,
      depth: 20
    })

    // Add pet display next to the character (to the right), proportional size
    const petScale = 0.4 // Scale factor to maintain proportions
    const petX = characterX + 170// 20 pixels to the right of character
    const petY = characterY + 130 // 50 pixels lower than character
    this.petDisplay = createPetDisplay(this, {
      x: petX,
      y: petY,
      width: characterWidth * petScale,
      height: characterHeight * petScale,
      depth: 20
    })

    // Shelf layout
    const startX = 200
    const startY = 140
    const gapX = 270
    const gapY = 260
    const itemsPerRow = 4

    this.items.forEach((item, index) => {
      const col = index % itemsPerRow
      const row = Math.floor(index / itemsPerRow)

      const x = startX + col * gapX
      const y = startY + row * gapY

      const icon = this.add.image(x, y, item.key)
        .setScale(3)
        .setInteractive({ useHandCursor: true })

      this.add.text(x, y + 70, `$${item.price}`, {
        fontSize: "22px",
        color: "#ffffff",
      }).setOrigin(0.5)

      icon.on("pointerdown", () => {
        this.buyItem(item, icon)
      })
    })

    // Add NEXT image button
    const nextBtn = this.add.image(this.cameras.main.width - 80, this.cameras.main.height - 60, "nextButton")
      .setScale(0.22)
      .setInteractive();
    nextBtn.on("pointerdown", () => {
      this.scene.start("DepartmentStoreScene");
    });
  }

  // BUY ITEM FUNCTION
  buyItem(item, icon) {
    const index = gameState.currentDeptList.findIndex(i => i.key === item.key)
    if (index === -1) return

    if (gameState.bank < item.price) return

    gameState.bank -= item.price
    this.bankText.setText(`Bank: $${gameState.bank}`)

    // Add to inventory
    gameState.addToInventory(item)

    gameState.currentDeptList.splice(index, 1)
    this.drawDeptList()

    this.characterDisplay.updateBars()
    this.petDisplay.updateBars()

    // Update health/happiness based on item type
    if (item.key === "dogfood") {
      gameState.updateStat("pet", "health", 10)
      gameState.updateStat("pet", "happiness", 5)
    } else if (gameState.isNeed(item.key)) {
      gameState.updateStat("character", "health", 5)
    } else if (gameState.isWant(item.key)) {
      gameState.updateStat("character", "happiness", 10)
      gameState.updateStat("character", "health", -3)  // Unhealthy treats
    }

    icon.setAlpha(0.4)
    icon.disableInteractive()
  }

  generateDeptList(items) {
    return items.slice().sort(() => 0.5 - Math.random()).slice(0, 6)
  }

  drawDeptList() {
    if (this.deptTexts) {
      this.deptTexts.forEach(t => t.destroy())
    }
    this.deptTexts = []

    const x = this.cameras.main.width - 20
    const y = 20

    this.deptTexts.push(
      this.add.text(x, y, "Department List", {
        fontSize: "24px",
        color: "#000000",
        backgroundColor: "#ffffff"
      }).setOrigin(1, 0)
    )

    gameState.currentDeptList.forEach((item, index) => {
      // Use gameState helper to check need vs want
      const color = gameState.isNeed(item.key) ? "#ff0000" : "#b000ff"

      this.deptTexts.push(
        this.add.text(
          x,
          y + 40 + index * 30,
          `${item.name} - $${item.price}`,
          { fontSize: "20px", color, backgroundColor: "#ffffff" }
        ).setOrigin(1, 0)
      )
    })
  }
}
