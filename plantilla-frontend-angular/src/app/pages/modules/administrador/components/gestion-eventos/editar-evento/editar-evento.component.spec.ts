import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EditarEventoComponent } from './editar-evento.component';

describe('EditarEventoComponent', () => {
  let component: EditarEventoComponent;
  let fixture: ComponentFixture<EditarEventoComponent>;

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

  const mockMessageService = {
    add: jasmine.createSpy('add'),
    clear: jasmine.createSpy('clear')
  };

  const mockConfirmationService = {
    confirm: jasmine.createSpy('confirm'),
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEventoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarEventoComponent);
    component = fixture.componentInstance;
    
    // Mock component methods to prevent HTTP calls and route parameter errors
    spyOn(component as any, 'cargarEvento').and.stub();
    spyOn(component as any, 'cargarLocales').and.stub();
    spyOn(component as any, 'cargarEntradas').and.stub();
    spyOn(component as any, 'inicializarHorasPorDefecto').and.stub();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
