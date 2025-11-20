import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CambiarMiContrasenaClienteComponent } from './cambiar-mi-contrasena-cliente.component';

describe('CambiarMiContrasenaClienteComponent', () => {
  let component: CambiarMiContrasenaClienteComponent;
  let fixture: ComponentFixture<CambiarMiContrasenaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [CambiarMiContrasenaClienteComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
