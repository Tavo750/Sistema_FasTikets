import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

import { CarritoCompraComponent } from './carrito-compra.component';

describe('CarritoCompraComponent', () => {
  let component: CarritoCompraComponent;
  let fixture: ComponentFixture<CarritoCompraComponent>;

  beforeEach(async () => {
    const mockMessageService = {
      add: jasmine.createSpy('add'),
      clear: jasmine.createSpy('clear')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CarritoCompraComponent],
      providers: [
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
