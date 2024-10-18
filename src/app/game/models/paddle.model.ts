import { Position } from "../../enums/position.enum";
import { Offset } from "../../interfaces/offset.interface";
import { Size } from "../../interfaces/size.interface";
import { Vector } from "../../interfaces/vector.interface";
import { Sprite } from "./models.exports";

export class Paddle extends Sprite {
  static defaultSize: Size = { width: 16, height: 128 };
  static defaultBackgroundColor: string = 'rgba(255,255,255,0.4)';
  static defaultBlurcolor: string = 'transparent';
  static collidedBlurcolor: string = 'rgba(255,255,255,0.8)';
  static hitBlurcolor: string = 'rgba(0,255,0,0.8)';

  backgroundColor: string = Paddle.defaultBackgroundColor;
  strokeColor: string = 'rgba(255,255,255,0.8';
  blurColor: string = 'transparent';
  blurSize: number = 0;

  position: Position;
  collided: boolean = false;

  speed: number = 0;
  currentSpeed: number = 0;
  direction: Vector = { x: 0, y: 0 };

  constructor(position: Position, gameArea: Size) {
    const offset: Offset = { x: position === Position.Left ? 32 : gameArea.width - 32, y: gameArea.height / 2  };
    super(offset, Paddle.defaultSize);

    this.position = position;
    this.speed = 512;
    this.updatePosition(offset.x, offset.y);
  }
}

export class OpponentPaddle extends Paddle {
}

export class PlayerPaddle extends Paddle {
}

export class ComputerPaddle extends Paddle {
  constructor(gameArea: Size) {
    super(Position.Right, gameArea);    
  }
}