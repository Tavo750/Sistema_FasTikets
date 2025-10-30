import { Injectable } from '@angular/core';
import { baseUrl } from '../../../../global';
import { HttpClient } from '@angular/common/http';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { Observable, catchError } from 'rxjs';
import { LocalResponse, ListarLocalesResponse } from '../interfaces/gestion-locales/local.interface';
import { CrearLocalRequest } from '../interfaces/gestion-locales/crear-local.interface';
import { DeleteLocalResponse } from '../interfaces/gestion-locales/delete-local.interface';
@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }


  /**
   * Crea un nuevo local
   * @param data Datos del local a crear
   * @returns Observable con la respuesta del servidor
   */
  postCrearLocal(data: CrearLocalRequest): Observable<LocalResponse> {
    const url = `${baseUrl}/locales`;
    return this.http.post<LocalResponse>(url, data)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   * Actualiza un local existente
   * @param id ID del local a actualizar
   * @param data Datos del local a actualizar
   * @returns Observable con la respuesta del servidor
   */
  putActualizarLocal(id: number, data: CrearLocalRequest): Observable<LocalResponse> {
    const url = `${baseUrl}/locales/${id}`;
    return this.http.put<LocalResponse>(url, data)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Actualiza un local existente con imagen
   * @param id ID del local a actualizar
   * @param formData FormData que contiene los datos del local y la imagen
   * @returns Observable con la respuesta del servidor
   */
  putActualizarLocalconImagen(id: number, formData: FormData): Observable<LocalResponse> {
    const url = `${baseUrl}/locales/${id}/con-imagen`;
    return this.http.put<LocalResponse>(url, formData)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   * Obtiene la lista de todos los locales
   * @returns Observable con la respuesta que contiene la lista de locales
   */
  getlistarLocales(): Observable<ListarLocalesResponse> {
    const url = `${baseUrl}/locales`;
    return this.http.get<ListarLocalesResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  getlistarLocalesPorID(id:number): Observable<ListarLocalesResponse> {
    const url = `${baseUrl}/locales/${id}`;
    return this.http.get<ListarLocalesResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   *  Elimina un local por su ID
   * @param id ID del local a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteLocal(id: number): Observable<DeleteLocalResponse> {
    const url = `${baseUrl}/locales/${id}`;
    return this.http.delete<DeleteLocalResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

}
