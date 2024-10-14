import { IOffset, ISize } from "../interfaces/interfaces.exports";
import { GameContext } from "./game.model";
import { AnimatedSprite } from "./sprite.model";

export class Ball extends AnimatedSprite {
  static defaultSize: ISize = { width: 16, height: 16 };
  static defaultSpeed: number = 256;
  static height: number = 128;

  private readonly _backgroundColor: string = 'rgba(255,255,255,0.5)';
  private readonly _trailColor: string = 'rgba(255,255,255,0.1)';
  private readonly _strokeColor: string = 'rgba(255,255,255,0.8)';
  private readonly _hitPaddleSound: HTMLAudioElement;
  private previousPositions: IOffset[] = [];
  private maxTrailLength = 6;

  constructor(gameContext: GameContext, offset: IOffset) {
    super(gameContext, offset.x, offset.y, Ball.defaultSize.width, Ball.defaultSize.height);
    this.speed = Ball.defaultSpeed;
    this.direction.x = 1;

    this._hitPaddleSound = new Audio('assets/sounds/pop.mp3');
    this._hitPaddleSound.volume = 1;
    this._hitPaddleSound.loop = false;
    this._hitPaddleSound.preload = 'auto';
  }

  override draw() {
    this.drawTrail();

    this.setStyle(this._backgroundColor, 2, this._strokeColor);

    this._gameContext.ctx.beginPath();
    this._gameContext.ctx.arc(this.offset.x, this.offset.y, this.size.width / 2, 0, 2 * Math.PI);  
    this._gameContext.ctx.fill();
    this._gameContext.ctx.stroke();
  }

  drawTrail() {
    const ctx = this._gameContext.ctx;

    for (let i = 0; i < this.previousPositions.length; i++) {
      const pos = this.previousPositions[i];
      const opacity = (i + 1) / this.previousPositions.length;

      this.setStyle(this._trailColor, 2, this._trailColor);

      this._gameContext.ctx.beginPath();
      this._gameContext.ctx.arc(pos.x, pos.y, this.size.width / 2, 0, 2 * Math.PI);
      this._gameContext.ctx.fill();
      this._gameContext.ctx.stroke();
    }
  }  override update(delay: number): void {
    super.update(delay);

    this.previousPositions.unshift({ x: this.offset.x, y: this.offset.y });
    if (this.previousPositions.length > this.maxTrailLength) {
      this.previousPositions.pop();
    }

    if (this.boundaries.top <= 8) {
      this.offset.y = 8 + this.size.height / 2;
      this.direction.y *= -1;
    } else if (this.boundaries.bottom >= this._gameContext.size.height - 8) {
      this.offset.y = this._gameContext.size.height - 8 - this.size.height / 2;
      this.direction.y *= -1;
    }

    this.boundaries.update(this.offset, this.size);
  }

  reset() {
    this.offset.x = this._gameContext.size.width / 2;
    this.offset.y = this._gameContext.size.height / 2;
    this.direction = { x: 1, y: 0 };
    this.speed = Ball.defaultSpeed;
    this.previousPositions.length = 0;
    this.boundaries.update(this.offset, this.size);
  }

  reverseDirection(paddleTop: number, paddleHeight: number, paddleSide: number) {
    this._hitPaddleSound.play();

    const collisionPoint = this.offset.y - paddleTop;
    const relativeCollision = (collisionPoint - paddleHeight / 2) / (paddleHeight / 2);
    const maxAngle = Math.PI / 4;
    const angle = relativeCollision * maxAngle;

    this.direction.x = paddleSide;
    this.direction.y = Math.sin(angle);

    const speedAdjustment = Math.sqrt(1 + Math.pow(this.direction.y, 2));
    this.direction.x /= speedAdjustment;
    this.direction.y /= speedAdjustment;
  }

  pulse() {
    this.speed *= 2;
    setTimeout(() => {
      this.speed /= 2;
    }, 2000)
  }
}