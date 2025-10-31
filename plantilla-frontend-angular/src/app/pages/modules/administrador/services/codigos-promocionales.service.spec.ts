import { TestBed } from '@angular/core/testing';

import { CodigosPromocionalesService } from './codigos-promocionales.service';

describe('CodigosPromocionalesService', () => {
  let service: CodigosPromocionalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigosPromocionalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
