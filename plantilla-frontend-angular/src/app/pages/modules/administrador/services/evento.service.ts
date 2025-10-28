import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { ZonaCategoriaResponse } from '../interfaces/gestion-evento/zona-categoria.interface';
import { baseUrl } from '../../../../global';
import { EliminaZonaResponse } from '../interfaces/gestion-evento/elimina-zona.interface';
import { CrearEventoResponse, CrearEventoRequest } from '../interfaces/gestion-evento/evento.interface';
import { EliminaEventoResponse } from '../interfaces/gestion-evento/elimina-evento.interface';
import { EntradaResponse, EntradaResponseArray } from '../interfaces/gestion-evento/entrada.interface';
import { EliminaEntradaResponse } from '../interfaces/gestion-evento/elimina-entrada.interface';

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

  /**
   * Crea un nuevo evento
   * @param body Datos del evento a crear
   * @returns Observable con la respuesta del servidor
   */
  postCrearEvento(body: CrearEventoRequest): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos`;
    return this.http.post<CrearEventoResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   *  Obtiene la lista de eventos
   * @returns   Observable con la respuesta que contiene la lista de eventos
   *
   */
  getListarEventos(): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos`;
    return this.http.get<CrearEventoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene un evento por su ID
   * @param id ID del evento a obtener
   * @returns Observable con la respuesta que contiene los datos del evento
   */
  getEventoPorId(id: number): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos/${id}`;
    return this.http.get<CrearEventoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   *
   * @param id
   * @returns
   */

  deleteEvento(id: number): Observable<EliminaEventoResponse> {
    const url = `${baseUrl}/eventos/${id}`;
    return this.http.delete<CrearEventoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  putActualizarEvento(id: number, body: CrearEventoRequest): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos/${id}`;
    return this.http.put<CrearEventoResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }


// ========================= entradas ======================
  /**
   * Obtiene la lista de entradas
   * @returns Observable con la respuesta que contiene la lista de entradas
   */

  getListarEntradas(): Observable<EntradaResponse> {
    const url = `${baseUrl}/tipos-ticket`;
    return this.http.get<EntradaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  getListarEntradasID(idZona: number): Observable<EntradaResponseArray> {
    const url = `${baseUrl}/tipos-ticket?idZona=${idZona}`;
    return this.http.get<EntradaResponseArray>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   *
   * @param body  Datos de la entrada a crear
   * @returns
   */
  postCrearEntrada(body: { nombre: string; descripcion: string; precio: number; stock: number; activo: boolean; idZona: number; limitePorPersona: number }): Observable<EntradaResponse> {
    const url = `${baseUrl}/tipos-ticket`;
    return this.http.post<EntradaResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  deleteEntrada(id: number): Observable<EliminaEntradaResponse> {
    const url = `${baseUrl}/tipos-ticket/${id}`;
    return this.http.delete<EliminaEntradaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

}

