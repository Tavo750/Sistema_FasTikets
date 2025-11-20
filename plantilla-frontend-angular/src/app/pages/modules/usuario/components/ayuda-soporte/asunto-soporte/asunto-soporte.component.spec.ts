import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

import { AsuntoSoporteComponent } from './asunto-soporte.component';

describe('AsuntoSoporteComponent', () => {
  let component: AsuntoSoporteComponent;
  let fixture: ComponentFixture<AsuntoSoporteComponent>;

  beforeEach(async () => {
    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AsuntoSoporteComponent],
      providers: [
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsuntoSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
