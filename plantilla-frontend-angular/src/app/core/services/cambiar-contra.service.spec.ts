import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CambiarContraService } from './cambiar-contra.service';

describe('CambiarContraService', () => {
  let service: CambiarContraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CambiarContraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
