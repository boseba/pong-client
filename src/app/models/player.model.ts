import { Subject } from "rxjs";
import { PlayerType } from "../enums/player-type.enum";
import { Position } from "../enums/position.enum";
import { IOffset } from "../interfaces/offset.interface";
import { ISize } from "../interfaces/size.interface";
import { Guid } from "../shared/models/guid.model";
import { Ball } from "./ball.model";
import { Drawable } from "./drawable.model";
import { GameContext } from "./game.model";
import { AnimatedPaddle, ComputerPaddle, OpponentPaddle, Paddle, PlayerPaddle } from "./paddle.model";

export abstract class Player extends Drawable {

  protected readonly _missesBall: Subject<Player> = new Subject();

  protected _paddle!: OpponentPaddle | PlayerPaddle | ComputerPaddle;
  protected readonly _ball: Ball;

  protected _scoreLocation: number = 0;

  id: Guid;
  name: string;
  score: number = 0;
  type: PlayerType;
  missesBall = this._missesBall.asObservable();


  constructor(gameContext: GameContext, name: string, type: PlayerType, ball: Ball) {
    super(gameContext);

    this.id = Guid.create();
    this.name = name;
    this.type = type;
    this._ball = ball;
  }

  override draw() {
    this._paddle.draw();

    this._gameContext.ctx.fillStyle = 'rgba(255,255,255,0.05)';
    this._gameContext.ctx.font = '256px Arial';
    this._gameContext.ctx.textAlign = 'center';
    this._gameContext.ctx.textBaseline = 'middle';
    this._gameContext.ctx.fillText(this.score.toString(), this._scoreLocation, (this._gameContext.size.height * 3 / 4));

    this._gameContext.ctx.font = '64px Arial';
    this._gameContext.ctx.fillText(this.name, this._scoreLocation, (this._gameContext.size.height / 4));
  }

  drawBoundaries() {
    this._paddle.drawBoundaries();
  }

  update(delay: number) {
    if(this.type !== PlayerType.Opponent) {
      this._paddle.update(delay);
    }
  }

  movePaddleUp() {
    if(this.type === PlayerType.Player) {
      (this._paddle as AnimatedPaddle).moveUp();
    }
  }

  movePaddleDown() {
    if(this.type === PlayerType.Player) {
      (this._paddle as AnimatedPaddle).moveDown();
    }
  }

  stopPaddleMove() {
    if(this.type === PlayerType.Player) {
      (this._paddle as AnimatedPaddle).stopMove();
    }
  }

  pulsePaddle() {
    if(this.type === PlayerType.Player) {
      (this._paddle as AnimatedPaddle).pulse();
    }
  }

  reset() {
    if(this.type !== PlayerType.Opponent) {
      (this._paddle as AnimatedPaddle).reset();
    }
  }
}

export class GuestPlayer extends Player {

  constructor(gameContext: GameContext, name: string, type: PlayerType = PlayerType.Opponent, ball: Ball) {
    super(gameContext, name, type, ball);
    this._scoreLocation = this._gameContext.size.width * 3 / 4;

    if(type === PlayerType.Opponent) {
      this._paddle = new OpponentPaddle(gameContext, Position.Right);
    } else if (type === PlayerType.Player) {
      this._paddle = new PlayerPaddle(gameContext, Position.Right, ball);  
      this._paddle.missesBall.subscribe(() => {
        this._missesBall.next(this);
      });    
    }
  }
}

export class ComputerPlayer extends GuestPlayer {
  private readonly _reactionLatency: number = 0.7;
  private readonly _reactionDelay: number = 0.02;
  private targetOffset: number = 0;
  private maxOffset: number = 50;
  private offsetChangeFrequency: number = 5;
  private lastOffsetChangeTime: number = 0;
  private _reactionTime: number = 0;
  private move: (() => void) | null = null;

  protected override _paddle: ComputerPaddle;

  constructor(gameContext: GameContext, ball: Ball) {
    super(gameContext, 'Computer', PlayerType.Computer, ball);

    this._paddle = new ComputerPaddle(gameContext, ball);
    this._paddle.missesBall.subscribe(() => {
      this._missesBall.next(this);
    });   
  }
  
  override update(delay: number) {
    if(this._ball.direction.x > 0 && this._ball.offset.x > this._gameContext.size.width * this._reactionLatency) {    
      this.updateOffset(delay);

      const targetY = this._ball.offset.y + this.targetOffset;
      const paddleCenterY = this._paddle.offset.y;

      if(this._reactionTime === 0) {
        const tolerance = 64;
        if (targetY < paddleCenterY - tolerance) {
          this.move = this._paddle.moveUp.bind(this._paddle);
        } else if (targetY > paddleCenterY + tolerance) {
          this.move = this._paddle.moveDown.bind(this._paddle);
        }        
      }

      if(this.move) {
        this.move();
      }

      this._reactionTime += delay;
      if(this._reactionTime > this._reactionDelay) {
        this._reactionTime = 0;
      }      
    } else {
      this._reactionTime = 0;
    }

    if(this._ball.direction.x < 0) {
      this._paddle.stopMove();
    }
  
    super.update(delay);
  }

  private updateOffset(delay: number) {
    this.lastOffsetChangeTime += delay;

    if (this.lastOffsetChangeTime >= this.offsetChangeFrequency) {
      this.targetOffset = (Math.random() - 0.5) * 2 * this.maxOffset;
      this.lastOffsetChangeTime = 0;
    }
  }
}



export class HostPlayer extends Player {
  constructor(gameContext: GameContext, name: string, type: PlayerType = PlayerType.Player, ball: Ball) {
    super(gameContext, name, type, ball);
    this._scoreLocation = this._gameContext.size.width / 4;

    if(type === PlayerType.Opponent) {
      this._paddle = new OpponentPaddle(gameContext, Position.Left);
    } else if (type === PlayerType.Player) {
      this._paddle = new PlayerPaddle(gameContext, Position.Left, ball);    
      this._paddle.missesBall.subscribe(() => {
        this._missesBall.next(this);
      });  
    }
  }
}