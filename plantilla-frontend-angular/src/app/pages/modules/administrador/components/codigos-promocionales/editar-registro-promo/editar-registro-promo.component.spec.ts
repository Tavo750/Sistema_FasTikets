import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EditarRegistroPromoComponent } from './editar-registro-promo.component';

describe('EditarRegistroPromoComponent', () => {
  let component: EditarRegistroPromoComponent;
  let fixture: ComponentFixture<EditarRegistroPromoComponent>;

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
      declarations: [EditarRegistroPromoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRegistroPromoComponent);
    component = fixture.componentInstance;
    
    // Mock the private cargarDatosPromocional method to prevent HTTP call errors
    spyOn(component as any, 'cargarDatosPromocional').and.stub();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
