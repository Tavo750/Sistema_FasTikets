import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../../shared/services/session.service';
import { MessageService } from '../services/message.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private messageService: MessageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // URLs que NO requieren token (como login, registro, etc.)
    const publicEndpoints = [
      '/auth/login',
      '/auth/registro',
      '/auth/recuperar-password',
      '/public'
    ];

    // Verificar si la URL actual requiere autenticación
    const requiresAuth = !publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (requiresAuth) {
      const currentUser = this.sessionService.getCurrentUser();

      if (currentUser && currentUser.token) {
        // Clonar la petición y agregar el header de autorización
        const authReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });

        return next.handle(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            return this.handleAuthError(error);
          })
        );
      } else {
        // No hay token, redirigir al login
        this.messageService.error(
          'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
          'Sesión Expirada'
        );
        this.sessionService.clearUser();
        this.router.navigate(['/login']);
        return throwError(() => new Error('Session expired'));
      }
    }

    // Para endpoints públicos, enviar la petición sin modificar
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleAuthError(error);
      })
    );
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401:
        // Token inválido o expirado
        this.messageService.error(
          'Su sesión ha expirado o no tiene permisos. Por favor, inicie sesión nuevamente.',
          'No Autorizado'
        );
        this.sessionService.clearUser();
        this.router.navigate(['/login']);
        break;

      case 403:
        // Sin permisos suficientes
        this.messageService.error(
          'No tiene permisos suficientes para realizar esta acción.',
          'Acceso Denegado'
        );
        break;

      case 0:
        // Error de conexión
        this.messageService.connectionError();
        break;

      default:
        // Otros errores se manejan normalmente
        break;
    }

    return throwError(() => error);
  }
}
