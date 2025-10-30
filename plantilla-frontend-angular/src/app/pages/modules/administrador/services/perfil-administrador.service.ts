import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { CambiarContrasenaRequest, CambiarContrasenaResponse } from '../interfaces/perfil-administrador/cambiar-contraseña.interface';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { PerfilAdministradorResponse } from '../interfaces/perfil-administrador/perfilAdministradorResponse.interface';
import { ActualizarPerfilRequest } from '../interfaces/perfil-administrador/actualizar-perfil.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class PerfilAdministradorService {

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
    const url = `${baseUrl}/auth/cambiar-contrasena`;

    return this.http.put<CambiarContrasenaResponse>(url, requestData)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene el perfil del administrador por ID
   * NOTA: Esta petición requiere autenticación. El token se agrega automáticamente
   * a través del AuthInterceptor, no es necesario agregarlo manualmente.
   * @param id ID del usuario administrador
   * @returns Observable con la respuesta del servidor
   */
  getPerfilAdministrador(id: number): Observable<PerfilAdministradorResponse> {
    const url = `${baseUrl}/administrador/perfil`;
    return this.http.get<PerfilAdministradorResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   * Actualiza el perfil del administrador
   * @param id ID del usuario administrador
   * @param perfilData Datos del perfil a actualizar
   * @returns Observable con la respuesta del servidor
   */
  putActualizarPerfilAdministrador(id: number, perfilData: ActualizarPerfilRequest): Observable<PerfilAdministradorResponse> {
    const url = `${baseUrl}/administrador/perfil`;
    return this.http.put<PerfilAdministradorResponse>(url, perfilData)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }


}
