import { TestBed } from '@angular/core/testing';

import { CambiarContraService } from './cambiar-contra.service';

describe('CambiarContraService', () => {
  let service: CambiarContraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambiarContraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
