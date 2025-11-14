import { getScreenSizeRatio } from "../utils/resize";
import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game, Types } from "phaser";
import { ResponsiveDimensionsPlugin } from "./plugins/responsive-dimensions-plugin";

const { width, height } = getScreenSizeRatio();

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: width, // use full screen width
  height: height, // use full screen height
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
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    scene: [
      {
        key: "ResponsiveDimensionsPlugin",
        plugin: ResponsiveDimensionsPlugin,
        mapping: "responsive",
      },
    ],
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
