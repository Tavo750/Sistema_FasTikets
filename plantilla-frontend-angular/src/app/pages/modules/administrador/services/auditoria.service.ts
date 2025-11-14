import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { AuditoriaResponse } from '../interfaces/auditoria/auditoria.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService 
  ) { }

  /**
   * Obtiene todos los registros de auditoría del sistema
   * @returns Observable con la respuesta que contiene los registros de auditoría
   */
  getListarAuditoria(): Observable<AuditoriaResponse> {
    // Intentar primero con el endpoint que mostró el usuario
    const url = `${baseUrl}/admin/audit/`;
    console.log('🔍 Cargando registros de auditoría desde:', url);
    console.log('🌐 Base URL configurada:', baseUrl);
    
    return this.http.get<AuditoriaResponse>(url)
      .pipe(
        catchError((error) => {
          console.error('❌ Error al obtener registros de auditoría:', error);
          console.error('❌ URL intentada:', url);
          console.error('❌ Status:', error.status);
          console.error('❌ Error completo:', error);
          
          // Si falla con slash, intentar sin slash
          if (url.endsWith('/')) {
            const urlSinSlash = url.slice(0, -1);
            console.log('🔄 Reintentando sin slash final:', urlSinSlash);
            
            return this.http.get<AuditoriaResponse>(urlSinSlash).pipe(
              catchError((secondError) => {
                console.error('❌ También falló sin slash:', secondError);
                return this.httpUtils.handleError(secondError);
              })
            );
          }
          
          return this.httpUtils.handleError(error);
        })
      );
  }
}
