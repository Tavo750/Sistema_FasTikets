import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { RegistroResponse, RegistroUsuario } from '../interfaces/registro_usuario.interface';
import { HttpUtilsService } from '../../shared/services/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {
  private baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  postRegistro(usuario: RegistroUsuario): Observable<RegistroResponse> {
    const url = `http://localhost:8081/api/v1/auth/registro`;
    return this.http.post<RegistroResponse>(url, usuario).pipe(
      catchError(this.httpUtils.handleError.bind(this.httpUtils))
    );
  }
}
