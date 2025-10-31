import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginResponse, Data } from '../interfaces/login.interface';
import * as global from '../../global';
import { CacheStore, Usuario } from '../interfaces/cache-store.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  cacheStore: CacheStore = {
    usuario: {
      codiPers: '',
      nombPers: '',
      linkFoto: '',
      codiPues: 0,
      permissions: []
    },
    persona: undefined
  }

  private token: string = '';
  private userRole: string = '';

  url = global.baseUrl;

  constructor(private http: HttpClient) {
    this.loadFromSessionStorage();
  }

  private saveToSessionStorage() {
    sessionStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
    if (this.token) {
      sessionStorage.setItem('token', this.token);
    }
    if (this.userRole) {
      sessionStorage.setItem('userRole', this.userRole);
    }
  }

  private loadFromSessionStorage() {
    if (!sessionStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(sessionStorage.getItem('cacheStore')!);
    this.token = sessionStorage.getItem('token') || '';
    this.userRole = sessionStorage.getItem('userRole') || '';
  }

  getLogin(email: string, contrasena: string): Observable<LoginResponse> {
    const filtro = {
      "email": email,
      "contrasena": contrasena,
    };

    return this.http.post<LoginResponse>(`http://localhost:8081/api/v1/auth/login`, filtro)  //${this.url}auth/v1/session
      .pipe(
        tap(login => {
          // Guardar token y rol
          this.token = login.data.token;
          this.userRole = login.data.rol;

          this.cacheStore.usuario = {
            codiPers: login.data.idUsuario.toString(),
            nombPers: login.data.nombreCompleto,
            linkFoto: '',
            codiPues: 0,
            permissions: []
          };
          // Guardar los datos del usuario directamente
          this.cacheStore.persona = login.data;
        }),
        tap(() => this.saveToSessionStorage()),
        catchError(this.handleError)
      );
  }

  //------------------
  // Método de manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en el servicio:', error);

    // Verifica si el error contiene un cuerpo
    if (error.error) {
      const errorMessage = {
        responseCode: error.error.responseCode || 'Unknown',
        message: error.error.mensaje
      };

      // Lanza un nuevo error con el mensaje procesado
      return throwError(() => errorMessage);
    } else {
      // Caso sin cuerpo de respuesta
      const defaultError = {
        responseCode: error.status.toString(),
        message: error.message || 'Error inesperado en la solicitud.'
      };

      return throwError(() => defaultError);
    }
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Usuario | null {
    return this.cacheStore.usuario?.codiPers ? this.cacheStore.usuario : null;
  }

  // Método para obtener la persona actual
  getCurrentPersona(): Data | null {
    return this.cacheStore.persona || null;
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.cacheStore.usuario?.codiPers;
  }

  // Método para cerrar sesión
  logout(): void {
    this.cacheStore.usuario = {
      codiPers: '',
      nombPers: '',
      linkFoto: '',
      codiPues: 0,
      permissions: []
    };
    this.cacheStore.persona = undefined;
    this.token = '';
    this.userRole = '';

    // Limpiar sessionStorage
    sessionStorage.removeItem('cacheStore');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
  }

  // Método para obtener el token
  getToken(): string {
    return this.token;
  }

  // Método para obtener el rol del usuario
  getUserRole(): string {
    return this.userRole;
  }

  // Método para verificar si el token existe y no ha expirado
  isTokenValid(): boolean {
    return !!this.token;
  }
}
