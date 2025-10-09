import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BasicResponse, LoginResponse, Usuario, Persona } from '../interfaces/login.interface';
import * as global from '../../global';
import { CacheStore } from '../interfaces/cache-store.interface';

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

  url = global.url;

  constructor(private http: HttpClient) {
    this.loadFromSessionStorage();
  }

  private saveToSessionStorage() {
    sessionStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromSessionStorage() {
    if (!sessionStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(sessionStorage.getItem('cacheStore')!);
  }

  getLogin(email: string, contrasena: string): Observable<LoginResponse> {
    const filtro = {
      "email": email,
      "contrasena": contrasena,
    };

    return this.http.post<LoginResponse>(`http://localhost:8080/api/personas/login`, filtro)  //${this.url}auth/v1/session
      .pipe(
        tap(login => {
          this.cacheStore.usuario = {
            codiPers: login.persona.docIdentidad,
            nombPers: `${login.persona.nombres} ${login.persona.apellidos}`,
            linkFoto: '',
            codiPues: 0,
            permissions: []
          };
          // Guardar también la información completa de la persona
          this.cacheStore.persona = login.persona;
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
        message: error.error.message || 'Ha ocurrido un error desconocido.'
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
  getCurrentPersona(): Persona | null {
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
    this.saveToSessionStorage();
  }
}
