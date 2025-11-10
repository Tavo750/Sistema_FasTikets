import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { version, titulo, tituloVersion } from '../../../global';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FullscreenService } from '../../../shared/services/fullscreen.service';
import { LoginService } from '../../../core/services/login.service';
import { SessionService } from '../../../shared/services/session.service';

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
  ) { }

  ngOnInit(): void {
    // Obtener returnUrl y mensaje de los query parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/inicio';
    this.loginMessage = this.route.snapshot.queryParams['message'] || '';

    this.fullscreenSubscription = this.fullscreenService.isFullscreen$.subscribe(state => {
      this.isFullscreen = state;
      this.buttonLabel = state ? 'Salir de pantalla completa' : 'Pantalla completa';
    });
  }

  ngOnDestroy(): void {
    if (this.fullscreenSubscription) {
      this.fullscreenSubscription.unsubscribe();
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
    if (this.username === '' || this.password === '') {
      this.error('¡Usuario o Contraseña incompletos!');
      return;
    }

    if (!this.validarFormatoEmail(this.username)) {
      this.error('¡Formato de correo electrónico inválido!');
      return;
    }

    if (!this.validarDominioPermitido(this.username)) {
      this.error('¡Dominio de correo no permitido! Use gmail.com o pucp.edu.pe');
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
    this.loginService.getLogin(this.username, this.password).subscribe({
      next: (resp) => {
        if (resp.ok === true) {
          // Guardar la información del usuario directamente desde la respuesta
          this.sessionService.setUser(resp.data);
          this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Se ha iniciado sesión con éxito' });

          // Redirigir a la URL de retorno o a home por defecto
          this.router.navigate([this.returnUrl]);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${resp.mensaje}` });
          this.hayError = true;
        }
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error en la autenticación'
        });
        this.hayError = true;
      }
    })
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

  error(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: '¡Error!', detail: mensaje });
  }

  aviso(mensaje: string) {
    this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: mensaje });
    this.router.navigate(['/lote']);
  }
}
