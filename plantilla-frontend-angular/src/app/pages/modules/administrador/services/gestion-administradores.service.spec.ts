import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GestionAdministradoresService } from './gestion-administradores.service';

describe('GestionAdministradoresService', () => {
  let service: GestionAdministradoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GestionAdministradoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
