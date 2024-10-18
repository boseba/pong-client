import { Size } from "../interfaces/size.interface";
import { GameContext } from "../models/game-context.model";

export function gameContextFactory(): GameContext {
  const canvas: HTMLCanvasElement = document.querySelector('#canvas')!;
  const ctx = canvas.getContext('2d')!;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const size: Size = { width: canvas.width, height: canvas.height };

  return new GameContext(ctx, size);
}