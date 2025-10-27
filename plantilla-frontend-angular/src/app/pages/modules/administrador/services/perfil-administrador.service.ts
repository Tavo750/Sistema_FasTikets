import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { CambiarContrasenaRequest, CambiarContrasenaResponse } from '../interfaces/perfil-administrador/cambiar-contraseña.interface';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { PerfilAdministradorResponse } from '../interfaces/perfil-administrador/perfilAdministradorResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class PerfilAdministradorService {

  private baseUrl = 'http://localhost:8081/api/v1';

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Cambiar contraseña del usuario administrador
   * @param requestData Datos necesarios para cambiar la contraseña
   * @returns Observable con la respuesta del servidor
   */
  putCambiarContrasena(requestData: CambiarContrasenaRequest): Observable<CambiarContrasenaResponse> {
    const url = `${this.baseUrl}/auth/cambiar-contrasena`;

    return this.http.put<CambiarContrasenaResponse>(url, requestData)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  getPerfilAdministrador(id: number): Observable<PerfilAdministradorResponse> {
    const url = `${this.baseUrl}/clientes/${id}/perfil`;
    return this.http.get<PerfilAdministradorResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }


}
