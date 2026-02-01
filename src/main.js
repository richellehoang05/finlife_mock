import Phaser from "phaser"
import { MainMenu } from "./scenes/MainMenu.js"
import { CharacterSelect } from "./scenes/CharacterSelect.js"
import { GameScene } from "./scenes/GameScene.js"
import { ClinicScene } from "./scenes/ClinicScene.js"
import { DepartmentStoreScene } from "./scenes/DepartmentStoreScene.js"
import { HomeScene } from "./scenes/HomeScene.js"
import { GroceryScene } from "./scenes/GroceryScene.js"
import { BankScene } from "./scenes/BankScene.js"

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#1d1d1d",
  scene: [MainMenu, CharacterSelect, GameScene, HomeScene, GroceryScene, DepartmentStoreScene, ClinicScene, BankScene],
}

new Phaser.Game(config)

