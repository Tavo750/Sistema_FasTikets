import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { EditarClienteAdmiComponent } from './editar-cliente-admi.component';

describe('EditarClienteAdmiComponent', () => {
  let component: EditarClienteAdmiComponent;
  let fixture: ComponentFixture<EditarClienteAdmiComponent>;

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
      declarations: [EditarClienteAdmiComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarClienteAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
