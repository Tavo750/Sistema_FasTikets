import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleClienteAdmiComponent } from './ver-detalle-cliente-admi.component';

describe('VerDetalleClienteAdmiComponent', () => {
  let component: VerDetalleClienteAdmiComponent;
  let fixture: ComponentFixture<VerDetalleClienteAdmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerDetalleClienteAdmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerDetalleClienteAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
