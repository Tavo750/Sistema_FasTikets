import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { BeneficiosService } from './beneficios.service';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';

describe('BeneficiosService', () => {
  let service: BeneficiosService;
  let httpMock: HttpTestingController;
  let httpUtilsSpy: jasmine.SpyObj<HttpUtilsService>;

  beforeEach(() => {
    httpUtilsSpy = jasmine.createSpyObj('HttpUtilsService', ['handleError']);
    httpUtilsSpy.handleError.and.callFake((err: any) => throwError(() => err));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        BeneficiosService,
        { provide: HttpUtilsService, useValue: httpUtilsSpy },
      ],
    });

    service = TestBed.inject(BeneficiosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
