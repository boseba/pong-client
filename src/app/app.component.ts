import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameService } from './services/game.service';
import { DocumentService } from './services/document.service';
import { KeyCode } from './enums/keycode.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('board') boardRef!: ElementRef;
  title = 'Pong game';

  private _playing: boolean = false;
  


  constructor(private gameService: GameService, private documentService: DocumentService) {
        
  }

  ngAfterViewInit(): void {
    if(this.boardRef) {
      const board = this.boardRef.nativeElement;
      const context = board.getContext('2d');

      board.width = board.clientWidth;
      board.height = board.clientHeight;

      this.gameService.playing$.subscribe(playing => this._playing = playing);
      this.documentService.keyDown.subscribe((event: KeyboardEvent) => this.onKeyDown(event));
      this.documentService.keyUp.subscribe((event: KeyboardEvent) => this.onKeyUp(event));

      this.gameService.registerContext(context, { width: board.width, height: board.height});
      this.gameService.start();
    }
  }

  private onKeyDown(keyEvent: KeyboardEvent) {
    this.gameService.handleKeyDown(keyEvent);
  }

  private onKeyUp(keyEvent: KeyboardEvent) {
    this.gameService.handleKeyUp(keyEvent);
  }
}
