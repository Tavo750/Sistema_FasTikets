import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContrasenaAdminComponent } from './cambiar-contrasena-admin.component';

describe('CambiarContrasenaAdminComponent', () => {
  let component: CambiarContrasenaAdminComponent;
  let fixture: ComponentFixture<CambiarContrasenaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContrasenaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContrasenaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
