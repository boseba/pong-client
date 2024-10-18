import { Offset, Size, Vector } from "../interfaces/interfaces.exports";
import { Boundaries } from "../shared/models/boundaries.model";

export abstract class Sprite {
  offset: Offset = { x: 0, y: 0 };
  size: Size = { width: 0, height: 0 };
  boundaries: Boundaries = new Boundaries();

  constructor(offset: Offset, size: Size) {
    this.offset = offset;
    this.size = size;
  }

  updatePosition(x: number, y: number) {
    this.offset.x = x;
    this.offset.y = y;

    this.boundaries.update(this.offset, this.size);
  }
}

export abstract class AnimatedSprite extends Sprite {
  speed: number = 0;
  currentSpeed: number = 0;
  direction: Vector = { x: 0, y: 0 };
}