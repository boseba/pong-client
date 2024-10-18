import { TestBed } from '@angular/core/testing';
import { DrawableService } from './drawable.service';

describe('DrawableService', () => {
  let service: DrawableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
