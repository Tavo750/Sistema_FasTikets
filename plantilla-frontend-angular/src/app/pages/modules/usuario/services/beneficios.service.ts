import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { BeneficiosResponse } from '../interfaces/beneficios/beneficios.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class BeneficiosService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Obtiene los puntos acumulados del cliente autenticado
   * @returns Observable con la respuesta que contiene los puntos del cliente
   */
  getObtenerPuntosDeClienteAutenticado(): Observable<BeneficiosResponse> {
    const url = `${baseUrl}/cliente/fidelizacion/puntos`;
    return this.http.get<BeneficiosResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  

}
