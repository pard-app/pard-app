import { TestBed } from '@angular/core/testing';

import { OverlaysService } from './overlays.service';

describe('OverlaysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverlaysService = TestBed.get(OverlaysService);
    expect(service).toBeTruthy();
  });
});
