import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlayersService } from '../../game/services/players.service';
import { BallService } from '../../game/services/ball.service';
import { Game } from '../../game/models/game.model';
import { ComputerPlayer, HostPlayer } from '../../game/models/models.exports';
import { PlayerType } from '../../enums/player-type.enum';
import { GameContext } from '../../models/game-context.model';
import { DrawableService } from './drawable.service';
import { KeyCode } from '../../enums/keycode.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService extends DrawableService {
  private _playing: Subject<boolean> = new Subject();
  private _isPlaying: boolean = false;
  private game!: Game;
  private backgroundData!: ImageData;
  private lastFrameTime: number = 0;
  private fps: Subject<number> = new Subject();
  private _keyPressed: any = {};
  
  private readonly backgroundColor: string = '#18251B';
  private readonly linesColor: string = 'rgba(255,255,255,0.2';
  private readonly linesWidth: number = 8;

  playing$ = this._playing.asObservable();
  fps$ = this.fps.asObservable();

  constructor(protected override gameContext: GameContext, private playerService: PlayersService, private ballService: BallService) {
    super(gameContext);

    this.playerService.addPlayer(new HostPlayer('Human', PlayerType.Player, this.gameContext.size));
    this.playerService.addPlayer(new ComputerPlayer(this.gameContext.size));
    this.game = new Game();
  }

  start() {
    this._isPlaying = true;
    this._playing.next(this._isPlaying);
    window.requestAnimationFrame((timeStamp) => this.run(timeStamp));
  }

  run(timeStamp: number) {
    const delay = (timeStamp - this.lastFrameTime) / 1000;

    if (this.lastFrameTime) {
      const deltaTime = (timeStamp - this.lastFrameTime) / 1000; // in seconds
      this.fps.next(1 / deltaTime);
    }

    this.lastFrameTime = timeStamp;

    this.draw();


    this.playerService.update(delay);
    this.ballService.update(delay);

    window.requestAnimationFrame((timeStamp) => this.run(timeStamp));
  }

  private draw() {
    this.context2D.clearRect(0, 0, this.gameContext.size.width, this.gameContext.size.height);

    this.drawBoard();

    this.playerService.draw();
    this.ballService.draw();

    if (this.game.showBoundaries) {
      this.playerService.drawBoundaries();
      this.ballService.drawBoundaries();
    }
  }

  private drawBoard() {
    if (!this.backgroundData) {
      this.drawBackground();
      this.drawLines();

      this.backgroundData = this.context2D.getImageData(0, 0, this.gameContext.size.width, this.gameContext.size.height);
    } else {
      this.context2D.putImageData(this.backgroundData, 0, 0);
    }
  }

  
  private drawBackground() {
    this.context2D.fillStyle = this.backgroundColor;
    this.context2D.fillRect(0, 0, this.gameContext.size.width, this.gameContext.size.height);
  }

  private drawLines() {
    this.style('transparent', this.linesWidth, this.linesColor);
    this.context2D.strokeRect(8, 8, this.gameContext.size.width - 16, this.gameContext.size.height - 16);

    this.context2D.beginPath();
    this.context2D.moveTo (this.gameContext.size.width / 2, 8 + 8);
    this.context2D.lineTo (this.gameContext.size.width / 2, (this.gameContext.size.height - 8 - 8));

    this.context2D.moveTo (16, this.gameContext.size.height / 2);
    this.context2D.lineTo ((this.gameContext.size.width / 2) - 8, this.gameContext.size.height / 2);

    this.context2D.moveTo ((this.gameContext.size.width / 2) + 8, this.gameContext.size.height / 2);
    this.context2D.lineTo (this.gameContext.size.width - 8 - 8, this.gameContext.size.height / 2);
    this.context2D.stroke();

    const gradient = this.context2D.createRadialGradient(this.gameContext.size.width / 2, this.gameContext.size.height / 2, 0, this.gameContext.size.width / 2, this.gameContext.size.height / 2, this.gameContext.size.width / 2);
  
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

    this.context2D.fillStyle = gradient;
    this.context2D.fillRect(0, 0, this.gameContext.size.width, this.gameContext.size.height);
  }

  handleKeyDown(keyEvent: KeyboardEvent) {
    if (this._isPlaying) {
      switch (keyEvent.code) {
        case KeyCode.ArrowUp:
          if (!this._keyPressed[KeyCode.ArrowUp]) {
            this._keyPressed[KeyCode.ArrowUp] = true;
            this.playerService.moveUp();
          }
          break;
        case KeyCode.ArrowDown:
          if (!this._keyPressed[KeyCode.ArrowDown]) {
            this._keyPressed[KeyCode.ArrowDown] = true;
            this.playerService.moveDown();
          }
          break;
        case KeyCode.Space:
          if (!this._keyPressed[KeyCode.Space]) {
            this._keyPressed[KeyCode.Space] = true;
            this.playerService.pulse();
          }
          break;
      }
    }
  }

  handleKeyUp(keyEvent: KeyboardEvent) {
    if (this._isPlaying) {
      switch (keyEvent.code) {
        case KeyCode.ArrowUp:
          this._keyPressed[KeyCode.ArrowUp] = false;
          this.playerService.stopMove();
          break;
        case KeyCode.ArrowDown:
          this._keyPressed[KeyCode.ArrowDown] = false;
          this.playerService.stopMove();
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
