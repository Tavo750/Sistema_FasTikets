import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FavoritosService } from './favoritos.service';

describe('FavoritosService', () => {
  let service: FavoritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FavoritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
