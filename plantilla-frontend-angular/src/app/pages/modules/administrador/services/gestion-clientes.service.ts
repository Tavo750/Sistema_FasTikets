import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { GestionClientesAdmiResponse } from '../interfaces/gestion-clientes/gestion-clientes.interface';
import { GestionClientesListResponse } from '../interfaces/gestion-clientes/gestion-clientes-list.interface';
import { EditarClienteBody } from '../interfaces/gestion-clientes/editar-cliente.interface';
import { EliminarClienteResponse } from '../interfaces/gestion-clientes/eliminar-cliente.interface';
import { HistorialComprasResponse } from '../interfaces/gestion-clientes/historial-compras.interface';
import { HistorialPuntosResponse } from '../interfaces/gestion-clientes/historial-puntos.interface';
import { EliminarPuntosResponse } from '../interfaces/gestion-clientes/eliminar-puntos-cliente.interace';
import { VerificarClienteResponse } from '../interfaces/gestion-clientes/verificar-cliente.interface';
import { PromoverAdminRequest, PromoverAdminResponse } from '../interfaces/gestion-clientes/promover-admin.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class GestionClientesService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService 
  ) { }

  /**
   * Obtiene los datos de un cliente por su ID
   * @param id ID del cliente a obtener
   * @returns Observable con la respuesta que contiene los datos del cliente
   */
  getListarGestionClientesPorId(id: number): Observable<GestionClientesAdmiResponse> {
    const url = `${baseUrl}/clientes/${id}/perfil`;
    return this.http.get<GestionClientesAdmiResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  eliminarPuntoPorCliente(idCliente: number, idPuntos: number): Observable<EliminarPuntosResponse> {
    const url = `${baseUrl}/admin/fidelizacion/clientes/${idCliente}/historial-puntos/${idPuntos}`;
    return this.http.delete<EliminarPuntosResponse>(url).pipe(catchError(this.httpUtils.handleError));
  }

  /**
   * Obtiene la lista de todos los clientes
   * @returns Observable con la respuesta que contiene la lista de clientes
   */
  getListarClientes(): Observable<GestionClientesListResponse> {
    const url = `${baseUrl}/clientes/listar`;
    return this.http.get<GestionClientesListResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Actualiza los datos de un cliente por su ID
   * @param id ID del cliente a actualizar
   * @param body Datos del cliente a actualizar
   * @returns Observable con la respuesta que contiene los datos actualizados del cliente
   */
  putListarClientesPorId(id: number, body: EditarClienteBody): Observable<GestionClientesAdmiResponse> {
    const url = `${baseUrl}/clientes/${id}/perfil`;
    console.log('URL de actualización:', url);
    console.log('Datos enviados:', body);
    
    return this.http.put<GestionClientesAdmiResponse>(url, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error) => {
        console.error('Error en la petición:', error);
        console.error('Estado de la respuesta:', error.status);
        console.error('Mensaje de error:', error.error);
        return this.httpUtils.handleError(error);
      })
    );
  }

  /**
   * Eliminación lógica de un cliente por su ID
   * @param id ID del cliente a eliminar (lógico)
   * @returns Observable con la respuesta del servidor
   */
  eliminarClienteLogico(id: number): Observable<EliminarClienteResponse> {
    const url = `${baseUrl}/administrador/clientes/${id}`; // Endpoint esperado para DELETE (ajustar si es otro)
    console.log('URL eliminación lógica:', url);

    return this.http.delete<EliminarClienteResponse>(url, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error) => {
        console.error('Error al eliminar cliente:', error);
        return this.httpUtils.handleError(error);
      })
    );
  }

  /**
   * Obtiene el historial de compras de un cliente por su ID
   * @param id ID del cliente
   */
  getHistorialComprasPorCliente(id: number): Observable<HistorialComprasResponse> {
    const url = `${baseUrl}/clientes/${id}/historial-compras`;
    console.log('URL historial compras:', url);
    return this.http.get<HistorialComprasResponse>(url).pipe(
      catchError((error) => {
        console.error('Error obteniendo historial de compras:', error);
        return this.httpUtils.handleError(error);
      })
    );
  }

  /**
   * Obtiene el historial de puntos de un cliente por su ID
   * @param id ID del cliente
   */
  getHistorialPuntosPorCliente(id: number): Observable<HistorialPuntosResponse> {
    // Endpoint observado en Postman: /admin/fidelizacion/clientes/{id}/historial-puntos
    const url = `${baseUrl}/admin/fidelizacion/clientes/${id}/historial-puntos`;
    console.log('URL historial puntos:', url);
    return this.http.get<HistorialPuntosResponse>(url).pipe(
      catchError((error) => {
        console.error('Error obteniendo historial de puntos:', error);
        return this.httpUtils.handleError(error);
      })
    );
  }

  /**
   * Marca un cliente como verificado por el administrador
   * @param id ID del cliente a verificar
   * @returns Observable con la respuesta que contiene los datos actualizados del cliente
   */
  verificarCliente(id: number): Observable<VerificarClienteResponse> {
    const url = `${baseUrl}/administrador/clientes/${id}/verificar`;
    console.log('URL verificar cliente:', url);
    
    return this.http.put<VerificarClienteResponse>(url, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error) => {
        console.error('Error al verificar cliente:', error);
        console.error('Estado de la respuesta:', error.status);
        console.error('Mensaje de error:', error.error);
        return this.httpUtils.handleError(error);
      })
    );
  }

  /**
   * Promueve un cliente a administrador
   * @param id ID del cliente a promover
   * @param cargo Cargo del administrador
   * @returns Observable con la respuesta de la promoción
   */
  promoverAAdministrador(id: number, cargo: string): Observable<PromoverAdminResponse> {
    const url = `${baseUrl}/administrador/promover/${id}`;
    const body: PromoverAdminRequest = { cargo };
    console.log('URL promover a administrador:', url);
    console.log('Cargo:', cargo);
    
    return this.http.post<PromoverAdminResponse>(url, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError((error) => {
        console.error('Error al promover cliente a administrador:', error);
        console.error('Estado de la respuesta:', error.status);
        console.error('Mensaje de error:', error.error);
        return this.httpUtils.handleError(error);
      })
    );
  }
}
