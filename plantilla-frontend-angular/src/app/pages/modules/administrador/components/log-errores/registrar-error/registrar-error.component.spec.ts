import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RegistrarErrorComponent } from './registrar-error.component';

describe('RegistrarErrorComponent', () => {
  let component: RegistrarErrorComponent;
  let fixture: ComponentFixture<RegistrarErrorComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    const mockActivatedRoute = {
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      declarations: [RegistrarErrorComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarErrorComponent);
    component = fixture.componentInstance;
    component.ngOnInit(); // Inicializar solo el componente sin renderizar
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.errorForm).toBeDefined();
    expect(component.errorForm.get('fechaHora')?.value).toBeInstanceOf(Date);
    expect(component.errorForm.get('severidad')?.value).toBeNull();
  });

  it('should validate required fields', () => {
    const form = component.errorForm;

    // Set empty values
    form.patchValue({
      severidad: null,
      modulo: null,
      mensajeBreve: '',
      detalleTecnico: '',
      traza: null
    });

    expect(form.invalid).toBeTruthy();
  });

  it('should call router.navigate when onCancel is called', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../'], { relativeTo: jasmine.anything() });
  });
});
