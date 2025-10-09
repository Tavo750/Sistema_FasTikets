import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena-admin',
  standalone: false,
  templateUrl: './cambiar-contrasena-admin.component.html',
  styleUrl: './cambiar-contrasena-admin.component.css'
})
export class CambiarContrasenaAdminComponent implements OnInit {
  cambiarContrasenaForm: FormGroup<any> | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', Validators.required],
      confirmarContrasena: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.cambiarContrasenaForm && this.cambiarContrasenaForm.valid) {
      // Aquí irá la lógica para cambiar la contraseña
      console.log('Formulario enviado', this.cambiarContrasenaForm.value);
    }
  }

  cancelarEdicion() {
    throw new Error('Method not implemented.');
  }
  volver() {
    throw new Error('Method not implemented.');
  }
}
