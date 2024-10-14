import { IDrawable } from "../interfaces/drawable.interface";
import { GameContext } from "./game.model";

export abstract class Drawable implements IDrawable {
  protected _gameContext: GameContext;

  constructor(gameContext: GameContext) {
    this._gameContext = gameContext;
  }

  draw() {}
}