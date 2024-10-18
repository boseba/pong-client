import { Injectable } from '@angular/core';
import { DrawableService } from '../../shared/services/drawable.service';
import { Updatable } from '../../interfaces/updatable.interface';
import { Drawable } from '../../interfaces/drawable.interface';
import { Movable } from '../../interfaces/movable.interface';
import { ComputerPlayer, GuestPlayer, HostPlayer, Player } from '../models/player.model';
import { PlayerType } from '../../enums/player-type.enum';
import { ComputerPaddle, Paddle } from '../models/paddle.model';
import { BallService } from './ball.service';
import { Position } from '../../enums/position.enum';
import { GameContext } from '../../models/game-context.model';

@Injectable({
  providedIn: 'root'
})
export class PlayersService extends DrawableService implements Updatable, Drawable, Movable {
  
  host!: HostPlayer;
  guest!: GuestPlayer | ComputerPlayer;
  player!: HostPlayer | GuestPlayer;

  private collisionAnimationDuration = 0.24;
  private collisionAnimationTime = 0;

  constructor(gameContext: GameContext, private ballService: BallService) {
    super(gameContext);

    this.ballService.out$.subscribe((position: Position) => {
      if(position === Position.Left) {
        this.guest.score++;
      } else if (position === Position.Right) {
        this.host.score++;
      }

      this.ballService.reset();
      this.resetPaddlesPosition();
    });
  }

  addPlayer(player: HostPlayer | GuestPlayer) {
    if(player instanceof HostPlayer) {
      this.host = player;
    } else if (player instanceof GuestPlayer) {
      this.guest = player;
    }

    if(!this.player) {
      this.player = player;
    }
  }

  draw() {
    this.drawInfo();
    this.drawPaddle(this.host.paddle);
    this.drawPaddle(this.guest.paddle);
  }

  drawBoundaries(): void {
    this.drawSpriteBoundaries(this.host.paddle);
    this.drawSpriteBoundaries(this.guest.paddle);
  }

  update(delay: number) {
    this.updatePaddle(this.host.paddle, delay);
    this.avoidOutsidePosition(this.host.paddle);
    this.detectCollision(this.host.paddle);
    this.animateCollision(this.host.paddle, delay);

    if(this.guest.type === PlayerType.Computer) {
      this.updateComputerPaddle(this.guest as ComputerPlayer, delay);
      this.avoidOutsidePosition(this.guest.paddle);
      this.detectCollision(this.guest.paddle);
      this.animateCollision(this.guest.paddle, delay);
    } else {
      this.updatePaddle(this.guest.paddle, delay);
      this.avoidOutsidePosition(this.guest.paddle);
      this.detectCollision(this.guest.paddle);
      this.animateCollision(this.guest.paddle, delay);
    }
  }

  moveUp() {
    console.log('move up');
    this.player.paddle.direction.y = -1;
  }

  moveDown() {
    this.player.paddle.direction.y = 1;    
  }

  moveLeft() {
    this.player.paddle.direction.x = -1;
  }

  moveRight() {
    this.player.paddle.direction.x = 1;    
  }

  stopMove() {
    this.player.paddle.direction.y = 0;
    this.player.paddle.direction.x = 0;
  }

  pulse() {
    if(this.player.paddle.collided) {
      console.log('Pulsing');
      this.player.paddle.blurColor = Paddle.hitBlurcolor;   
      this.ballService.pulse();
    }
  }

