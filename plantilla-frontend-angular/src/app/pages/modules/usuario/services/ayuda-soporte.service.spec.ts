import { TestBed } from '@angular/core/testing';

import { AyudaSoporteService } from './ayuda-soporte.service';

describe('AyudaSoporteService', () => {
  let service: AyudaSoporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AyudaSoporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
