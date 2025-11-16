import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OlvidoContraResponse, ValidaCodigoResponse, ResetResponse } from '../interfaces/cambio-contra.interface';
import { baseUrl } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class CambiarContraService {

  

  constructor(private http: HttpClient) { }

  putOlvidoContrasena(email: string): Observable<OlvidoContraResponse> {
    const body = { email };
    return this.http.put<OlvidoContraResponse>(`${baseUrl}/auth/olvido-contrasena`, body);
  }

  postValidaCodigo(email: string, codigo: string): Observable<ValidaCodigoResponse> {
    const body = { email, codigo };
    return this.http.post<ValidaCodigoResponse>(`${baseUrl}/auth/olvido-contrasena/validar`, body);
  }

  putReset(email: string, contrasena: string, contrasenaConfirmacion: string): Observable<ResetResponse> {
    const body = { email, contrasena, contrasenaConfirmacion };
    return this.http.put<ResetResponse>(`${baseUrl}/auth/olvido-contrasena/reset`, body);
  }

  
}