  updateComputerPaddle(player: ComputerPlayer, delay: number) {
    const ball = this.ballService.get();
    if(ball.direction.x > 0 && ball.offset.x > this.gameContext.size.width * player.reactionLatency) {    
      player.lastOffsetChangeTime += delay;

    if (player.lastOffsetChangeTime >= player.offsetChangeFrequency) {
      player.targetOffset = (Math.random() - 0.5) * 2 * player.maxOffset;
      player.lastOffsetChangeTime = 0;
    }

      const targetY = ball.offset.y + player.targetOffset;
      const paddleCenterY = player.paddle.offset.y;

      if(player.reactionTime === 0) {
        const tolerance = 64;
        if (targetY < paddleCenterY - tolerance) {
          player.paddle.direction.y = -1;
        } else if (targetY > paddleCenterY + tolerance) {
          player.paddle.direction.y = 1;
        }        
      }

      player.reactionTime += delay;
      if(player.reactionTime > player.reactionDelay) {
        player.reactionTime = 0;
      }      
    } else {
      player.reactionTime = 0;
    }

    if(ball.direction.x < 0) {
      player.paddle.direction.y = 0;
    }
  
    if(player.paddle.direction.x === 0 && player.paddle.direction.y === 0) {
      player.paddle.currentSpeed = 0;      
      return;
    }
    
    player.paddle.updatePosition(player.paddle.offset.x + (player.paddle.direction.x * player.paddle.speed * delay), player.paddle.offset.y + (player.paddle.direction.y * player.paddle.speed * delay));
  }

  private updatePaddle(paddle: Paddle, delay: number) {
    if(paddle.direction.x === 0 && paddle.direction.y === 0) {
      paddle.currentSpeed = 0;      
      return;
    }
    
    paddle.updatePosition(paddle.offset.x + (paddle.direction.x * paddle.speed * delay), paddle.offset.y + (paddle.direction.y * paddle.speed * delay));
  }

  private avoidOutsidePosition(paddle: Paddle) {
    if(paddle.boundaries.top < 16) {
      paddle.updatePosition(paddle.offset.x, 16 + paddle.size.height / 2);
    } else if (paddle.boundaries.bottom > this.gameContext.size.height - 16) {
      paddle.updatePosition(paddle.offset.x, this.gameContext.size.height - 16 - paddle.size.height / 2);
    }
  }

  private drawInfo() {
    this.font('64px Arial', 'rgba(255,255,255,0.05)');
    this.context2D.fillText(this.host.name, this.gameContext.size.width / 4, this.gameContext.size.height / 4);
    this.context2D.fillText(this.guest.name, this.gameContext.size.width * 3 / 4, this.gameContext.size.height / 4);

    this.font('256px Arial', 'rgba(255,255,255,0.05)');
    this.context2D.fillText(this.host.score.toString(), this.gameContext.size.width / 4, this.gameContext.size.height * 3 / 4);
    this.context2D.fillText(this.guest.score.toString(), this.gameContext.size.width * 3 / 4, this.gameContext.size.height * 3 / 4);
  }

  private drawPaddle(paddle: Paddle) {
    this.style(paddle.backgroundColor, 2, paddle.strokeColor);
    this.blur(paddle.blurColor, paddle.blurSize);

    this.context2D.beginPath();
    this.context2D.roundRect(paddle.boundaries.left, paddle.boundaries.top, paddle.size.width, paddle.size.height, 4);
    this.context2D.fill();
    this.context2D.stroke();

    this.resetBlur();
  }

  private detectCollision(paddle: Paddle) {
    if(this.ballService.detectCollision(paddle)) {
      paddle.collided = true;
      paddle.blurColor = Paddle.collidedBlurcolor;
      paddle.blurSize = 20; 
    }
  }

  private animateCollision(paddle: Paddle, delay: number) {
    if(paddle.collided) {
      if(this.collisionAnimationTime > this.collisionAnimationDuration) {
        paddle.collided = false;
        paddle.blurSize = 0;
        paddle.blurColor = Paddle.defaultBlurcolor;
        this.collisionAnimationTime = 0;
      } else {
        this.collisionAnimationTime += delay;
      }      
    }
  }

  private resetPaddlesPosition() {
    this.host.paddle.updatePosition(this.host.paddle.offset.x, this.gameContext.size.height / 2);
    this.guest.paddle.updatePosition(this.guest.paddle.offset.x, this.gameContext.size.height / 2);
  }
}
