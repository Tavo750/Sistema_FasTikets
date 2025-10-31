import { TestBed } from '@angular/core/testing';

import { PerfilPersonalService } from './perfil-personal.service';

describe('PerfilPersonalService', () => {
  let service: PerfilPersonalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilPersonalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
