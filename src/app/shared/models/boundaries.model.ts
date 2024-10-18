import { Size, Offset } from "../../interfaces/interfaces.exports";

export class Boundaries {
  left!: number;
  top!: number;
  right!: number;
  bottom!: number;
  width!: number;
  height!: number;

  constructor(offset?: Offset, size?: Size) {
    if(offset && size) {
      this.update(offset, size);
    }
  }

  update(offset: Offset, size: Size) {
    this.left = offset.x - (size.width / 2);
    this.top = offset.y - (size.height / 2);
    this.right = offset.x + (size.width / 2);
    this.bottom = offset.y + (size.height / 2);
    this.width = size.width;
    this.height = size.height;
  }
}