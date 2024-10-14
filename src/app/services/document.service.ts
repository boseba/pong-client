import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { ISize } from '../interfaces/size.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private _isActive: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private _isLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isRendered: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _resized: Subject<ISize> = new Subject();
  private _keyDown: Subject<KeyboardEvent> = new Subject();
  private _keyUp: Subject<KeyboardEvent> = new Subject();

  private _resizeOberver!: Observable<Event>;

  isActive: Observable<boolean>;
  resized: Observable<ISize>;
  loaded: Observable<boolean>;
  rendered: Observable<boolean>;

  dragFileEnter!: Observable<DragEvent>;
  dragFileOver!: Observable<DragEvent>;
  dragFileLeave!: Observable<DragEvent>;
  dropFile!: Observable<DragEvent>;
  keyDown!: Observable<KeyboardEvent>;
  keyUp!: Observable<KeyboardEvent>;

  constructor() {
    this.isActive = this._isActive.asObservable();
    this.resized = this._resized.asObservable();
    this.loaded = this._isLoaded.asObservable();
    this.rendered = this._isRendered.asObservable();
    this.keyDown = this._keyDown.asObservable();
    this.keyUp = this._keyUp.asObservable();

    this.init();
  }

  init() {
    window.addEventListener("DOMContentLoaded", (event) => {
      this._isLoaded.next(true);
    });

    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        this._isRendered.next(true);
      }
    };

    document.onvisibilitychange = (event: Event) => {
      this._isActive.next(!document.hidden);
    };

    this._resizeOberver = fromEvent(window, 'resize');
    this._resizeOberver.subscribe(event => {
      this._resized.next({
        width: (event.target as Window).innerWidth,
        height: (event.target as Window).innerHeight
      })
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this._keyDown.next(event);      
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this._keyUp.next(event);      
    });
  }
}
