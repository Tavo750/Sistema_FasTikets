import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroUsuarioService } from '../../../core/services/registro-usuario.service';

@Component({
  selector: 'app-verificar-cuenta',
  templateUrl: './verificar-cuenta.component.html',
  styleUrls: ['./verificar-cuenta.component.css'],
  standalone: false
})
export class VerificarCuentaComponent implements OnInit {
  verificacionExitosa: boolean = false;
  verificacionFallida: boolean = false;
  mensaje: string = '';
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private registroService: RegistroUsuarioService
  ) { }

  ngOnInit(): void {
    // Obtener el token de la URL
    const token = this.route.snapshot.paramMap.get('token');
    
    if (token) {
      this.verificarCuenta(token);
    } else {
      this.verificacionFallida = true;
      this.mensaje = 'Token de verificación no válido';
      this.cargando = false;
    }
  }

  verificarCuenta(token: string): void {
    this.registroService.postVerificacionCuenta(token).subscribe({
      next: (response) => {
        this.cargando = false;
        this.verificacionExitosa = true;
        this.mensaje = response.mensaje || '¡Cuenta verificada exitosamente!';
      },
      error: (error) => {
        this.cargando = false;
        this.verificacionFallida = true;
        this.mensaje = error.error?.mensaje || 'Error al verificar la cuenta. El enlace puede haber expirado o ya fue utilizado.';
      }
    });
  }

  continuarAlInicio(): void {
    this.router.navigate(['/home']);
  }
}
