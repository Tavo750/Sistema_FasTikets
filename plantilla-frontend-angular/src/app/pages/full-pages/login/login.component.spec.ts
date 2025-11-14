import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { LoadingService } from '../../../shared/services/loading.service';
import { FullscreenService } from '../../../shared/services/fullscreen.service';
import { LoginService } from '../../../core/services/login.service';
import { SessionService } from '../../../shared/services/session.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const mockDialogService = {
      open: jasmine.createSpy('open'),
      close: jasmine.createSpy('close')
    };

    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    const mockRouter = {
      navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true))
    };

    const mockActivatedRoute = {
      snapshot: {
        queryParams: { returnUrl: '/home/inicio', message: '' }
      }
    };

    const mockLoadingService = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };

    const mockFullscreenService = {
      isFullscreen$: of(false)
    };

    const mockLoginService = {
      getLogin: jasmine.createSpy('getLogin').and.returnValue(of({ 
        ok: true, 
        data: { id: 1, email: 'test@test.com' }, 
        mensaje: 'Login exitoso' 
      })),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false)
    };

    const mockSessionService = {
      setUser: jasmine.createSpy('setUser'),
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false)
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DialogService, useValue: mockDialogService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: FullscreenService, useValue: mockFullscreenService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: SessionService, useValue: mockSessionService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con valores por defecto', () => {
    expect(component.titulo).toBeDefined();
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.loading).toBeFalse();
    expect(component.hayError).toBeFalse();
  });

  it('debería validar correctamente el formato de email', () => {
    expect(component.validarFormatoEmail('test@gmail.com')).toBeTrue();
    expect(component.validarFormatoEmail('invalid-email')).toBeFalse();
    expect(component.validarFormatoEmail('')).toBeFalse();
  });

  it('debería validar correctamente los dominios permitidos', () => {
    expect(component.validarDominioPermitido('test@gmail.com')).toBeTrue();
    expect(component.validarDominioPermitido('test@pucp.edu.pe')).toBeTrue();
    expect(component.validarDominioPermitido('test@invalidDomain.com')).toBeFalse();
  });

  it('debería mostrar error para credenciales vacías', () => {
    component.username = '';
    component.password = '';
    
    spyOn(component, 'error');
    component.onSubmit();
    
    expect(component.error).toHaveBeenCalledWith('¡Usuario o Contraseña incompletos!');
  });

  it('debería mostrar error para formato de email inválido', () => {
    component.username = 'invalid-email';
    component.password = 'password123';
    
    spyOn(component, 'error');
    component.onSubmit();
    
    expect(component.error).toHaveBeenCalledWith('¡Formato de correo electrónico inválido!');
  });

  it('debería mostrar error para dominio no permitido', () => {
    component.username = 'test@notallowed.com';
    component.password = 'password123';
    
    spyOn(component, 'error');
    component.onSubmit();
    
    expect(component.error).toHaveBeenCalledWith('¡Dominio de correo no permitido! Use gmail.com o pucp.edu.pe');
  });

  it('debería obtener el tipo de usuario correcto basado en el dominio', () => {
    expect(component.obtenerTipoUsuario('test@gmail.com')).toBe('cliente');
    expect(component.obtenerTipoUsuario('test@pucp.edu.pe')).toBe('administrador');
    expect(component.obtenerTipoUsuario('test@other.com')).toBe('');
  });

  it('debería llamar validarLogin con credenciales válidas', () => {
    component.username = 'test@gmail.com';
    component.password = 'password123';
    
    spyOn(component, 'validarLogin');
    component.onSubmit();
    
    expect(component.validarLogin).toHaveBeenCalled();
  });
});
