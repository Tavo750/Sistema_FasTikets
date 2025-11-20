import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LogErroresService } from './log-errores.service';

describe('LogErroresService', () => {
  let service: LogErroresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LogErroresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
