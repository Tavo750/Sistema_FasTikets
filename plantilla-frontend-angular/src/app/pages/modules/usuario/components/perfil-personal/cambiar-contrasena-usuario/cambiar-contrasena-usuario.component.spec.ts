import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContrasenaUsuarioComponent } from './cambiar-contrasena-usuario.component';

describe('CambiarContrasenaUsuarioComponent', () => {
  let component: CambiarContrasenaUsuarioComponent;
  let fixture: ComponentFixture<CambiarContrasenaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContrasenaUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContrasenaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
