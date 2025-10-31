import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { RegistroResponse, RegistroUsuario } from '../interfaces/registro_usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {
  private baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  postRegistro(usuario: RegistroUsuario): Observable<any> {
    const url = `http://localhost:8081/api/v1/auth/registro`;
    return this.http.post<any>(url, usuario);
  }
}
