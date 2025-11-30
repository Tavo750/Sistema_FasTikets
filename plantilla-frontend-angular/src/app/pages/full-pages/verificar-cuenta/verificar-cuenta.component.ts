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
    
    console.log('Token obtenido de la URL:', token);
    console.log('Params completos:', this.route.snapshot.params);
    console.log('URL completa:', window.location.href);
    
    if (token) {
      console.log('Llamando al servicio de verificación con token:', token);
      this.verificarCuenta(token);
    } else {
      console.error('No se encontró el token en la URL');
      this.verificacionFallida = true;
      this.mensaje = 'Token de verificación no válido';
      this.cargando = false;
    }
  }

  verificarCuenta(token: string): void {
    console.log('Iniciando verificación de cuenta...');
    this.registroService.postVerificacionCuenta(token).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa del servidor:', response);
        this.cargando = false;
        this.verificacionExitosa = true;
        this.mensaje = response.mensaje || '¡Cuenta verificada exitosamente!';
      },
      error: (error) => {
        console.error('Error al verificar la cuenta:', error);
        console.error('Detalles del error:', error.error);
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
