import { IOffset } from "../interfaces/offset.interface";
import { ISize } from "../interfaces/size.interface";

export class Boundaries {
  left!: number;
  top!: number;
  right!: number;
  bottom!: number;
  width!: number;
  height!: number;

  constructor(offset?: IOffset, size?: ISize) {
    if(offset && size) {
      this.update(offset, size);
    }
  }

  update(offset: IOffset, size: ISize) {
    this.left = offset.x - (size.width / 2);
    this.top = offset.y - (size.height / 2);
    this.right = offset.x + (size.width / 2);
    this.bottom = offset.y + (size.height / 2);
    this.width = size.width;
    this.height = size.height;
  }
}