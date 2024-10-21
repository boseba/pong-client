import { AfterViewInit, Component, ElementRef, HostListener, inject, Injector, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocumentService } from './services/document.service';
import { KeyCode } from './enums/keycode.enum';
import { GameService } from './shared/services/game.service';
import { gameContextFactory } from './providers/game-context.factory';
import { BallService } from './game/services/ball.service';
import { PlayersService } from './game/services/players.service';
import { GameContext } from './models/game-context.model';
import { throttleTime } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  title = 'Pong game';
  gameService!: GameService;
  fps: number = 0;

  private _playing: boolean = false;
  


  constructor(private documentService: DocumentService, private injector: Injector) {
        
  }

  ngAfterViewInit(): void {
    if (this.canvasRef) {
      const gameContext = gameContextFactory();

      const dynamicInjector = Injector.create({
        providers: [
          { provide: GameContext, useValue: gameContext },
          { provide: BallService, deps: [GameContext] },
          { provide: PlayersService, deps: [GameContext, BallService] },
          { provide: GameService, deps: [GameContext, PlayersService, BallService] }
        ],
        parent: this.injector
      });

      const ballService = dynamicInjector.get(BallService);
      const playerService = dynamicInjector.get(PlayersService);
      this.gameService = dynamicInjector.get(GameService);

      this.gameService.playing$.subscribe(playing => this._playing = playing);
      this.documentService.keyDown.subscribe((event: KeyboardEvent) => this.onKeyDown(event));
      this.documentService.keyUp.subscribe((event: KeyboardEvent) => this.onKeyUp(event));

      this.gameService.start();

      this.gameService.fps$.pipe(throttleTime(1000)).subscribe(fps => this.fps = Math.round(fps));
    }
  }

  private onKeyDown(keyEvent: KeyboardEvent) {
    this.gameService.handleKeyDown(keyEvent);
  }

  private onKeyUp(keyEvent: KeyboardEvent) {
    this.gameService.handleKeyUp(keyEvent);
  }
}
