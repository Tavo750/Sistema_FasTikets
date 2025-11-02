import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { HistorialPuntosService } from './historial-puntos.service';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';

describe('HistorialPuntosService', () => {
  let service: HistorialPuntosService;
  let httpMock: HttpTestingController;
  let httpUtilsSpy: jasmine.SpyObj<HttpUtilsService>;

  beforeEach(() => {
    httpUtilsSpy = jasmine.createSpyObj('HttpUtilsService', ['handleError']);
    httpUtilsSpy.handleError.and.callFake((err: any) => throwError(() => err));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HistorialPuntosService,
        { provide: HttpUtilsService, useValue: httpUtilsSpy },
      ],
    });

    service = TestBed.inject(HistorialPuntosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
