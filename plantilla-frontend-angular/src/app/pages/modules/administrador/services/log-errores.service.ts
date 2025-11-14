import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { LogErroresResponse, CrearErrorRequest, CrearErrorResponse } from '../interfaces/log-errores/log-errores.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class LogErroresService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService 
  ) { }

  /**
   * Obtiene todos los registros de errores del sistema
   * @returns Observable con la respuesta que contiene los registros de errores
   */
  getListarLogErrores(): Observable<LogErroresResponse> {
    const url = `${baseUrl}/admin/logs/errors`;
    console.log('🔍 Cargando registros de errores desde:', url);
    
    return this.http.get<LogErroresResponse>(url)
      .pipe(
        catchError((error) => {
          console.error('❌ Error al obtener registros de errores:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }

  /**
   * Crea un nuevo registro de error en el sistema
   * @param body Datos del error a crear
   * @returns Observable con la respuesta del servidor que incluye el error creado
   */
  postCrearError(body: CrearErrorRequest): Observable<CrearErrorResponse> {
    const url = `${baseUrl}/admin/logs/errors`;
    console.log('📝 Creando nuevo error en:', url, body);
    
    return this.http.post<CrearErrorResponse>(url, body)
      .pipe(
        catchError((error) => {
          console.error('❌ Error al crear registro de error:', error);
          return this.httpUtils.handleError(error);
        })
      );
  }
}
