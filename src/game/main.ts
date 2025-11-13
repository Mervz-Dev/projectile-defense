import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth, // use full screen width
  height: window.innerHeight, // use full screen height
  parent: "game-container",
  backgroundColor: "#1c253c",
  scene: [MainGame],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT, // scale game to fit screen
    autoCenter: Phaser.Scale.CENTER_BOTH, // center it
  },
};

type Params = {
  name: string;
};

const StartGame = (parent: string, params?: Params) => {
  const game = new Game({ ...config, parent });
  if (params?.name) {
    game.registry.set("name", params?.name);
  }

  return game;
};

export default StartGame;
