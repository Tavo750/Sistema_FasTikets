import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../../shared/services/session.service';
import { MessageService } from '../services/message.service';
import { baseUrl } from '../../global';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private messageService: MessageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const publicEndpoints = [
      '/auth/login',
      '/auth/registro',
      '/auth/verificar/cuenta',
      '/auth/verificar/reenviar',
      '/auth/recuperar-password',
      '/auth/olvido-contrasena',
      '/api/v1/auth/olvido-contrasena',
      '/api/v1/auth/verificar/cuenta',
      '/api/v1/auth/verificar/reenviar',
      `${baseUrl}/auth/olvido-contrasena`,
      `${baseUrl}/auth/verificar/cuenta`,
      `${baseUrl}/auth/verificar/reenviar`,
      '/public',
      '/carrito/items',
      '/api/v1/auth/login',
      '/api/v1/geografia',
      `${baseUrl}/auth/login`
    ];

    const publicEventEndpoints = [
      '/api/v1/eventos',
      `${baseUrl}/eventos`,
      '/api/v1/locales',
      `${baseUrl}/locales`,
      '/api/v1/zonas',
      `${baseUrl}/zonas`,
      '/api/v1/tipos-ticket',
      `${baseUrl}/tipos-ticket`
    ];

    const protectedEventEndpoints = [
      '/api/v1/eventos/',
      `${baseUrl}/eventos/`
    ];

    const multipartEndpoints = [
      '/eventos/con-imagen',
      '/api/v1/eventos/con-imagen'
    ];

    const protectedEndpoints = [
      '/api/v1/usuario',
      '/api/v1/admin',
      '/api/v1/administrador',
      '/api/v1/compras',
      '/api/v1/facturacion'
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
    const isPublicEventEndpoint = publicEventEndpoints.some(endpoint => req.url.includes(endpoint)) && 
                                  req.method === 'GET' && 
                                  !req.url.includes('/reporte/') && 
                                  !req.url.includes('/admin/');
    const isProtectedEventEndpoint = protectedEventEndpoints.some(endpoint => 
      req.url.includes(endpoint) && (req.url.includes('/reporte/') || req.url.includes('/admin/'))
    );
    const isStrictlyProtected = protectedEndpoints.some(endpoint => req.url.includes(endpoint));

    if (isPublicEndpoint || isPublicEventEndpoint) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.messageService.error(
              'Error de conexión. Verifique su conexión a internet o contacte al administrador.',
              'Error de Conexión'
            );
          }
          return throwError(() => error);
        })
      );
    }

    if (isProtectedEventEndpoint || isStrictlyProtected || 
        (!isPublicEndpoint && !isPublicEventEndpoint)) {
      
      const currentUser = this.sessionService.getCurrentUser();

      if (currentUser && currentUser.token) {
        const isFormData = req.body instanceof FormData;
        const isMultipartEndpoint = multipartEndpoints.some(endpoint => req.url.includes(endpoint));
        const headers: { [key: string]: string } = {
          'Authorization': `Bearer ${currentUser.token}`
        };

        const hasBody = req.body !== null && req.body !== undefined;
        const hasContentType = req.headers.has('Content-Type');
        const needsContentType = !isFormData && hasBody && !hasContentType && 
                                (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH');
        
        if (needsContentType) {
          headers['Content-Type'] = 'application/json';
        }

        let authReq: HttpRequest<any>;
        if (isMultipartEndpoint && isFormData) {
          authReq = req.clone({
            setHeaders: {
              'Authorization': `Bearer ${currentUser.token}`
            }
          });
        } else {
          authReq = req.clone({
            setHeaders: headers
          });
        }

        return next.handle(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('❌ Error en petición autenticada:', {
              url: req.url,
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error,
              headers: error.headers?.keys?.(),
              requestHeaders: authReq.headers?.keys?.()
            });

            // Log específico para error 403
            if (error.status === 403) {
              console.error('Error 403:', {
                url: req.url,
                userRole: currentUser.rol,
                userId: currentUser.idUsuario,
                method: req.method
              });
            }

            if (error.status === 0) {
              console.error('Error de CORS:', req.url, req.method);
            }

            return this.handleAuthError(error);
          })
        );
      } else {
        console.warn('Petición requiere autenticación pero no hay token:', req.url);
        return throwError(() => new Error('Authentication required'));
      }
    }

    return next.handle(req);
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    switch (error.status) {
      case 401:
        this.messageService.error(
          'Su sesión ha expirado o no tiene permisos. Por favor, inicie sesión nuevamente.',
          'No Autorizado'
        );
        this.sessionService.clearUser();
        this.router.navigate(['/login']);
        break;

      case 403:
        this.messageService.error(
          'No tiene permisos suficientes para realizar esta acción.',
          'Acceso Denegado'
        );
        break;

      case 0:
        this.messageService.connectionError();
        break;
    }

    return throwError(() => error);
  }
}
