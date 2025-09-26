import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { version, titulo, tituloVersion } from '../../../global';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FullscreenService } from '../../../shared/services/fullscreen.service';
import { LoginService } from '../../../core/services/login.service';

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

  ref: DynamicDialogRef | undefined;

  isFullscreen: boolean = false;
  buttonLabel: string = 'Pantalla completa';
  private fullscreenSubscription!: Subscription;

  constructor(
    private router: Router,
    public dialogService: DialogService,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private fullscreenService: FullscreenService,
  ) { }

  ngOnInit(): void {
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
    } else {
      this.validarLogin();
    }
  }

  validarLogin() {
    this.loadingService.show();
    this.loginService.getLogin(this.username, this.password).subscribe({
      next: (resp) => {
        // console.log(resp)
        if (resp.responseCode == "00") {
          this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Se ha iniciado sesión con éxito' });
          this.router.navigate(['/inicio']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${resp.message}` });
          this.hayError = true;
        }
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message
        });
        this.hayError = true;
      }
    })
  }

  error(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: '¡Error!', detail: mensaje });
  }

  aviso(mensaje: string) {
    this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: mensaje });
    this.router.navigate(['/lote']);
  }
}
