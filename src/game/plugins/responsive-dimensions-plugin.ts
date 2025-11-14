import Phaser from "phaser";
import { getScreenSizeRatio } from "../../utils/resize";
import { BASE_HEIGHT, BASE_WIDTH } from "../../constants/dimensions";

export class ResponsiveDimensionsPlugin extends Phaser.Plugins.ScenePlugin {
  public screenSize = getScreenSizeRatio();
  public scaleFactor: number;

  public scaleX: number;
  public scaleY: number;

  constructor(
    scene: Phaser.Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string
  ) {
    super(scene, pluginManager, pluginKey);
    this.scaleFactor = 1;
  }

  boot(): void {
    this.scaleX = this.screenSize.width / BASE_WIDTH;
    this.scaleY = this.screenSize.height / BASE_HEIGHT;
    this.scaleFactor = Math.min(this.scaleX, this.scaleY);
  }

  addSprite(x: number, y: number, key: string) {
    const sprite = this.scene!.add.sprite(x, y, key);
    sprite.setScale(this.scaleFactor);
    return sprite;
  }

  scaleVelocity(velocity: number) {
    return velocity * this.scaleFactor;
  }
}
