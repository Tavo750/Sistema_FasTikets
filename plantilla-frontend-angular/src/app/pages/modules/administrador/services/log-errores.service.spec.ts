import { TestBed } from '@angular/core/testing';

import { LogErroresService } from './log-errores.service';

describe('LogErroresService', () => {
  let service: LogErroresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogErroresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
