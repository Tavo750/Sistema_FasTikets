import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventoComponent } from './evento.component';

describe('EventoComponent', () => {
  let component: EventoComponent;
  let fixture: ComponentFixture<EventoComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: { params: { id: '1' } },
      params: { subscribe: () => {} }
    };

    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    const mockDialogService = {
      open: jasmine.createSpy('open')
    };

    await TestBed.configureTestingModule({
      declarations: [EventoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MessageService, useValue: mockMessageService },
        { provide: DialogService, useValue: mockDialogService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
