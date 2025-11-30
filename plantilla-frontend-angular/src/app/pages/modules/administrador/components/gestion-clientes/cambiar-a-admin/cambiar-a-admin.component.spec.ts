import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';

import { CambiarAAdminComponent } from './cambiar-a-admin.component';

describe('CambiarAAdminComponent', () => {
  let component: CambiarAAdminComponent;
  let fixture: ComponentFixture<CambiarAAdminComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      params: of({}),
      queryParams: of({}),
      snapshot: {
        params: {},
        queryParams: {},
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    const mockConfirmationService = {
      confirm: jasmine.createSpy('confirm')
    };

    await TestBed.configureTestingModule({
      declarations: [CambiarAAdminComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ConfirmationService, useValue: mockConfirmationService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarAAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
