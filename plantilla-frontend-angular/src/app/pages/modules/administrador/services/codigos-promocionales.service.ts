import { ListarCodigosResponse } from './../interfaces/codigos-promocionales/lista-codigos.interface';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { baseUrl } from '../../../../global';
import { CodigosResponse, CrearCodigoPromocionalRequest } from '../interfaces/codigos-promocionales/codigos.interface';
import { EliminarCodigoResponse } from '../interfaces/codigos-promocionales/eliminar-codigo.interface';

@Injectable({
  providedIn: 'root'
})
export class CodigosPromocionalesService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }


  getListadoCodigosPromocionales(): Observable<ListarCodigosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales`;
    return this.http.get<ListarCodigosResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  getListadoCodigosPromocionalesPorID(id:number): Observable<ListarCodigosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales/${id}`;
    return this.http.get<ListarCodigosResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  postCrearCodigoPromocional(body: CrearCodigoPromocionalRequest): Observable<CodigosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales`;
    return this.http.post<CodigosResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  putActualizaCodigoPromocional(body: CrearCodigoPromocionalRequest): Observable<CodigosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales`;
    return this.http.put<CodigosResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  deleteCodigoPromocional(id: number): Observable<EliminarCodigoResponse> {
    const url = `${baseUrl}/admin/fidelizacion/codigos-promocionales/${id}`;
    return this.http.delete<EliminarCodigoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }




}
