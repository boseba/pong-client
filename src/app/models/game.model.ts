import { PlayerType } from "../enums/player-type.enum";
import { ISize, IDrawable } from "../interfaces/interfaces.exports";
import { Ball } from "./ball.model";
import { Board } from "./board.model";
import { GuestPlayer, HostPlayer, Player } from "./player.model";

export class GameContext {
  ctx: CanvasRenderingContext2D;
  size: ISize;

  constructor(gameContext: CanvasRenderingContext2D, size: ISize) {
    this.ctx = gameContext;
    this.size = size;
  }
}

export class Game implements IDrawable {
  context: GameContext;
  host!: HostPlayer;
  guest!: GuestPlayer;
  player!: HostPlayer | GuestPlayer;
  ball!: Ball;
  board!: Board;
  playing: boolean = false;
  point: boolean = false;
  showBoundaries: boolean = false;

  constructor(gameContext: CanvasRenderingContext2D, size: ISize) {
    this.context = new GameContext(gameContext, size);

    this.board = new Board(this.context, '#18251B');
  }

  draw() {
    this.context.ctx.clearRect(0, 0, this.context.size.width, this.context.size.height);
    this.board.draw();
    this.ball.draw();
    this.host.draw();
    this.guest.draw();

    if(this.showBoundaries) {
      this.ball.drawBoundaries();
      this.host.drawBoundaries();
      this.guest.drawBoundaries();
    }
  }

  update(delay: number) {
    this.host.update(delay);
    this.guest.update(delay);
    this.ball.update(delay);
  }

  newSet() {
    this.ball.reset();
    this.host.reset();
    this.guest.reset();
  }
}