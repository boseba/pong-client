import { Offset, Size } from "../../interfaces/interfaces.exports";
import { AnimatedSprite } from "../../models/sprite.model";

export class Ball extends AnimatedSprite {
  static defaultSize: Size = { width: 16, height: 16 };
  static defaultSpeed: number = 256;
  static height: number = 128;

  backgroundColor: string = 'rgba(255,255,255,0.5)';
  trailColor: string = 'rgba(255,255,255,0.1)';
  strokeColor: string = 'rgba(255,255,255,0.8)';

  readonly maxTrailLength = 6;
  readonly hitPaddleSound: HTMLAudioElement;

  constructor(offset: Offset) {
    super(offset, Ball.defaultSize);
    this.speed = Ball.defaultSpeed;

    this.hitPaddleSound = new Audio('assets/sounds/pop.mp3');
    this.hitPaddleSound.volume = 1;
    this.hitPaddleSound.loop = false;
    this.hitPaddleSound.preload = 'auto';
  }
}