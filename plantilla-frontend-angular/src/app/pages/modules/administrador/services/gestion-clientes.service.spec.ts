import { TestBed } from '@angular/core/testing';

import { GestionClientesService } from './gestion-clientes.service';

describe('GestionClientesService', () => {
  let service: GestionClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
