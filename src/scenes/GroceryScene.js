import Phaser from "phaser"
import { gameState } from "../GameState.js"
import { createCharacterDisplay } from "../CharacterDisplay.js"
import { createPetDisplay } from "../PetDisplay.js"

export class GroceryScene extends Phaser.Scene {
  constructor() {
    super("GroceryScene")
  }

  preload() {
      this.load.image("userFr", "/pictures/userFr.png");
    this.load.image("shelf", "resources/grocery shelf.png")

    // Load NEXT button image
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
    this.load.image("dogfood", "Icons/canned_soup.png")
    this.load.image("cheese", "Icons/cheese_mozzarella.png")
    this.load.image("eggs", "Icons/eggs_brown.png")
    this.load.image("apple", "Icons/fruit_apple.png")
    this.load.image("bread", "Icons/pastry_bread.png")
    this.load.image("carrot", "Icons/vegetable_carrot.png")
    this.load.image("potato", "Icons/vegetable_potato.png")
    this.load.image("milk", "Icons/soymilk_soy.png")
    this.load.image("cake", "Icons/cake_chocolate.png")
    this.load.image("boba", "Icons/boba_taro.png")
    this.load.image("icecream", "Icons/icecream_2scoops.png")
    this.load.image("soda", "Icons/soda_coke.png")
  }

  create() {
    const { centerX, centerY } = this.cameras.main

    // Background
    const bg = this.add.image(centerX, centerY, "shelf")
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height)

