import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { BodyCodigosPromocionales, CodigosPromocionalesResponse } from '../interfaces/codigos-promocionales/codigos-promocionales.interface';
import { CodigosPromocionalesListResponse } from '../interfaces/codigos-promocionales/codigos-promocionales-list.interface';
import { EliminaCodigoPromocionalResponse } from '../interfaces/codigos-promocionales/elimina-codigo-promocional.interface';
import { 
  ReglasPuntosListResponse, 
  CreateReglaPuntosRequest, 
  CreateReglaPuntosResponse,
  UpdateReglaPuntosRequest,
  UpdateReglaPuntosResponse,
  DeleteReglaPuntosResponse
} from '../interfaces/reglas-puntos/reglas-puntos.interface';
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

  /**
   * Obtiene la lista de reglas de puntos
   * @returns Observable con la respuesta que contiene las reglas de puntos
   */
  getReglasPuntos(): Observable<ReglasPuntosListResponse> {
    const url = `${baseUrl}/admin/fidelizacion/reglas-puntos`;
    return this.http.get<ReglasPuntosListResponse>(url).pipe(
      catchError(this.httpUtils.handleError)
    );
  }

  /**
   * Crea una nueva regla de puntos
   * @param body Datos de la regla de puntos a crear
   * @returns Observable con la respuesta que contiene la regla creada
   */
  createReglaPuntos(body: CreateReglaPuntosRequest): Observable<CreateReglaPuntosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/reglas-puntos`;
    return this.http.post<CreateReglaPuntosResponse>(url, body).pipe(
      catchError(this.httpUtils.handleError)
    );
  }

  /**
   * Actualiza una regla de puntos por su ID
   * @param id ID de la regla de puntos a actualizar
   * @param body Datos de la regla de puntos a actualizar
   * @returns Observable con la respuesta que contiene la regla actualizada
   */
  updateReglaPuntos(id: number, body: UpdateReglaPuntosRequest): Observable<UpdateReglaPuntosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/reglas-puntos/${id}`;
    return this.http.put<UpdateReglaPuntosResponse>(url, body).pipe(
      catchError(this.httpUtils.handleError)
    );
  }

  /**
   * Elimina una regla de puntos por su ID
   * @param id ID de la regla de puntos a eliminar
   * @returns Observable con la respuesta de eliminación
   */
  deleteReglaPuntos(id: number): Observable<DeleteReglaPuntosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/reglas-puntos/${id}`;
    return this.http.delete<DeleteReglaPuntosResponse>(url).pipe(
      catchError(this.httpUtils.handleError)
    );
  }

}
