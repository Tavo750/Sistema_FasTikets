import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { CodigosPromocionalesService } from './codigos-promocionales.service';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';

describe('CodigosPromocionalesService', () => {
  let service: CodigosPromocionalesService;
  let httpMock: HttpTestingController;
  let httpUtilsSpy: jasmine.SpyObj<HttpUtilsService>;

  beforeEach(() => {
    httpUtilsSpy = jasmine.createSpyObj('HttpUtilsService', ['handleError']);
    httpUtilsSpy.handleError.and.callFake((err: any) => throwError(() => err));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CodigosPromocionalesService,
        { provide: HttpUtilsService, useValue: httpUtilsSpy },
      ],
    });

    service = TestBed.inject(CodigosPromocionalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
