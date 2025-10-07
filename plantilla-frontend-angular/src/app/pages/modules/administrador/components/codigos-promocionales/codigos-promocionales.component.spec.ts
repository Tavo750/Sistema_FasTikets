import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigosPromocionalesComponent } from './codigos-promocionales.component';

describe('CodigosPromocionalesComponent', () => {
  let component: CodigosPromocionalesComponent;
  let fixture: ComponentFixture<CodigosPromocionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodigosPromocionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigosPromocionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
