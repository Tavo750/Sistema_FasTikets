import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena-usuario',
  standalone: false,
  templateUrl: './cambiar-contrasena-usuario.component.html',
  styleUrls: ['./cambiar-contrasena-usuario.component.css']
})
export class CambiarContrasenaUsuarioComponent implements OnInit {
  cambiarContrasenaForm: FormGroup;
mensajeExito: any;
mensajeError: any;
cargando: unknown;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cambiarContrasenaForm = this.fb.group({
      contrasenaActual: ['', Validators.required],
      contrasenaNueva: ['', Validators.required],
      confirmarContrasena: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.cambiarContrasenaForm.valid) {
      // Aquí iría la lógica para cambiar la contraseña
      console.log('Formulario enviado:', this.cambiarContrasenaForm.value);
    }
  }

  onVolver(): void {
    this.router.navigate(['/usuario/perfilPersonal']);
  }
}
