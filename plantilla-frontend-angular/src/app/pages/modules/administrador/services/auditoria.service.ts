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
    
    
    return this.http.get<AuditoriaResponse>(url)
      .pipe(
        catchError((error) => {
          
          
          // Si falla con slash, intentar sin slash
          if (url.endsWith('/')) {
            const urlSinSlash = url.slice(0, -1);
            
            
            return this.http.get<AuditoriaResponse>(urlSinSlash).pipe(
              catchError((secondError) => {
                
                return this.httpUtils.handleError(secondError);
              })
            );
          }
          
          return this.httpUtils.handleError(error);
        })
      );
  }
}
