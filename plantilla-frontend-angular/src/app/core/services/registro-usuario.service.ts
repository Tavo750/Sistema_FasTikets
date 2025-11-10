import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { RegistroResponse, RegistroUsuario } from '../interfaces/registro_usuario.interface';
import { Departamento, Distrito, Provincia } from '../interfaces/ubigeo.interface';
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
    const url = `http://localhost:8081/api/v1/auth/registro`;
    return this.http.post<any>(url, usuario);
  }


  //================= Ubigeo ==================
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${baseUrl}/departamentos`);
  }

  getProvincias(departamentoId: string): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${baseUrl}/provincias?departamento_id=${departamentoId}`);
  }

  getDistritos(provinciaId: string): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(`${baseUrl}/distritos?provincia_id=${provinciaId}`);
  }

}
