import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { baseUrl } from '../../global';
import { HttpUtilsService } from './http-utils.service';
import { HttpHeaders } from '@angular/common/http';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private sessionService: SessionService
  ) {}

  /**
   * Agrega un item al carrito en el backend.
   * body: { idTipoTicket, cantidad, idCliente }
   */
  addItemToServer(idTipoTicket: number, cantidad: number, idCliente: number): Observable<any> {
    const url = `${baseUrl}/carrito/items`;
    const body = { idTipoTicket, cantidad, idCliente };

    // Obtener token (si hay) y agregar header Authorization manualmente
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Log request for debugging
    try {
      console.debug('CarritoService.addItemToServer -> POST', url, body);
    } catch (e) {}

    return this.http.post<any>(url, body, { headers })
      .pipe(
        tap(resp => { try { console.debug('CarritoService.addItemToServer response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Agrega en una sola llamada varios items al carrito en el backend.
   * body: { items: [{ idTipoTicket, cantidad }], idCliente }
   */
  addItemsToServer(items: Array<{ idTipoTicket: number; cantidad: number }>, idCliente: number): Observable<any> {
    // El endpoint real para agregar items es el mismo que para uno solo:
    // POST /api/v1/carrito/items y acepta un payload con 'items' y 'idCliente'.
    const url = `${baseUrl}/carrito/items`;
    const body = { items, idCliente };

    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      console.debug('CarritoService.addItemsToServer -> POST', url, body);
    } catch (e) {}

    return this.http.post<any>(url, body, { headers })
      .pipe(
        tap(resp => { try { console.debug('CarritoService.addItemsToServer response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Elimina un item del carrito en el backend por su id (idItemCarrito)
   */
  deleteItemOnServer(idItemCarrito: number, idCliente: number): Observable<any> {
    const url = `${baseUrl}/carrito/items/${idItemCarrito}?idCliente=${idCliente}`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    try { console.debug('CarritoService.deleteItemOnServer -> DELETE', url); } catch(e) {}

    return this.http.delete<any>(url, { headers })
      .pipe(
        tap(resp => { try { console.debug('CarritoService.deleteItemOnServer response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene los items del carrito desde el servidor para un cliente dado
   * Endpoint: GET /carrito/items?idCliente={idCliente}
   */
  getItemsFromServer(idCliente: number): Observable<any> {
    const url = `${baseUrl}/carrito/items?idCliente=${idCliente}`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(url, { headers })
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene el carrito completo del cliente con estructura: { idCarro, items: [...] }
   * Endpoint: GET /carrito/cliente/{idCliente}
   */
  getCartByCliente(idCliente: number): Observable<any> {
    const url = `${baseUrl}/carrito/cliente/${idCliente}`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    try { console.debug('CarritoService.getCartByCliente -> GET', url); } catch(e) {}

    return this.http.get<any>(url, { headers })
      .pipe(
        tap(resp => { try { console.debug('CarritoService.getCartByCliente response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Aplica un cupón al carrito indicado por idCarrito.
   * Endpoint: POST /carrito/{idCarrito}/aplicar-cupon (body: { codigo })
   */
  applyCoupon(idCarrito: number, codigo: string): Observable<any> {
    const url = `${baseUrl}/carrito/${idCarrito}/aplicar-cupon`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    const body = { codigo };
    try { console.debug('CarritoService.applyCoupon -> POST', url, body); } catch (e) {}

    return this.http.post<any>(url, body, { headers })
      .pipe(
        tap(resp => { try { console.debug('CarritoService.applyCoupon response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene información del evento asociado al carrito
   * Endpoint: GET /carrito/{idCarrito}/evento-info
   */
  getEventoInfo(idCarrito: number): Observable<any> {
    const url = `${baseUrl}/carrito/${idCarrito}/evento-info`;
    const token = this.sessionService.getCurrentUser()?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    try { console.debug('CarritoService.getEventoInfo -> GET', url); } catch(e) {}

    return this.http.get<any>(url, { headers })
      .pipe(
        tap(resp => { try { console.debug('CarritoService.getEventoInfo response', resp); } catch(e){} }),
        catchError(this.httpUtils.handleError)
      );
  }
}
