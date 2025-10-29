import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRegistroPromoComponent } from './editar-registro-promo.component';

describe('EditarRegistroPromoComponent', () => {
  let component: EditarRegistroPromoComponent;
  let fixture: ComponentFixture<EditarRegistroPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarRegistroPromoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRegistroPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
