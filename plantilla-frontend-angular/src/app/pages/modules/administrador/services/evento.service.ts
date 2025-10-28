import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { ZonaCategoriaResponse } from '../interfaces/gestion-evento/zona-categoria.interface';
import { baseUrl } from '../../../../global';
import { EliminaZonaResponse } from '../interfaces/gestion-evento/elimina-zona.interface';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /// ========================= local y asientos  ======================

  /*
    * Crea una nueva zona
    * @param body Datos de la zona a crear
    * @returns Observable con la respuesta del servidor
  */

  postCrearZona(body: { nombre: string; aforoMax: number; idLocal: number }): Observable<ZonaCategoriaResponse> {
    const url = `${baseUrl}/zonas`;
    return this.http.post<ZonaCategoriaResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   * Obtiene la lista de zonas filtradas por local
   * @param idLocal ID del local para filtrar las zonas
   * @returns Observable con la respuesta que contiene la lista de zonas
   */

  getListarZonas(idLocal: number): Observable<ZonaCategoriaResponse> {
    const url = `${baseUrl}/zonas?local=${idLocal}`;
    return this.http.get<ZonaCategoriaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Elimina una zona por su ID
   * @param id ID de la zona a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteZona(id: number): Observable<EliminaZonaResponse> {
    const url = `${baseUrl}/zonas/${id}`;
    return this.http.delete<EliminaZonaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  // ========================= datos generales evento  ======================




}
