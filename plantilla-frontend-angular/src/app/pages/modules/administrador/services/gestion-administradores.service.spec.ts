import { TestBed } from '@angular/core/testing';

import { GestionAdministradoresService } from './gestion-administradores.service';

describe('GestionAdministradoresService', () => {
  let service: GestionAdministradoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionAdministradoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