    // Add userFr image (to display the character) left corner)
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
      color: "#010101",
    })

    // Escape key to return to MainMenu
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });

    // Store items
    this.items = [
      { key: "dogfood", name: "Dog Food", price: 5 },
      { key: "cheese", name: "Cheese", price: 7 },
      { key: "eggs", name: "Eggs", price: 4 },
      { key: "apple", name: "Apple", price: 2 },
      { key: "bread", name: "Bread", price: 6 },
      { key: "carrot", name: "Carrot", price: 3 },
      { key: "potato", name: "Potato", price: 4 },
      { key: "milk", name: "Milk", price: 3 },
      { key: "cake", name: "Cake", price: 10 },
      { key: "boba", name: "Boba", price: 12 },
      { key: "icecream", name: "Ice Cream", price: 9 },
      { key: "soda", name: "Soda", price: 3 },
    ]

    // Grocery list - use gameState to persist across scene visits
    if (gameState.currentGroceryList.length === 0) {
      gameState.currentGroceryList = this.generateGroceryList(this.items)
    }
    this.drawGroceryList()

    // Add character display with bars (below the grocery list)
    // List ends around y: 20 + 40 + (5 * 30) = 210 for 6 items
    // Position character below the list
    const listEndY = 20 + 40 + (gameState.currentGroceryList.length * 30)
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

    // Add NEXT image button in bottom right corner
    const nextBtn = this.add.image(this.cameras.main.width - 80, this.cameras.main.height - 60, "nextButton")
      .setScale(0.22)
      .setInteractive();
    nextBtn.on("pointerdown", () => {
      this.scene.start("DepartmentStoreScene");
    });
  }

  // BUY ITEM FUNCTION
  buyItem(item, icon) {
    // If a confirmation dialogue is open, close it before proceeding
    if (this.confirmDialogueOpen) {
      if (this.dialogueBox) this.dialogueBox.destroy();
      if (this.dialogueText) this.dialogueText.destroy();
      if (this.yesButton) this.yesButton.destroy();
      if (this.noButton) this.noButton.destroy();
      this.confirmDialogueOpen = false;
      // Continue to process the new item
    }
    const index = gameState.currentGroceryList.findIndex(i => i.key === item.key);
    // If not on grocery list, ask for confirmation
    if (index === -1) {
      if (gameState.bank < item.price) {
        this.showDialogue([`Not enough money to buy ${item.name}.`]);
        return;
      }
      const left = gameState.bank - item.price;
      this.showConfirmDialogue(
            [
              "Oops! This item isn’t on your list.",
              "",
              `It costs $${item.price}.`,
              "You’ll have less money after buying it.",
              "",
              "If you buy this item now, you might not have enough money later",
              "for important things — like food for you or your pet 🐶",
              "",
              "Do you want to buy it anyway?"
            ],
          
        () => {
          // Yes: proceed with purchase
          gameState.bank -= item.price;
          this.bankText.setText(`Bank: $${gameState.bank}`);
          gameState.addToInventory(item);
          // Update health/happiness for wants
          if (gameState.isWant(item.key)) {
            gameState.updateStat("character", "happiness", 10);
            gameState.updateStat("character", "health", -3);
          }
          this.characterDisplay.updateBars();
          this.petDisplay.updateBars();
          icon.setAlpha(0.4);
          icon.disableInteractive();
        }
      );
      return;
    }

    if (gameState.bank < item.price) {
      this.showDialogue([`Not enough money to buy ${item.name}.`]);
      return;
    }

    gameState.bank -= item.price;
    this.bankText.setText(`Bank: $${gameState.bank}`);

    // Add to inventory
    gameState.addToInventory(item);

    // Remove from grocery list
    gameState.currentGroceryList.splice(index, 1);
    this.drawGroceryList();

    // Update health/happiness based on item type
    if (item.key === "dogfood") {
      gameState.updateStat("pet", "health", 10);
      gameState.updateStat("pet", "happiness", 5);
    } else if (gameState.isNeed(item.key)) {
      gameState.updateStat("character", "health", 5);
    } else if (gameState.isWant(item.key)) {
      gameState.updateStat("character", "happiness", 10);
      gameState.updateStat("character", "health", -3);  // Unhealthy treats
    }

    this.characterDisplay.updateBars();
    this.petDisplay.updateBars();

    icon.setAlpha(0.4);
    icon.disableInteractive();
  }

  // Confirmation dialogue with Yes/No
  showConfirmDialogue(messages, onYes) {
    this.confirmDialogueOpen = true;
    this.dialogueMessages = messages;
    this.dialogueIndex = 0;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.height - 200;
    const boxHeight = 320; // Increased height for better message display

    this.dialogueBox = this.add.rectangle(centerX, centerY, 900, boxHeight, 0x000000, 0.8);
    this.dialogueBox.setStrokeStyle(2, 0xffffff);

    this.dialogueText = this.add.text(centerX - 430, centerY - 100, "", {
      fontSize: "24px",
      color: "#ffffff",
      wordWrap: { width: 860 },
    });

    // Yes/No buttons positioned at bottom right corner of the box
    const boxBottom = centerY + (boxHeight / 2);
    const boxRight = centerX + 400; // Positioned near the right edge with padding
    this.yesButton = this.add.text(boxRight - 60, boxBottom - 30, "Yes", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#228B22"
    }).setInteractive();
    this.noButton = this.add.text(boxRight + 20, boxBottom - 30, "No", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#B22222"
    }).setInteractive();

    this.yesButton.on("pointerdown", () => {
      this.dialogueBox.destroy();
      this.dialogueText.destroy();
      this.yesButton.destroy();
      this.noButton.destroy();
      this.confirmDialogueOpen = false;
      onYes();
    });
    this.noButton.on("pointerdown", () => {
      this.dialogueBox.destroy();
      this.dialogueText.destroy();
      this.yesButton.destroy();
      this.noButton.destroy();
      this.confirmDialogueOpen = false;
    });

    this.dialogueText.setText(this.dialogueMessages.join("\n"));
  }

  // Dialogue popup similar to GameScene
  showDialogue(messages) {
    this.dialogueMessages = messages;
    this.dialogueIndex = 0;

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.height - 180;

    this.dialogueBox = this.add.rectangle(centerX, centerY, 900, 220, 0x000000, 0.8);
    this.dialogueBox.setStrokeStyle(2, 0xffffff);

    this.dialogueText = this.add.text(centerX - 430, centerY - 70, "", {
      fontSize: "24px",
      color: "#ffffff",
      wordWrap: { width: 860 },
    });

    this.nextButton = this.add.text(centerX + 360, centerY + 60, "Next", {
      fontSize: "24px",
      color: "#fff",
      backgroundColor: "#333"
    }).setInteractive();

    this.nextButton.on("pointerdown", () => {
      this.nextDialogue();
    });

    this.nextDialogue();
  }

  nextDialogue() {
    if (!this.dialogueMessages) return;

    if (this.dialogueIndex >= this.dialogueMessages.length) {
      this.dialogueBox.destroy();
      this.dialogueText.destroy();
      this.nextButton.destroy();
      return;
    }

    this.dialogueText.setText(this.dialogueMessages[this.dialogueIndex]);
    this.dialogueIndex++;
  }

  generateGroceryList(items) {
    return items.slice().sort(() => 0.5 - Math.random()).slice(0, 6)
  }

  drawGroceryList() {
    if (this.groceryTexts) {
      this.groceryTexts.forEach(t => t.destroy())
    }
    this.groceryTexts = []

    const x = this.cameras.main.width - 20
    const y = 20

    this.groceryTexts.push(
      this.add.text(x, y, "Grocery List", {
        fontSize: "24px",
        color: "#000000",
        backgroundColor: "#ffffff"
      }).setOrigin(1, 0)
    )

    gameState.currentGroceryList.forEach((item, index) => {
      // Use gameState helper to check need vs want
      const color = gameState.isNeed(item.key) ? "#ff0000" : "#b000ff"

      this.groceryTexts.push(
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
