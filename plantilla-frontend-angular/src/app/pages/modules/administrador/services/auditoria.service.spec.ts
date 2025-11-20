import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuditoriaService } from './auditoria.service';

describe('AuditoriaService', () => {
  let service: AuditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuditoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
