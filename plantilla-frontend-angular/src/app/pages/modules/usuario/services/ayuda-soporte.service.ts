import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from '../../../../global';
import { AyudaSoporteRequest, AyudaSoporteResponse } from '../interfaces/ayuda-soporte/ayuda-soporte.interface';
import { AyudaSoporteListResponse } from '../interfaces/ayuda-soporte/ayuda-soporte-listar.interface';

@Injectable({
  providedIn: 'root'
})
export class AyudaSoporteService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Crea una solicitud de soporte
   */
  crearSolicitudSoporte(body: AyudaSoporteRequest): Observable<AyudaSoporteResponse> {
    // `baseUrl` ya contiene el prefijo /api/v1 (ver src/app/global.ts), evitar duplicarlo
    const url = `${baseUrl}/soporte`;
    console.log('AyudaSoporteService.crearSolicitudSoporte payload:', body, 'url:', url);
    return this.http.post<AyudaSoporteResponse>(url, body).pipe(
      catchError((error) => this.httpUtils.handleError(error))
    );
  }

  /**
   * Obtiene el listado de solicitudes de soporte
   */
  listarSolicitudes(): Observable<AyudaSoporteListResponse> {
    const url = `${baseUrl}/soporte`;
    console.log('AyudaSoporteService.listarSolicitudes url:', url);
    return this.http.get<AyudaSoporteListResponse>(url).pipe(
      catchError((error) => this.httpUtils.handleError(error))
    );
  }
}
