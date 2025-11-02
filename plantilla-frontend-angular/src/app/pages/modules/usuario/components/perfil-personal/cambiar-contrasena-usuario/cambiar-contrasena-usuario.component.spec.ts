import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

import { CambiarContrasenaUsuarioComponent } from './cambiar-contrasena-usuario.component';

describe('CambiarContrasenaUsuarioComponent', () => {
  let component: CambiarContrasenaUsuarioComponent;
  let fixture: ComponentFixture<CambiarContrasenaUsuarioComponent>;

  const mockMessageService = {
    add: jasmine.createSpy('add'),
    clear: jasmine.createSpy('clear')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContrasenaUsuarioComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContrasenaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
