import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CarritoItemComponent } from './carrito-item.component';

describe('CarritoItemComponent', () => {
  let component: CarritoItemComponent;
  let fixture: ComponentFixture<CarritoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoItemComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoItemComponent);
    component = fixture.componentInstance;
    
    // Inicializar propiedades requeridas del input
    component.item = {
      id: 1,
      title: 'Test Event',
      category: 'Concert',
      price: 100,
      quantity: 1,
      image: 'test.jpg'
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
