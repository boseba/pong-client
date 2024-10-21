import { Injectable } from '@angular/core';
import { GameContext } from '../../models/game-context.model';
import { Sprite } from '../../models/sprite.model';

@Injectable({
  providedIn: 'root'
})
export class DrawableService {
  protected context2D!: CanvasRenderingContext2D;

  constructor(protected gameContext: GameContext) { 
    this.context2D = gameContext.ctx;
  }

  protected style(fillColor: string, strokeWidth: number = 0, strokeColor: string = 'transparent') {
    this.context2D.fillStyle = fillColor;
    this.context2D.lineWidth = strokeWidth;
    this.context2D.strokeStyle = strokeColor;
  }

  protected blur(color: string, intensity: number, x?: number, y?: number) {
    this.context2D.shadowBlur = intensity;
    this.context2D.shadowColor = color;

    if(x) {
      this.context2D.shadowOffsetX = x;
    }
    if(y) {
      this.context2D.shadowOffsetY = y;
    }
  }

  protected resetBlur() {
    this.context2D.shadowBlur = 0;
    this.context2D.shadowColor = 'transparent';
  }

  protected font(font: string, color: string = 'rgba(255,255,255,0.65)', alignment: CanvasTextAlign = 'center', baseline: CanvasTextBaseline = 'middle') {
    this.context2D.fillStyle = color;
    this.context2D.font = font;
    this.context2D.textAlign = alignment;
    this.context2D.textBaseline = 'middle';
  }

  protected drawSpriteBoundaries(sprite: Sprite) {
    this.style('transparent', 1, 'red');
    this.context2D.strokeRect(sprite.boundaries.left, sprite.boundaries.top, sprite.boundaries.width, sprite.boundaries.height);

    this.style('yellow', 0);
    this.context2D.fillRect(sprite.offset.x, sprite.offset.y, 1, 1);
  }

  
}
