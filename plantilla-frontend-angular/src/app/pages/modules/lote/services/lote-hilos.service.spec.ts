import { TestBed } from '@angular/core/testing';

import { LoteHilosService } from './lote-hilos.service';

describe('LoteHilosService', () => {
  let service: LoteHilosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteHilosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
