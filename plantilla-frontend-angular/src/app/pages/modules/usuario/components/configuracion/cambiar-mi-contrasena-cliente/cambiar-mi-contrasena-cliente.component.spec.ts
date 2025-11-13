import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarMiContrasenaClienteComponent } from './cambiar-mi-contrasena-cliente.component';

describe('CambiarMiContrasenaClienteComponent', () => {
  let component: CambiarMiContrasenaClienteComponent;
  let fixture: ComponentFixture<CambiarMiContrasenaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarMiContrasenaClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarMiContrasenaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
