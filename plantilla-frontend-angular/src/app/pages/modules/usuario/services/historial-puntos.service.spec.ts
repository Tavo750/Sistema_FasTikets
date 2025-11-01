import { TestBed } from '@angular/core/testing';

import { HistorialPuntosService } from './historial-puntos.service';

describe('HistorialPuntosService', () => {
  let service: HistorialPuntosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialPuntosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
