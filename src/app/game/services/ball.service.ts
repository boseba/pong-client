import { Injectable } from '@angular/core';
import { DrawableService } from '../../shared/services/drawable.service';
import { Updatable } from '../../interfaces/updatable.interface';
import { Drawable } from '../../interfaces/drawable.interface';
import { Ball } from '../models/ball.model';
import { Offset } from '../../interfaces/offset.interface';
import { Paddle } from '../models/paddle.model';
import { Position } from '../../enums/position.enum';
import { Observable, Subject } from 'rxjs';
import { GameContext } from '../../models/game-context.model';

@Injectable({
  providedIn: 'root'
})
export class BallService extends DrawableService implements Updatable, Drawable {
  private out: Subject<Position> = new Subject();
  private miss: boolean = false;
  private ball: Ball;
  private previousPositions: Offset[] = [];

  out$: Observable<Position> = this.out.asObservable();

  constructor(gameContext: GameContext) {
    super(gameContext);

    this.ball = new Ball({ x: gameContext.size.width / 2, y: gameContext.size.height / 2 });
    this.ball.direction = { x: -1, y: 0 };
  }

  draw() {
    this.drawTrail();
    this.drawBall();
  }

  drawBoundaries(): void {
    this.drawSpriteBoundaries(this.ball);
  }

  reset(): void {
    this.ball.updatePosition(this.gameContext.size.width / 2, this.gameContext.size.height / 2);
    this.ball.direction = { x: 1, y: 0 };
    this.ball.speed = Ball.defaultSpeed;
    this.previousPositions.length = 0;
    this.miss = false;
  }

  update(delay: number): void {
    this.updateBall(delay);
    this.updateTrail();    

    if(this.miss) {
      if(this.ball.boundaries.right <= 0) {
        this.out.next(Position.Left);
      } else if (this.ball.boundaries.left >= this.gameContext.size.width) {
        this.out.next(Position.Right);
      }
    }
  }

  pulse() {
    this.ball.speed *= 2;
    setTimeout(() => {
      this.ball.speed /= 2;
    }, 2000);
  }

  get(): Ball {
    return this.ball;
  }

  detectCollision(paddle: Paddle): boolean {
    let collision: boolean = false;

    if(!this.miss) {
      if(paddle.position === Position.Left) {
        if (this.ball.boundaries.left <= paddle.boundaries.right) {
          if (this.ball.boundaries.bottom >= paddle.boundaries.top && this.ball.boundaries.top <= paddle.boundaries.bottom) {
            collision = true;
            this.ball.updatePosition(paddle.boundaries.right + (this.ball.size.width / 2), this.ball.offset.y);
          } else {
            this.miss = true;
          }
        }
      } else if (paddle.position === Position.Right) {
        if (this.ball.boundaries.right >= paddle.boundaries.left) {
          if (this.ball.boundaries.bottom >= paddle.boundaries.top && this.ball.boundaries.top <= paddle.boundaries.bottom) {
            collision = true;
            this.ball.updatePosition(paddle.boundaries.left - (this.ball.size.width / 2), this.ball.offset.y); 
          } else {
            this.miss = true;
          }
        }
      }   

      if(collision) {
        this.reverseDirection(paddle.boundaries.top, paddle.boundaries.height);
      }   
    }

    return collision;
  }

  reverseDirection(paddleTop: number, paddleHeight: number) {
    this.ball.hitPaddleSound.play();

    const collisionPoint = this.ball.offset.y - paddleTop;
    const relativeCollision = (collisionPoint - paddleHeight / 2) / (paddleHeight / 2);
    const maxAngle = Math.PI / 4;
    const angle = relativeCollision * maxAngle;

    this.ball.direction.x = -this.ball.direction.x;
    this.ball.direction.y = Math.sin(angle);

    const speedAdjustment = Math.sqrt(1 + Math.pow(this.ball.direction.y, 2));
    this.ball.direction.x /= speedAdjustment;
    this.ball.direction.y /= speedAdjustment;
  }

  private drawTrail(): void {
    for (let i = 0; i < this.previousPositions.length; i++) {
      const position = this.previousPositions[i];

      this.style(this.ball.trailColor, 2, this.ball.trailColor);

      this.context2D.beginPath();
      this.context2D.arc(position.x, position.y, this.ball.size.width / 2, 0, 2 * Math.PI);
      this.context2D.fill();
      this.context2D.stroke();
    }
  }

  private drawBall(): void {
    this.style(this.ball.backgroundColor, 2, this.ball.strokeColor);

    this.context2D.beginPath();
    this.context2D.arc(this.ball.offset.x, this.ball.offset.y, this.ball.size.width / 2, 0, 2 * Math.PI);
    this.context2D.fill();
    this.context2D.stroke();
  }

  private updateBall(delay: number) {
    if (this.ball.direction.x === 0 && this.ball.direction.y === 0) {
      this.ball.currentSpeed = 0;
      return;
    }

    this.ball.updatePosition(this.ball.offset.x + (this.ball.direction.x * this.ball.speed * delay), this.ball.offset.y + (this.ball.direction.y * this.ball.speed * delay));
  }

  private updateTrail() {
    this.previousPositions.unshift({ x: this.ball.offset.x, y: this.ball.offset.y });
    if (this.previousPositions.length > this.ball.maxTrailLength) {
      this.previousPositions.pop();
    }

    if (this.ball.boundaries.top <= 8) {
      this.ball.offset.y = 8 + this.ball.size.height / 2;
      this.ball.direction.y *= -1;
    } else if (this.ball.boundaries.bottom >= this.gameContext.size.height - 8) {
      this.ball.offset.y = this.gameContext.size.height - 8 - this.ball.size.height / 2;
      this.ball.direction.y *= -1;
    }

    this.ball.boundaries.update(this.ball.offset, this.ball.size);
  }
}
