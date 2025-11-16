import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { baseUrl } from '../../global';
import { HttpUtilsService } from './http-utils.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private sessionService: SessionService
  ) {}

  /**
   * Crea una orden en el backend.
   * body debe tener la forma:
   * { idCliente: number, items: [{ idTipoTicket, cantidad, asistentes: [...] }] }
   */
  createOrder(body: any): Observable<any> {
    const url = `${baseUrl}/ordenes`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    try { console.debug('OrdenesService.createOrder -> POST', url, body); } catch(e) {}

    return this.http.post<any>(url, body, { headers })
      .pipe(
        tap(resp => { try { console.debug('OrdenesService.createOrder response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Registra un pago asociado a una orden.
   * body debe tener la forma indicada por el backend, por ejemplo:
   * { idOrden, nombreTitular, correo, numeroTarjeta, fechaCaducidad, cvv, numeroCuotas, monto, idUsuario }
   */
  registerPayment(body: any): Observable<any> {
    const url = `${baseUrl}/pagos/registrar`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    try { console.debug('OrdenesService.registerPayment -> POST', url, body); } catch(e) {}

    // Usar observe: 'response' para obtener headers/status y luego extraer body.
    return this.http.post<any>(url, body, { headers, observe: 'response' as const })
      .pipe(
        tap(resp => { try { console.debug('OrdenesService.registerPayment full response', resp); } catch(e){} }),
        map(resp => resp.body),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtener historial de compras de un cliente
   */
  getHistorialCompras(): Observable<any> {
    const url = `${baseUrl}/clientes/historial-compras`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    try { console.debug('OrdenesService.getHistorialCompras -> GET', url); } catch(e) {}

    return this.http.get<any>(url, { headers })
      .pipe(
        tap(resp => { try { console.debug('OrdenesService.getHistorialCompras response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }
}
