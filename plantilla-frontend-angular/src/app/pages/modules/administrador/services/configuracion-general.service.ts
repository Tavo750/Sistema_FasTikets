import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { 
  ConfiguracionGeneralResponse, 
  ConfiguracionOperacionResponse,
  ConfiguracionRequest 
} from '../interfaces/configuracion-general/configuracion-general.interface';
import { baseUrl } from '../../../../global';

/**
 * Servicio para gestionar las configuraciones generales del sistema
 */
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionGeneralService {

  private readonly apiUrl = `${baseUrl}/configuracion`;

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Obtiene todas las configuraciones generales
   * GET /api/v1/admin/configuracion
   * @returns Observable con la lista de configuraciones
   */
  getConfiguraciones(): Observable<ConfiguracionGeneralResponse> {
    return this.http.get<ConfiguracionGeneralResponse>(this.apiUrl)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene una configuración por su key
   * GET /api/v1/admin/configuracion/{key}
   * @param key Clave de la configuración
   * @returns Observable con la configuración
   */
  getConfiguracionPorKey(key: string): Observable<ConfiguracionOperacionResponse> {
    const url = `${this.apiUrl}/${key}`;
    return this.http.get<ConfiguracionOperacionResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Crea una nueva configuración
   * POST /api/v1/admin/configuracion
   * @param config Datos de la configuración a crear
   * @returns Observable con la respuesta
   */
  createConfiguracion(config: ConfiguracionRequest): Observable<ConfiguracionOperacionResponse> {
    return this.http.post<ConfiguracionOperacionResponse>(this.apiUrl, config)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Actualiza una configuración existente
   * PUT /api/v1/admin/configuracion/{key}
   * @param key Clave de la configuración a actualizar
   * @param config Datos actualizados
   * @returns Observable con la respuesta
   */
  updateConfiguracion(key: string, config: ConfiguracionRequest): Observable<ConfiguracionOperacionResponse> {
    const url = `${this.apiUrl}/${key}`;
    return this.http.put<ConfiguracionOperacionResponse>(url, config)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Elimina una configuración
   * DELETE /api/v1/admin/configuracion/{key}
   * @param key Clave de la configuración a eliminar
   * @returns Observable con la respuesta
   */
  deleteConfiguracion(key: string): Observable<ConfiguracionOperacionResponse> {
    const url = `${this.apiUrl}/${key}`;
    return this.http.delete<ConfiguracionOperacionResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
}
