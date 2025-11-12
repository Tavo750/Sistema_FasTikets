import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { HistorialPuntosResponse } from '../interfaces/beneficios/historial-puntos.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class HistorialPuntosService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Obtiene el historial de puntos del cliente autenticado
   * @returns Observable con la respuesta que contiene el historial de puntos del cliente
   */
  getObtenerHistorialDePuntosDeClienteAutenticado(): Observable<HistorialPuntosResponse> {
    const url = `${baseUrl}/cliente/fidelizacion/historial-puntos`;
    return this.http.get<HistorialPuntosResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

}

