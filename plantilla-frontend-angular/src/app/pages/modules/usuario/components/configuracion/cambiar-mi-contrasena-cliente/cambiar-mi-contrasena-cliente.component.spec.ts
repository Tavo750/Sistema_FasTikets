import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

import { CambiarMiContrasenaClienteComponent } from './cambiar-mi-contrasena-cliente.component';

describe('CambiarMiContrasenaClienteComponent', () => {
  let component: CambiarMiContrasenaClienteComponent;
  let fixture: ComponentFixture<CambiarMiContrasenaClienteComponent>;

  beforeEach(async () => {
    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [CambiarMiContrasenaClienteComponent],
      providers: [
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarMiContrasenaClienteComponent);
    component = fixture.componentInstance;
    component.ngOnInit(); // Inicializar solo el componente sin renderizar el template
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
