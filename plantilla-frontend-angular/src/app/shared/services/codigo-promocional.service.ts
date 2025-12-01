import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from './http-utils.service';
import { baseUrl } from '../../global';

/**
 * Interface para el código promocional
 */
export interface CodigoPromocional {
  idCodigoPromocional: number;
  codigo: string;
  descripcion: string;
  fechaFin: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  stock: number;
  cantidadPorCliente: number;
  activo: boolean;
}

/**
 * Interface para la respuesta del endpoint
 */
export interface CodigoPromocionalResponse {
  ok: boolean;
  mensaje: string;
  data: CodigoPromocional;
}

/**
 * Servicio para gestionar códigos promocionales
 */
@Injectable({
  providedIn: 'root'
})
export class CodigoPromocionalService {

  private readonly apiUrl = `${baseUrl}/cliente/fidelizacion/codigo-promocional`;

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /**
   * Verifica un código promocional
   * GET /api/v1/cliente/fidelizacion/codigo-promocional/{codigo}
   * @param codigo Código promocional a verificar
   * @returns Observable con la información del código promocional
   */
  verificarCodigoPromocional(codigo: string): Observable<CodigoPromocionalResponse> {
    const url = `${this.apiUrl}/${codigo}`;
    return this.http.get<CodigoPromocionalResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Calcula el descuento aplicable según el tipo de código
   * @param codigo Información del código promocional
   * @param subtotal Subtotal de la compra
   * @returns Monto del descuento
   */
  calcularDescuento(codigo: CodigoPromocional, subtotal: number): number {
    const tipoNormalizado = codigo.tipo.toUpperCase().replace(/_/g, '_');
    
    if (tipoNormalizado === 'PORCENTAJE') {
      return subtotal * (codigo.valor / 100);
    } else if (tipoNormalizado === 'MONTO_FIJO' || tipoNormalizado === 'MONTO FIJO') {
      return Math.min(codigo.valor, subtotal); // No puede ser mayor al subtotal
    }
    return 0;
  }

  /**
   * Formatea el valor del descuento para mostrar
   * @param codigo Información del código promocional
   * @returns String formateado del descuento
   */
  formatearDescuento(codigo: CodigoPromocional): string {
    const tipoNormalizado = codigo.tipo.toUpperCase().replace(/_/g, '_');
    
    if (tipoNormalizado === 'PORCENTAJE') {
      return `${codigo.valor}%`;
    } else {
      return `S/ ${codigo.valor.toFixed(2)}`;
    }
  }
}
