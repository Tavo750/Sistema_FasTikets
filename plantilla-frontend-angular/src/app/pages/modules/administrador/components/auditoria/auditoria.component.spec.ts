import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AuditoriaComponent } from './auditoria.component';
import { AuditoriaService } from '../../services/auditoria.service';
import { HttpUtilsService } from '../../../../../shared/services/http-utils.service';

describe('AuditoriaComponent', () => {
  let component: AuditoriaComponent;
  let fixture: ComponentFixture<AuditoriaComponent>;

  beforeEach(async () => {
    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    const mockAuditoriaService = {
      getListarAuditoria: jasmine.createSpy('getListarAuditoria').and.returnValue({
        subscribe: jasmine.createSpy('subscribe')
      })
    };

    const mockHttpUtilsService = {
      handleError: jasmine.createSpy('handleError')
    };

    await TestBed.configureTestingModule({
      declarations: [AuditoriaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: mockMessageService },
        { provide: AuditoriaService, useValue: mockAuditoriaService },
        { provide: HttpUtilsService, useValue: mockHttpUtilsService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
