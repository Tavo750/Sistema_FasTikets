import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { RegistroUsuario, RegistroResponse } from '../interfaces/registro_usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  postRegistro(usuario: RegistroUsuario): Observable<RegistroResponse> {
    const url = `${this.baseUrl}/api/v1/auth/registro`;
    return this.http.post<RegistroResponse>(url, usuario).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el registro';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.error?.mensaje || 'Error desconocido'}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
