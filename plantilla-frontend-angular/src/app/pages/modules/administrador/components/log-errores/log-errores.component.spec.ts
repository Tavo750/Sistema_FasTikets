import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { LogErroresComponent } from './log-errores.component';

describe('LogErroresComponent', () => {
  let component: LogErroresComponent;
  let fixture: ComponentFixture<LogErroresComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      params: of({}),
      queryParams: of({})
    };

    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LogErroresComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
