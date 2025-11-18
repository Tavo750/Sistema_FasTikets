import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { RegistroResponse, RegistroUsuario } from '../interfaces/registro_usuario.interface';
import { Departamento, departamentoResponse, Distrito, distritoResponse, Provincia, provinciaResponse } from '../interfaces/ubigeo.interface';
import { baseUrl } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {
  private baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  postRegistro(usuario: RegistroUsuario): Observable<any> {
    const url = `${baseUrl}/auth/registro`;
    return this.http.post<any>(url, usuario);
  }


  //================= Ubigeo ==================
  getDepartamentos(): Observable<departamentoResponse> {
    return this.http.get<departamentoResponse>(`${baseUrl}/geografia/departamentos`);
  }

  getProvincias(departamentoId: string): Observable<provinciaResponse> {
    return this.http.get<provinciaResponse>(`${baseUrl}/geografia/departamentos/${departamentoId}/provincias`);
  }

  getDistritos(provinciaId: string): Observable<distritoResponse> {
    return this.http.get<distritoResponse>(`${baseUrl}/geografia/provincias/${provinciaId}/distritos`);
  }

}
