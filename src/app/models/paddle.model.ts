import { Subject } from "rxjs";
import { Position } from "../enums/position.enum";
import { IOffset, ISize } from "../interfaces/interfaces.exports";
import { Ball } from "./ball.model";
import { GameContext } from "./game.model";
import { AnimatedSprite, Sprite } from "./sprite.model";
import { Guid } from "../shared/models/guid.model";

export class Paddle extends Sprite {
  static defaultSize: ISize = { width: 16, height: 128 };
  static defaultBackgroundColor: string = 'rgba(255,255,255,0.4)';
  static defaultBlurcolor: string = 'transparent';
  static collidedBlurcolor: string = 'rgba(255,255,255,0.8)';
  static hitBlurcolor: string = 'rgba(0,255,0,0.8)';

  private readonly _backgroundColor: string = Paddle.defaultBackgroundColor;
  private readonly _strokeColor: string = 'rgba(255,255,255,0.8';
  private readonly _position: Position;

  constructor(gameContext: GameContext, position: Position) {
    const offset: IOffset = { x: position === Position.Left ? 32 : gameContext.size.width - 32, y: gameContext.size.height / 2  };
    super(gameContext, offset.x, offset.y, Paddle.defaultSize.width, Paddle.defaultSize.height);
    this._position = position;
    this.boundaries.update(this.offset, this.size);
  }

  override draw() {
    this._gameContext.ctx.fillStyle = this._backgroundColor;
    this._gameContext.ctx.strokeStyle = this._strokeColor;
    this._gameContext.ctx.lineWidth = 2;

    this._gameContext.ctx.beginPath();
    this._gameContext.ctx.roundRect(this.boundaries.left, this.boundaries.top, this.size.width, this.size.height, 4);
    this._gameContext.ctx.fill();
    this._gameContext.ctx.stroke();
  }
}

export class AnimatedPaddle extends AnimatedSprite {  
  private _backgroundColor: string = 'rgba(255,255,255,0.4)';
  private _blurColor: string = 'transparent';
  private _blurSize: number = 0;

  private readonly _strokeColor: string = 'rgba(255,255,255,0.8)';
  private readonly _position: Position;
  private readonly _ball: Ball;
  private readonly _missesBall: Subject<Position> = new Subject();
  private readonly _collisionAnimationDuration = 0.24;
  private _collisionAnimationTime = 0;

  private _misses: boolean = false;
  private _collided: boolean = false;

  id: Guid;

  missesBall = this._missesBall.asObservable();

  constructor(gameContext: GameContext, position: Position, ball: Ball) {
    const offset: IOffset = { x: position === Position.Left ? 32 : gameContext.size.width - 32, y: gameContext.size.height / 2  };
    super(gameContext, offset.x, offset.y, Paddle.defaultSize.width, Paddle.defaultSize.height);

    this._position = position;
    this._ball = ball;
    this.speed = 512;
    this.boundaries.update(this.offset, this.size);
    this.id = Guid.create();
  }

  override draw() {
    this.setStyle(this._backgroundColor, 2, this._strokeColor);
    this.blur(this._blurColor, this._blurSize);

    this._gameContext.ctx.beginPath();
    this._gameContext.ctx.roundRect(this.boundaries.left, this.boundaries.top, this.size.width, this.size.height, 4);
    this._gameContext.ctx.fill();
    this._gameContext.ctx.stroke();

    this.resetBlur();
  }

  override update(delay: number): void {
    super.update(delay);

    if(this._collided) {
      this.animateCollision(delay);
    }

    if (this.boundaries.top < 16) {
      this.setPosition(this.offset.x, 16 + this.size.height / 2);
    } else if (this.boundaries.bottom > this._gameContext.size.height - 16) {
      this.setPosition(this.offset.x, this._gameContext.size.height - 16 - this.size.height / 2);
    }

    this.detectCollision();
  }
  
  pulse() {
    if(this._collided) {
      console.log('Pulsing');
      this._blurColor = Paddle.hitBlurcolor;   
      this._ball.pulse();   
    }
  }

  private detectCollision() {
    if (!this._misses) {
      if (this._position === Position.Left) {
        if (this._ball.boundaries.left <= this.boundaries.right) {
          if (
            this._ball.boundaries.bottom >= this.boundaries.top &&
            this._ball.boundaries.top <= this.boundaries.bottom
          ) {
            this._ball.reverseDirection(this.boundaries.top, this.boundaries.height, 1);

            this.hit();
  
            this._ball.offset.x = this.boundaries.right + (this._ball.size.width / 2);
            this._ball.boundaries.update(this._ball.offset, this._ball.size);
          } else {
            this._misses = true;
          }
        }
      } else if (this._position === Position.Right) {
        if (this._ball.boundaries.right >= this.boundaries.left) {
          if (
            this._ball.boundaries.bottom >= this.boundaries.top &&
            this._ball.boundaries.top <= this.boundaries.bottom
          ) {
            this._ball.reverseDirection(this.boundaries.top, this.boundaries.height, -1);            

            this.hit();
  
            this._ball.offset.x = this.boundaries.left - (this._ball.size.width / 2);
            this._ball.boundaries.update(this._ball.offset, this._ball.size);
          } else {
            this._misses = true;
          }
        }
      }
    } else {
      if (this._ball.boundaries.right <= 0 || this._ball.boundaries.left >= this._gameContext.size.width) {
        this._misses = false;
        this._missesBall.next(this._position);
      }
    }
  }

  hit() {                
    this._collided = true;
    this._blurColor = Paddle.collidedBlurcolor; 
    this._blurSize = 20; 
  }

  reset() {    
    this.setPosition(this.offset.x, this._gameContext.size.height / 2);
    console.log('Paddle reset: ' + this.offset.y);
  }

  private animateCollision(delay: number) {
    if(this._collisionAnimationTime > this._collisionAnimationDuration) {
      this._collided = false;
      this._blurSize = 0;
      this._blurColor = Paddle.defaultBlurcolor;
      this._collisionAnimationTime = 0;
    } else {
      this._collisionAnimationTime += delay;
    }
  }
}

export class OpponentPaddle extends Paddle {
}

export class PlayerPaddle extends AnimatedPaddle {
}

export class ComputerPaddle extends AnimatedPaddle {
  constructor(gameContext: GameContext, ball: Ball) {
    super(gameContext, Position.Right, ball);    
  }
}