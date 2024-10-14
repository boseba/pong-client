import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KeyCode } from '../enums/keycode.enum';
import { PlayerType } from '../enums/player-type.enum';
import { ISize } from '../interfaces/size.interface';
import { Game } from '../models/game.model';
import { Ball, Board, ComputerPlayer, HostPlayer } from '../models/models.exports';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _playing: Subject<boolean> = new Subject();
  private _isPlaying: boolean = false;
  private _game!: Game;
  private _board!: Board;
  private _prevTimeStamp: number = 0;
  private _keyPressed: any = {};

  playing$ = this._playing.asObservable();

  constructor() { }

  registerContext(gameContext: CanvasRenderingContext2D, size: ISize) {
    this._game = new Game(gameContext, size);

    this._board = new Board(this._game.context, '#18251B');
    this._game.ball = new Ball(this._game.context, { x: size.width / 2, y: size.height / 2 });
    this._game.host = new HostPlayer(this._game.context, 'Human', PlayerType.Player, this._game.ball);
    this._game.guest = new ComputerPlayer(this._game.context, this._game.ball);
    this._game.player = this._game.host;
    
    this._game.host.missesBall.subscribe(() => {
      this._game.guest.score++;
      this._game.newSet();
    });

    this._game.guest.missesBall.subscribe(() => {
      this._game.host.score++;
      this._game.newSet();
    });
  }

  start() {
    this._isPlaying = true;
    this._playing.next(this._isPlaying);
    window.requestAnimationFrame((timeStamp) => this.draw(timeStamp));
  }

  draw(timeStamp: number) {
    const delay = (timeStamp - this._prevTimeStamp) / 1000;

    this._prevTimeStamp = timeStamp;
    this._game.draw();
    this._game.update(delay);

    window.requestAnimationFrame((timeStamp) => this.draw(timeStamp));
  }

  handleKeyDown(keyEvent: KeyboardEvent) {    
    if(this._isPlaying) {
      switch(keyEvent.code) {
        case KeyCode.ArrowUp:
          if(!this._keyPressed[KeyCode.ArrowUp]) {
            this._keyPressed[KeyCode.ArrowUp] = true;  
            this._game.player.movePaddleUp();
          }
          break;
        case KeyCode.ArrowDown:
          if(!this._keyPressed[KeyCode.ArrowDown]) {
            this._keyPressed[KeyCode.ArrowDown] = true;  
            this._game.player.movePaddleDown();
          }
          break;
        case KeyCode.Space:
          if(!this._keyPressed[KeyCode.Space]) {
            this._keyPressed[KeyCode.Space] = true;  
            this._game.player.pulsePaddle();
          }
          break;
      }
    }
  }

  handleKeyUp(keyEvent: KeyboardEvent) {    
    if(this._isPlaying) {
      switch(keyEvent.code) {
        case KeyCode.ArrowUp:
          this._keyPressed[KeyCode.ArrowUp] = false;
          this._game.player.stopPaddleMove();
          break;
        case KeyCode.ArrowDown:
          this._keyPressed[KeyCode.ArrowDown] = false;
          this._game.player.stopPaddleMove();
          break;
        case KeyCode.Space:
          setTimeout(() => {
            this._keyPressed[KeyCode.Space] = false;            
          }, 1000);
          break;
      }
    }
  }
}
