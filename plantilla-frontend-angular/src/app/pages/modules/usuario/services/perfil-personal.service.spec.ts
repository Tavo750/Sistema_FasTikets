import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { PerfilPersonalService } from './perfil-personal.service';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';

describe('PerfilPersonalService', () => {
  let service: PerfilPersonalService;
  let httpMock: HttpTestingController;
  let httpUtilsSpy: jasmine.SpyObj<HttpUtilsService>;

  beforeEach(() => {
    httpUtilsSpy = jasmine.createSpyObj('HttpUtilsService', ['handleError']);
    httpUtilsSpy.handleError.and.callFake((err: any) => throwError(() => err));

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PerfilPersonalService,
        { provide: HttpUtilsService, useValue: httpUtilsSpy },
      ],
    });

    service = TestBed.inject(PerfilPersonalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
