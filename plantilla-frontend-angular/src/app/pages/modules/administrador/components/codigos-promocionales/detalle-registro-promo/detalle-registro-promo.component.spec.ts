import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRegistroPromoComponent } from './detalle-registro-promo.component';

describe('DetalleRegistroPromoComponent', () => {
  let component: DetalleRegistroPromoComponent;
  let fixture: ComponentFixture<DetalleRegistroPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleRegistroPromoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRegistroPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
