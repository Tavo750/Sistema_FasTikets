import { Injectable } from '@angular/core';import { Injectable } from '@angular/core';import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { SessionService } from '../../shared/services/session.service';

import { Observable, throwError } from 'rxjs';import { Observable, throwError } from 'rxjs';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {import { catchError } from 'rxjs/operators';import { catchError } from 'rxjs/operators';



  constructor(import { Router } from '@angular/router';import { Router } from '@angular/router';

    private sessionService: SessionService

  ) { }import { SessionService } from '../../shared/services/session.service';import { SessionService } from '../../shared/services/session.service';



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {import { MessageService } from '../services/message.service';import { MessageService } from '../services/message.service';

    // URLs que NO requieren token (endpoints públicos)

    const publicEndpoints = [

      '/auth/login',

      '/auth/registro',@Injectable()@Injectable()

      '/api/v1/eventos',

      '/api/v1/auth/login',export class AuthInterceptor implements HttpInterceptor {export class AuthInterceptor implements HttpInterceptor {

      'localhost:8081/api/v1/eventos',

      'localhost:8081/api/v1/auth/login'

    ];

  constructor(  constructor(

    // Verificar si es un endpoint público

    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));    private sessionService: SessionService,    private sessionService: SessionService,



    if (isPublicEndpoint) {    private router: Router,    private router: Router,

      // Para endpoints públicos, enviar sin token

      return next.handle(req);    private messageService: MessageService    private messageService: MessageService

    }

  ) { }  ) { }

    // Para otros endpoints, agregar token si existe

    const currentUser = this.sessionService.getCurrentUser();



    if (currentUser && currentUser.token) {  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const authReq = req.clone({

        setHeaders: {    // URLs que NO requieren token (endpoints públicos)    // URLs que NO requieren token (endpoints públicos)

          'Authorization': `Bearer ${currentUser.token}`,

          'Content-Type': 'application/json'    const publicEndpoints = [    const publicEndpoints = [

        }

      });      '/auth/login',      '/auth/login',

      return next.handle(authReq);

    } else {      '/auth/registro',      '/auth/registro',

      // Sin token, enviar petición sin modificar (no redirigir)

      return next.handle(req);      '/auth/recuperar-password',      '/auth/recuperar-password',

    }

  }      '/public',      '/public',

}
      '/api/v1/eventos', // Eventos públicos      '/api/v1/eventos', // Eventos públicos

      '/api/v1/auth/login', // Login específico      '/api/v1/auth/login', // Login específico

      'localhost:8081/api/v1/eventos', // Eventos con dominio completo      'localhost:8081/api/v1/eventos', // Eventos con dominio completo

      'localhost:8081/api/v1/auth/login' // Login con dominio completo      'localhost:8081/api/v1/auth/login' // Login con dominio completo

    ];    ];



    // URLs que REQUIEREN autenticación estricta (redirigen al login si no hay token)    // URLs que REQUIEREN autenticación estricta (redirigen al login si no hay token)

    const protectedEndpoints = [    const protectedEndpoints = [

      '/api/v1/usuario',      '/api/v1/usuario',

      '/api/v1/admin',      '/api/v1/admin',

      '/api/v1/compras',      '/api/v1/compras',

      '/api/v1/facturacion'      '/api/v1/facturacion'

    ];    ];



    // Verificar si es un endpoint público    // Verificar si es un endpoint público

    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));



    // Verificar si es un endpoint estrictamente protegido    // Verificar si es un endpoint estrictamente protegido

    const isStrictlyProtected = protectedEndpoints.some(endpoint => req.url.includes(endpoint));    const isStrictlyProtected = protectedEndpoints.some(endpoint => req.url.includes(endpoint));



    if (isPublicEndpoint) {    if (isPublicEndpoint) {

      // Para endpoints públicos, enviar la petición sin modificar      // Para endpoints públicos, enviar la petición sin modificar

      return next.handle(req);      return next.handle(req);

    }    }



    // Para otros endpoints, verificar autenticación    // Para otros endpoints, verificar autenticación

    const currentUser = this.sessionService.getCurrentUser();    const currentUser = this.sessionService.getCurrentUser();



    if (currentUser && currentUser.token) {    if (currentUser && currentUser.token) {

      // Detectar si se está enviando FormData (para archivos)      // Detectar si se está enviando FormData (para archivos)

      const isFormData = req.body instanceof FormData;      const isFormData = req.body instanceof FormData;



      // Preparar headers base      // Preparar headers base

      const headers: { [key: string]: string } = {      const headers: { [key: string]: string } = {

        'Authorization': `Bearer ${currentUser.token}`        'Authorization': `Bearer ${currentUser.token}`

      };      };



      // Solo agregar Content-Type si NO es FormData      // Solo agregar Content-Type si NO es FormData

      // El navegador establecerá automáticamente el Content-Type correcto para FormData      // El navegador establecerá automáticamente el Content-Type correcto para FormData

      if (!isFormData) {      if (!isFormData) {

        headers['Content-Type'] = 'application/json';        headers['Content-Type'] = 'application/json';

      }      }



      // Clonar la petición y agregar el header de autorización      // Clonar la petición y agregar el header de autorización

      const authReq = req.clone({      const authReq = req.clone({

        setHeaders: headers        setHeaders: headers

      });        });



      return next.handle(authReq).pipe(        return next.handle(authReq).pipe(

        catchError((error: HttpErrorResponse) => {          catchError((error: HttpErrorResponse) => {

          return this.handleAuthError(error);            return this.handleAuthError(error);

        })          })

      );        );

    } else {      } else {

      // No hay token        // No hay token para un endpoint que lo requiere

      if (isStrictlyProtected) {        // En lugar de redirigir automáticamente, rechazar la petición

        // Solo redirigir al login si es un endpoint estrictamente protegido        console.warn('Petición requiere autenticación pero no hay token:', req.url);

        this.messageService.error(        return throwError(() => new Error('Authentication required'));

          'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',      }

          'Sesión Expirada'    }

        );

        this.sessionService.clearUser();    // Para endpoints públicos, enviar la petición sin modificar

        this.router.navigate(['/login']);    return next.handle(req);

        return throwError(() => new Error('Session expired'));  }

      } else {

        // Para otros endpoints, simplemente rechazar la petición sin redirigir  private handleAuthError(error: HttpErrorResponse): Observable<never> {

        console.warn('Petición requiere autenticación pero no hay token:', req.url);    switch (error.status) {

        return throwError(() => new Error('Authentication required'));      case 401:

      }        // Token inválido o expirado

    }        this.messageService.error(

  }          'Su sesión ha expirado o no tiene permisos. Por favor, inicie sesión nuevamente.',

          'No Autorizado'

  private handleAuthError(error: HttpErrorResponse): Observable<never> {        );

    switch (error.status) {        this.sessionService.clearUser();

      case 401:        this.router.navigate(['/login']);

        // Token inválido o expirado        break;

        this.messageService.error(

          'Su sesión ha expirado o no tiene permisos. Por favor, inicie sesión nuevamente.',      case 403:

          'No Autorizado'        // Sin permisos suficientes

        );        this.messageService.error(

        this.sessionService.clearUser();          'No tiene permisos suficientes para realizar esta acción.',

        this.router.navigate(['/login']);          'Acceso Denegado'

        break;        );

        break;

      case 403:

        // Sin permisos suficientes      case 0:

        this.messageService.error(        // Error de conexión

          'No tiene permisos suficientes para realizar esta acción.',        this.messageService.connectionError();

          'Acceso Denegado'        break;

        );

        break;      default:

        // Otros errores se manejan normalmente

      case 0:        break;

        // Error de conexión    }

        this.messageService.connectionError();

        break;    return throwError(() => error);

  }

      default:}

        // Otros errores se manejan normalmente
        break;
    }

    return throwError(() => error);
  }
}
