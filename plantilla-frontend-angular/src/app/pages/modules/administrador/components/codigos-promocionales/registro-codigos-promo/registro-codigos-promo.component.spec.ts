import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCodigosPromoComponent } from './registro-codigos-promo.component';

describe('RegistroCodigosPromoComponent', () => {
  let component: RegistroCodigosPromoComponent;
  let fixture: ComponentFixture<RegistroCodigosPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroCodigosPromoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroCodigosPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
