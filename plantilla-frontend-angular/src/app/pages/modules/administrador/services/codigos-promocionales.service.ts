import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { BodyCodigosPromocionales, CodigosPromocionalesResponse } from '../interfaces/codigos-promocionales/codigos-promocionales.interface';
import { CodigosPromocionalesListResponse } from '../interfaces/codigos-promocionales/codigos-promocionales-list.interface';
import { EliminaCodigoPromocionalResponse } from '../interfaces/codigos-promocionales/elimina-codigo-promocional.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class CodigosPromocionalesService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Obtiene un código promocional por su ID
   * @param id ID del código promocional a obtener
   * @returns Observable con la respuesta que contiene los datos del código promocional
   */
  getListarCodigosPromocionalesPorId(id: number): Observable<CodigosPromocionalesResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales/${id}`;
    return this.http.get<CodigosPromocionalesResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  putListarCodigosPromocionalesPorId(id: number, body: BodyCodigosPromocionales): Observable<CodigosPromocionalesResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales/${id}`;
    return this.http.put<CodigosPromocionalesResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene la lista de todos los códigos promocionales
   * @returns Observable con la respuesta que contiene la lista de códigos promocionales
   */
  getListarCodigosPromocionales(): Observable<CodigosPromocionalesListResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales`;
    return this.http.get<CodigosPromocionalesListResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Crea un nuevo código promocional
   * @param body Datos del código promocional a crear
   * @returns Observable con la respuesta del servidor que incluye el código promocional creado
   */
  postCrearCodigoPromocional(body: BodyCodigosPromocionales): Observable<CodigosPromocionalesResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales`;
    return this.http.post<CodigosPromocionalesResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Elimina un código promocional por su ID
   * @param id ID del código promocional a eliminar
   * @returns Observable con la respuesta del servidor confirmando la eliminación
   */
  deleteCodigoPromocional(id: number): Observable<EliminaCodigoPromocionalResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales/${id}`;
    return this.http.delete<EliminaCodigoPromocionalResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

}
