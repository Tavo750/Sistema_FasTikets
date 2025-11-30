import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { version, titulo, tituloVersion } from '../../../global';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageService } from '../../../core/services/message.service';
import { Subscription } from 'rxjs';
import { FullscreenService } from '../../../shared/services/fullscreen.service';
import { LoginService } from '../../../core/services/login.service';
import { SessionService } from '../../../shared/services/session.service';
import { RegistroUsuarioService } from '../../../core/services/registro-usuario.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  titulo: string = titulo;
  tituloVersion: string = tituloVersion;
  username: string = '';
  password: string = '';
  version: string = version;
  loading: boolean = false;

  hayError: boolean = false;
  returnUrl: string = '/home/inicio';
  loginMessage: string = '';
  
  // Control de verificación de cuenta
  mostrarBotonReenvio: boolean = false;
  reenviandoCorreo: boolean = false;

  // Control de intentos fallidos
  intentosFallidos: number = 0;
  bloqueado: boolean = false;
  tiempoRestante: number = 0;
  private intervaloTemporizador: any;

  ref: DynamicDialogRef | undefined;

  isFullscreen: boolean = false;
  buttonLabel: string = 'Pantalla completa';
  private fullscreenSubscription!: Subscription;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private fullscreenService: FullscreenService,
    private sessionService: SessionService,
    private registroUsuarioService: RegistroUsuarioService,
  ) { }

  ngOnInit(): void {
    // Obtener returnUrl y mensaje de los query parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/inicio';
    this.loginMessage = this.route.snapshot.queryParams['message'] || '';

    this.fullscreenSubscription = this.fullscreenService.isFullscreen$.subscribe(state => {
      this.isFullscreen = state;
      this.buttonLabel = state ? 'Salir de pantalla completa' : 'Pantalla completa';
    });

    // Restaurar estado de bloqueo desde localStorage
    this.restaurarEstadoBloqueo();
  }

  ngOnDestroy(): void {
    if (this.fullscreenSubscription) {
      this.fullscreenSubscription.unsubscribe();
    }
    if (this.intervaloTemporizador) {
      clearInterval(this.intervaloTemporizador);
    }
  }

  toggleFullscreen(): void {
    if (!this.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onSubmit() {
    // Verificar si está bloqueado
    if (this.bloqueado) {
      this.messageService.error(`Cuenta bloqueada temporalmente. Intenta en ${this.tiempoRestante} segundos.`);
      return;
    }

    if (this.username === '' || this.password === '') {
      this.messageService.error('¡Usuario o Contraseña incompletos!');
      return;
    }

    if (!this.validarFormatoEmail(this.username)) {
      this.messageService.error('¡Formato de correo electrónico inválido!');
      return;
    }

    if (!this.validarDominioPermitido(this.username)) {
      this.messageService.error('¡Dominio de correo no permitido! Use gmail.com o pucp.edu.pe');
      return;
    }

    this.validarLogin();
  }

  validarFormatoEmail(email: string): boolean {
    // Expresión regular para validar formato de email y caracteres permitidos
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validarDominioPermitido(email: string): boolean {
    const dominiosPermitidos = ['gmail.com', 'pucp.edu.pe','uni.pe','hotmail.com','yahoo.com', 'outlook.com', 'icloud.com','unmsm.edu.pe'];
    const dominio = email.split('@')[1]?.toLowerCase();
    return dominiosPermitidos.includes(dominio);
  }

  obtenerTipoUsuario(email: string): string {
    const dominio = email.split('@')[1]?.toLowerCase();
    if (dominio === 'gmail.com') return 'cliente';
    if (dominio === 'pucp.edu.pe') return 'administrador';
    return '';
  }

  validarLogin() {
    this.loadingService.show();
    this.mostrarBotonReenvio = false; // Resetear estado del botón
    
    this.loginService.postLogin(this.username, this.password).subscribe({
      next: (resp) => {
        if (resp.ok === true) {
          // Login exitoso - resetear intentos fallidos y limpiar localStorage
          this.intentosFallidos = 0;
          localStorage.removeItem('loginIntentosFallidos');
          localStorage.removeItem('loginBloqueadoHasta');

          // Guardar la información del usuario directamente desde la respuesta
          this.sessionService.setUser(resp.data);
          this.messageService.success('Se ha iniciado sesión con éxito', 'Aviso');

          // Redirigir a la URL de retorno o a home por defecto
          this.router.navigate([this.returnUrl]);
        } else {
          // Login fallido - incrementar contador
          this.manejarIntentaFallido();
          this.messageService.error(`${resp.mensaje}`);
          this.hayError = true;
        }
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
        
        console.log('Error completo:', error); // Debug
        
        // Verificar si es error 409 (cuenta no verificada)
        // El error puede venir con responseCode o directamente verificar el mensaje
        const esError409 = error.responseCode === '409' || 
                           (error.message && error.message.toLowerCase().includes('verificada'));
        
        if (esError409) {
          this.mostrarBotonReenvio = true;
          this.hayError = true;
          this.messageService.error(
            error.message || 'Tu cuenta no ha sido verificada. Por favor, verifica tu correo electrónico.',
            'Cuenta no verificada',
            8000
          );
        } else {
          // Login fallido por error - incrementar contador
          this.manejarIntentaFallido();
          this.messageService.error(error.message || 'Error en la autenticación');
          this.hayError = true;
        }
      }
    })
  }

  /**
   * Maneja los intentos fallidos de login y bloquea si es necesario
   */
  private manejarIntentaFallido(): void {
    this.intentosFallidos++;

    // Guardar intentos en localStorage
    localStorage.setItem('loginIntentosFallidos', this.intentosFallidos.toString());

    if (this.intentosFallidos >= 3) {
      this.bloquearLogin();
    } else {
      const intentosRestantes = 3 - this.intentosFallidos;
      this.messageService.warn(`Intento ${this.intentosFallidos} de 3. Te quedan ${intentosRestantes} intento(s).`, 'Advertencia');
    }
  }

  /**
   * Bloquea el formulario de login por 60 segundos
   */
  private bloquearLogin(): void {
    this.bloqueado = true;
    this.tiempoRestante = 60;

    // Guardar estado de bloqueo en localStorage con timestamp
    const tiempoDesbloqueo = Date.now() + (60 * 1000); // 60 segundos desde ahora
    localStorage.setItem('loginBloqueadoHasta', tiempoDesbloqueo.toString());

    this.messageService.error('Has superado el límite de intentos. Cuenta bloqueada por 1 minuto.', 'Cuenta Bloqueada', 5000);

    // Iniciar temporizador
    this.intervaloTemporizador = setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        this.desbloquearLogin();
      }
    }, 1000);
  }

  /**
   * Desbloquea el formulario de login
   */
  private desbloquearLogin(): void {
    if (this.intervaloTemporizador) {
      clearInterval(this.intervaloTemporizador);
    }

    this.bloqueado = false;
    this.intentosFallidos = 0;
    this.tiempoRestante = 0;
    this.password = ''; // Limpiar contraseña por seguridad

    // Limpiar localStorage
    localStorage.removeItem('loginBloqueadoHasta');
    localStorage.removeItem('loginIntentosFallidos');

    this.messageService.info('Ya puedes intentar iniciar sesión nuevamente.', 'Cuenta Desbloqueada');
  }

  /**
   * Restaura el estado de bloqueo desde localStorage al iniciar el componente
   */
  private restaurarEstadoBloqueo(): void {
    const bloqueadoHasta = localStorage.getItem('loginBloqueadoHasta');
    const intentosFallidos = localStorage.getItem('loginIntentosFallidos');

    if (bloqueadoHasta) {
      const tiempoDesbloqueo = parseInt(bloqueadoHasta, 10);
      const tiempoActual = Date.now();

      if (tiempoActual < tiempoDesbloqueo) {
        // Todavía está bloqueado
        this.bloqueado = true;
        this.tiempoRestante = Math.ceil((tiempoDesbloqueo - tiempoActual) / 1000);

        // Iniciar temporizador desde el tiempo restante
        this.intervaloTemporizador = setInterval(() => {
          this.tiempoRestante--;

          if (this.tiempoRestante <= 0) {
            this.desbloquearLogin();
          }
        }, 1000);

        this.messageService.warn(`Tu cuenta sigue bloqueada. Espera ${this.tiempoRestante} segundos.`, 'Cuenta Bloqueada', 4000);
      } else {
        // El tiempo de bloqueo ya pasó
        localStorage.removeItem('loginBloqueadoHasta');
        localStorage.removeItem('loginIntentosFallidos');
      }
    } else if (intentosFallidos) {
      // Restaurar intentos fallidos si no está bloqueado
      this.intentosFallidos = parseInt(intentosFallidos, 10);
    }
  }

  /**
   * Navega al inicio verificando primero el estado de la sesión
   */
  navegarAInicio(): void {
    // Verificar si hay una sesión activa en ambos servicios
    const sessionActive = this.sessionService.isAuthenticated();
    const loginActive = this.loginService.isLoggedIn();

    if (sessionActive || loginActive) {
      // Si hay sesión activa en cualquiera de los dos, ir al home autenticado
      this.router.navigate(['/home/inicio']);
    } else {
      // Si no hay sesión activa en ninguno, ir al home público
      this.router.navigate(['/home']);
    }
  }

  /**
   * Reenvía el correo de verificación al usuario
   */
  reenviarCorreoVerificacion(): void {
    if (!this.username || !this.validarFormatoEmail(this.username)) {
      this.messageService.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    this.reenviandoCorreo = true;
    this.loadingService.show();

    this.registroUsuarioService.postReenvioVerificacionCorreo(this.username).subscribe({
      next: (resp) => {
        this.loadingService.hide();
        this.reenviandoCorreo = false;
        
        if (resp.ok) {
          this.messageService.success(
            'Se ha enviado un nuevo correo de verificación. Por favor, revisa tu bandeja de entrada.',
            'Correo enviado',
            6000
          );
          this.mostrarBotonReenvio = false;
        } else {
          this.messageService.error(resp.mensaje || 'No se pudo reenviar el correo.');
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.reenviandoCorreo = false;
        this.messageService.error(
          error.error?.mensaje || 'Error al intentar reenviar el correo de verificación.',
          'Error'
        );
      }
    });
  }

  error(mensaje: string) {
    this.messageService.error(mensaje, '¡Error!');
  }

  aviso(mensaje: string) {
    this.messageService.warn(mensaje, 'Aviso');
    this.router.navigate(['/lote']);
  }
}
