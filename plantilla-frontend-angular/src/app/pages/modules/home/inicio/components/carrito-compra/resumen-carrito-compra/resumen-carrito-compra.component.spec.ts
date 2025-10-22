import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenCarritoCompraComponent } from './resumen-carrito-compra.component';

describe('ResumenCarritoCompraComponent', () => {
  let component: ResumenCarritoCompraComponent;
  let fixture: ComponentFixture<ResumenCarritoCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumenCarritoCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenCarritoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
