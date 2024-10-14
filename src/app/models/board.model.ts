import { GameContext } from "./game.model";
import { Sprite } from "./sprite.model";

export class Board extends Sprite {
  private readonly _backgroundColor: string;
  private readonly _linesColor: string = 'rgba(255,255,255,0.2';
  private readonly _linesWidth: number = 8;
  private _backgroundData!: ImageData;

  constructor(gameContext: GameContext, backgroundColor: string) {
    super(gameContext, 0, 0, gameContext.size.width, gameContext.size.height);
    this._backgroundColor = backgroundColor;
  }

  override draw() {
    if(!this._backgroundData) {
      this.drawBackground();
      this.drawLines();

      this._backgroundData = this._gameContext.ctx.getImageData(this.offset.x, this.offset.y, this.size.width, this.size.height);
    } else {
      this._gameContext.ctx.putImageData(this._backgroundData, 0, 0);
    }
  }

  private drawBackground() {
    this._gameContext.ctx.fillStyle = this._backgroundColor;
    this._gameContext.ctx.fillRect(this.offset.x, this.offset.y, this.size.width, this.size.height);
  }

  private drawLines() {
    this._gameContext.ctx.strokeStyle = this._linesColor;
    this._gameContext.ctx.lineWidth = this._linesWidth;
    this._gameContext.ctx.strokeRect(this.offset.x + 8, this.offset.y + 8, this.size.width - 16, this.size.height - 16);

    this._gameContext.ctx.beginPath();
    this._gameContext.ctx.moveTo (this.offset.x + this.size.width / 2, this.offset.y + 8 + 8);
    this._gameContext.ctx.lineTo (this.offset.x + this.size.width / 2, this.offset.y + (this.size.height - 8 - 8));

    this._gameContext.ctx.moveTo (this.offset.x + 16, this.offset.y + this.size.height / 2);
    this._gameContext.ctx.lineTo (this.offset.x + (this.size.width / 2) - 8, this.offset.y + this.size.height / 2);

    this._gameContext.ctx.moveTo (this.offset.x + (this.size.width / 2) + 8, this.offset.y + this.size.height / 2);
    this._gameContext.ctx.lineTo (this.offset.x + this.size.width - 8 - 8, this.offset.y + this.size.height / 2);
    this._gameContext.ctx.stroke();

    const gradient = this._gameContext.ctx.createRadialGradient(this.size.width / 2, this.size.height / 2, 0, this.size.width / 2, this.size.height / 2, this.size.width / 2);
  
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

    this._gameContext.ctx.fillStyle = gradient;
    this._gameContext.ctx.fillRect(this.offset.x, this.offset.y, this.size.width, this.size.height);
  }
}