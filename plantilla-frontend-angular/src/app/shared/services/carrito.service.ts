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
   * Limpia completamente el carrito del servidor eliminando todos los items
   * Obtiene todos los items y los elimina uno por uno
   */
  clearCartOnServer(idCliente: number): Observable<any> {
    return new Observable(observer => {
      // Primero obtener todos los items del carrito
      this.getItemsFromServer(idCliente).subscribe({
        next: (response) => {
          console.log('🧹 Items del carrito a eliminar:', response);
          
          // Extraer array de items según la estructura de respuesta
          let items: any[] = [];
          if (Array.isArray(response)) {
            items = response;
          } else if (Array.isArray(response?.data)) {
            items = response.data;
          } else if (Array.isArray(response?.items)) {
            items = response.items;
          }

          if (items.length === 0) {
            console.log('✅ Carrito ya está vacío');
            observer.next({ success: true, message: 'Carrito ya estaba vacío' });
            observer.complete();
            return;
          }

          // Eliminar cada item individualmente
          let deletedCount = 0;
          let errorCount = 0;
          
          items.forEach((item, index) => {
            const idItemCarrito = item.idItemCarrito || item.id || item.idTipoTicket;
            
            if (idItemCarrito) {
              this.deleteItemOnServer(idItemCarrito, idCliente).subscribe({
                next: () => {
                  deletedCount++;
                  console.log(`✅ Item ${index + 1}/${items.length} eliminado`);
                  
                  // Si es el último item, completar la operación
                  if (deletedCount + errorCount === items.length) {
                    if (errorCount === 0) {
                      observer.next({ success: true, message: `Carrito limpiado: ${deletedCount} items eliminados` });
                    } else {
                      observer.next({ success: true, message: `Carrito parcialmente limpiado: ${deletedCount} items eliminados, ${errorCount} errores` });
                    }
                    observer.complete();
                  }
                },
                error: (error) => {
                  errorCount++;
                  console.warn(`⚠️ Error eliminando item ${index + 1}:`, error);
                  
                  // Si es el último item, completar la operación
                  if (deletedCount + errorCount === items.length) {
                    if (deletedCount > 0) {
                      observer.next({ success: true, message: `Carrito parcialmente limpiado: ${deletedCount} items eliminados, ${errorCount} errores` });
                    } else {
                      observer.error({ success: false, message: `Error limpiando carrito: ${errorCount} errores` });
                    }
                    observer.complete();
                  }
                }
              });
            } else {
              errorCount++;
              console.warn(`⚠️ Item ${index + 1} no tiene ID válido:`, item);
              
              // Si es el último item, completar la operación
              if (deletedCount + errorCount === items.length) {
                if (deletedCount > 0) {
                  observer.next({ success: true, message: `Carrito parcialmente limpiado: ${deletedCount} items eliminados, ${errorCount} errores` });
                } else {
                  observer.error({ success: false, message: `Error limpiando carrito: ${errorCount} errores` });
                }
                observer.complete();
              }
            }
          });
        },
        error: (error) => {
          console.error('❌ Error obteniendo items del carrito para limpiar:', error);
          observer.error(error);
        }
      });
    });
  }
}
