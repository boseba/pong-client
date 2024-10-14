import { IOffset, ISize, IVector } from "../interfaces/interfaces.exports";
import { Boundaries } from "./boundaries.model";
import { Drawable } from "./drawable.model";
import { GameContext } from "./game.model";

export abstract class Sprite extends Drawable {
  offset: IOffset = { x: 0, y: 0 };
  size: ISize = { width: 0, height: 0 };
  boundaries: Boundaries = new Boundaries();

  constructor(gameContext: GameContext, x: number, y: number, width: number, height: number) {
    super(gameContext);

    this.offset = { x, y };
    this.size = { width, height };
  }

  update(delay: number) { }

  drawBoundaries() {
    this._gameContext.ctx.strokeStyle = 'red';
    this._gameContext.ctx.lineWidth = 1;
    this._gameContext.ctx.strokeRect(this.boundaries.left, this.boundaries.top, this.boundaries.width, this.boundaries.height);

    this._gameContext.ctx.fillStyle = 'yellow';
    this._gameContext.ctx.fillRect(this.offset.x, this.offset.y, 1, 1);
  }

  setPosition(x: number, y: number) {
    this.offset.x = x;
    this.offset.y = y;

    this.boundaries.update(this.offset, this.size);
  }

  protected setStyle(fillColor: string, strokeWidth: number = 0, strokeColor: string = 'transparent') {
    this._gameContext.ctx.fillStyle = fillColor;
    this._gameContext.ctx.lineWidth = strokeWidth;
    this._gameContext.ctx.strokeStyle = strokeColor;
  }

  protected blur(color: string, intensity: number) {
    this._gameContext.ctx.shadowBlur = intensity;
    this._gameContext.ctx.shadowColor = color;
  }

  protected resetBlur() {
    this._gameContext.ctx.shadowBlur = 0;
    this._gameContext.ctx.shadowColor = 'transparent';
  }
}

export abstract class AnimatedSprite extends Sprite {
  speed: number = 0;
  currentSpeed: number = 0;
  direction: IVector = { x: 0, y: 0 };

  constructor(gameContext: GameContext, x: number, y: number, width: number, height: number) {
    super(gameContext, x, y, width, height);
    this.boundaries.update(this.offset, this.size);
  }

  override update(delay: number) {
    if(this.direction.x === 0 && this.direction.y === 0) {
      this.currentSpeed = 0;      
      return;
    }
    
    this.setPosition(this.offset.x + (this.direction.x * this.speed * delay), this.offset.y + (this.direction.y * this.speed * delay));
  }

  moveUp() {
    this.direction.y = -1;
  }

  moveDown() {
    this.direction.y = 1;
  }

  moveLeft() {
    this.direction.x = -1;
  }

  moveRight() {
    this.direction.x = 1;
  }

  stopMove() {
    this.direction.x = 0;
    this.direction.y = 0;
  }
}