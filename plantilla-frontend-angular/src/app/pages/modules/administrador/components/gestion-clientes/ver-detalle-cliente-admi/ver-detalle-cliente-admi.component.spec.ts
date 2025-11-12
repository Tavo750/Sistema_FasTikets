import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { VerDetalleClienteAdmiComponent } from './ver-detalle-cliente-admi.component';

describe('VerDetalleClienteAdmiComponent', () => {
  let component: VerDetalleClienteAdmiComponent;
  let fixture: ComponentFixture<VerDetalleClienteAdmiComponent>;

  const mockActivatedRoute = {
    snapshot: {
      params: { id: '1' },
      queryParams: {},
      data: {},
      paramMap: { get: jasmine.createSpy('get').and.returnValue('1') }
    },
    params: { subscribe: () => {} },
    queryParams: { subscribe: () => {} }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerDetalleClienteAdmiComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalleClienteAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
