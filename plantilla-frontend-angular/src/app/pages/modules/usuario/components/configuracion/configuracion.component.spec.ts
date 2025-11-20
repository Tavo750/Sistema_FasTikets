import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { SessionService } from '../../../../../shared/services/session.service';

import { ConfiguracionComponent } from './configuracion.component';

describe('ConfiguracionComponent', () => {
  let component: ConfiguracionComponent;
  let fixture: ComponentFixture<ConfiguracionComponent>;

  beforeEach(async () => {
    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    const mockRouter = {
      navigate: jasmine.createSpy('navigate'),
      url: '/configuracion'
    };

    const mockSessionService = {
      getUserId: jasmine.createSpy('getUserId').and.returnValue('1'),
      clearSession: jasmine.createSpy('clearSession')
    };

    await TestBed.configureTestingModule({
      imports: [ConfiguracionComponent, HttpClientTestingModule],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionComponent);
    component = fixture.componentInstance;
    component.ngOnInit(); // Solo inicializar sin renderizar
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
