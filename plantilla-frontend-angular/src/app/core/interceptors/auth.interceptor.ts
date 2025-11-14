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
    // URLs que NO requieren token (endpoints públicos)
    const publicEndpoints = [
      '/auth/login',
      '/auth/registro',
      '/auth/recuperar-password',
      '/public',
      '/carrito/items',
      '/api/v1/auth/login', // Login específico
      '/api/v1/geografia', // Endpoints de geografía (departamentos, provincias, distritos)
      'localhost:8081/api/v1/auth/login' // Login con dominio completo
    ];

    // Endpoints públicos de eventos y locales (solo lectura - GET)
    const publicEventEndpoints = [
      '/api/v1/eventos',
      'localhost:8081/api/v1/eventos',
      '/api/v1/locales',
      'localhost:8081/api/v1/locales',
      '/api/v1/zonas',
      'localhost:8081/api/v1/zonas',
      '/api/v1/tipos-ticket',
      'localhost:8081/api/v1/tipos-ticket'
    ];

    // Endpoints con multipart/form-data que necesitan manejo especial
    const multipartEndpoints = [
      '/eventos/con-imagen',
      '/api/v1/eventos/con-imagen'
    ];

    // URLs que REQUIEREN autenticación estricta (redirigen al login si no hay token)
    const protectedEndpoints = [
      '/api/v1/usuario',
      '/api/v1/admin',
      '/api/v1/administrador', // Agregamos específicamente el endpoint de administrador
      '/api/v1/compras',
      '/api/v1/facturacion'
    ];

    // Verificar si es un endpoint público
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    // Verificar si es un endpoint público de eventos (solo GET)
    const isPublicEventEndpoint = publicEventEndpoints.some(endpoint => req.url.includes(endpoint)) && req.method === 'GET';

    // Verificar si es un endpoint estrictamente protegido
    const isStrictlyProtected = protectedEndpoints.some(endpoint => req.url.includes(endpoint));

    if (isPublicEndpoint || isPublicEventEndpoint) {
      // Para endpoints públicos, enviar la petición sin modificar
      return next.handle(req);
    }

    // Para otros endpoints, verificar autenticación
    const currentUser = this.sessionService.getCurrentUser();

    if (currentUser && currentUser.token) {
      // Detectar si se está enviando FormData (para archivos)
      const isFormData = req.body instanceof FormData;
      const isMultipartEndpoint = multipartEndpoints.some(endpoint => req.url.includes(endpoint));

      // Preparar headers base
      const headers: { [key: string]: string } = {
        'Authorization': `Bearer ${currentUser.token}`
      };

      // Solo agregar Content-Type si NO es FormData
      // El navegador establecerá automáticamente el Content-Type correcto para FormData
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      // Para endpoints multipart, clonar de forma especial
      let authReq: HttpRequest<any>;
      if (isMultipartEndpoint && isFormData) {
        // Solo agregar header de autorización, sin tocar body ni content-type
        authReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
      } else {
        // Clonar la petición normal
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
            console.error('🚫 ERROR 403 DETALLADO:', {
              url: req.url,
              userRole: currentUser.rol,
              userId: currentUser.idUsuario,
              tokenLength: currentUser.token?.length,
              tokenStart: currentUser.token?.substring(0, 30) + '...',
              requestMethod: req.method,
              timestamp: new Date().toISOString()
            });
          }

          return this.handleAuthError(error);
        })
      );
    } else {
      // No hay token para un endpoint que lo requiere
      // En lugar de redirigir automáticamente, rechazar la petición
      console.warn('⚠️ Petición requiere autenticación pero no hay token:', req.url);
      return throwError(() => new Error('Authentication required'));
    }
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
