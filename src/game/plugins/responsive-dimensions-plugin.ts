import Phaser from "phaser";
import { getScreenSizeRatio } from "../../utils/resize";

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

  preload() {
    this.scaleX = this.scene!.scale.width / this.screenSize.width;
    this.scaleY = this.scene!.scale.height / this.screenSize.height;
    this.scaleFactor = Math.min(this.scaleX, this.scaleY);
  }

  addSprite(x: number, y: number, key: string) {
    this.preload();

    const newX = this.scaleX * x;
    const newY = this.scaleY * y;

    const sprite = this.scene!.add.sprite(newX, newY, key);
    sprite.setScale(this.scaleFactor);
    return sprite;
  }

  scaleVelocity(velocity: number) {
    this.preload();
    return velocity * this.scaleFactor;
  }
}
