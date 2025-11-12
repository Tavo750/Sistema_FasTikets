import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { RegistroUsuarioService } from './registro-usuario.service';

describe('RegistroUsuarioService', () => {
  let service: RegistroUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RegistroUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
