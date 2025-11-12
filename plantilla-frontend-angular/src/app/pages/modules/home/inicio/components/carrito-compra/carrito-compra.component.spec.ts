import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CarritoCompraComponent } from './carrito-compra.component';

describe('CarritoCompraComponent', () => {
  let component: CarritoCompraComponent;
  let fixture: ComponentFixture<CarritoCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoCompraComponent],
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
