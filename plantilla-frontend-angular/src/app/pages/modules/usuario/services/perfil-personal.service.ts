import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { BodyPerfilPersonal, PerfilPersonalResponse } from '../interfaces/perfil-personal/perfil-personal.interface';
import { EliminarCuentaResponse } from '../interfaces/perfil-personal/eliminar-cuenta.interface';
import { CambiarContrasenaUsuarioRequest, CambiarContrasenaUsuarioResponse } from '../interfaces/perfil-personal/cambiar-contrasena-usuario.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class PerfilPersonalService {

  private readonly baseUrl = baseUrl;

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Obtiene el perfil personal de un cliente por su ID
   * @param id - ID del cliente
   * @returns Observable con la respuesta del perfil personal
   */
  getobtenerPerfilPorId(id: number): Observable<PerfilPersonalResponse> {
    const url = `${this.baseUrl}/clientes/perfil`;
    return this.http.get<PerfilPersonalResponse>(url)
    .pipe(
      catchError(this.httpUtils.handleError.bind(this.httpUtils))
    );
  }

  /**
   * Actualiza el perfil personal de un cliente por su ID
   * @param id - ID del cliente
   * @param body - Datos del perfil a actualizar
   * @returns Observable con la respuesta del perfil actualizado
   */
  putActualizarPerfilPorId(id: number, body: BodyPerfilPersonal): Observable<PerfilPersonalResponse> {
    const url = `${this.baseUrl}/clientes/perfil`;
    return this.http.put<PerfilPersonalResponse>(url, body)
    .pipe(
      catchError(this.httpUtils.handleError.bind(this.httpUtils))
    );
  }

  /**
   * Cambiar contraseña del usuario
   * @param requestData Datos necesarios para cambiar la contraseña
   * @returns Observable con la respuesta del servidor
   */
  putCambiarContrasena(requestData: CambiarContrasenaUsuarioRequest): Observable<CambiarContrasenaUsuarioResponse> {
    const url = `${this.baseUrl}/auth/cambiar-contrasena`;

    return this.http.put<CambiarContrasenaUsuarioResponse>(url, requestData)
      .pipe(
        catchError(this.httpUtils.handleError.bind(this.httpUtils))
      );
  }

  /**
   * Elimina (desactiva) la cuenta del cliente autenticado (mi cuenta)
   * @returns Observable con la respuesta del servidor
   */
  deleteMiCuenta(): Observable<EliminarCuentaResponse> {
    const url = `${this.baseUrl}/clientes/mi-cuenta`;
    return this.http.delete<EliminarCuentaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError.bind(this.httpUtils))
      );
  }

}
