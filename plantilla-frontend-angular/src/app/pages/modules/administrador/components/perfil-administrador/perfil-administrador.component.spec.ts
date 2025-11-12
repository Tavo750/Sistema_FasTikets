import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PerfilAdministradorComponent } from './perfil-administrador.component';

describe('PerfilAdministradorComponent', () => {
  let component: PerfilAdministradorComponent;
  let fixture: ComponentFixture<PerfilAdministradorComponent>;

  beforeEach(async () => {
    const mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    await TestBed.configureTestingModule({
      declarations: [PerfilAdministradorComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
