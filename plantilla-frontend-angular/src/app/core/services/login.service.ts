import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BasicResponse, LoginResponse, Usuario } from '../interfaces/login.interface';
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
    }
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

  getLogin(p_codipers: string, p_clavpers: string): Observable<LoginResponse> {
    const filtro = {
      "user": p_codipers,
      "password": p_clavpers,
    };

    return this.http.post<LoginResponse>(`${this.url}auth/v1/session`, filtro)
      .pipe(
        tap(login => this.cacheStore.usuario = login.data),
        tap(() => this.saveToSessionStorage()),
        catchError(this.handleError)
      );
  }

  cerrarSesion(usuario: string, codiPuesto: number): Observable<BasicResponse> {

    const filtro = {
      "userCode": usuario,
      "workstationCode": codiPuesto
    };

    return this.http.post<BasicResponse>(this.url + 'auth/v1/closeSession', filtro).pipe(
      catchError(this.handleError) // Maneja errores
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
}
