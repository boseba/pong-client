import { Size } from "../interfaces/size.interface";

export class GameContext {
  ctx: CanvasRenderingContext2D;
  size: Size;

  constructor(gameContext: CanvasRenderingContext2D, size: Size) {
    this.ctx = gameContext;
    this.size = size;
  }
}