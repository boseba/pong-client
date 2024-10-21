import { Offset, Size } from "../../interfaces/interfaces.exports";
import { AnimatedSprite } from "../../models/sprite.model";

export class Ball extends AnimatedSprite {
  static defaultColor: string = 'rgba(255,255,255,0.5)';
  static defaultTrailColor: string = 'rgba(255,255,255,0.1)';
  static defaultStrokeColor: string = 'rgba(255,255,255,0.8)';
  static pulsedColor: string = 'rgba(209,246,255,0.5)';
  static pulsedTrailColor: string = 'rgba(209,246,255,0.1)';
  static pulsedStrokeColor: string = 'rgba(209,246,255,0.9 )';
  static defaultSize: Size = { width: 16, height: 16 };
  static defaultSpeed: number = 256;
  static height: number = 128;

  backgroundColor: string = Ball.defaultColor;
  trailColor: string = Ball.defaultTrailColor;
  strokeColor: string = Ball.defaultStrokeColor;
  blurSize: number = 6;
  blurColor: string = Ball.defaultStrokeColor ;

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