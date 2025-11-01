import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { GestionClientesAdmiResponse } from '../interfaces/gestion-clientes/gestion-clientes.interface';
import { GestionClientesListResponse } from '../interfaces/gestion-clientes/gestion-clientes-list.interface';
import { EditarClienteBody } from '../interfaces/gestion-clientes/editar-cliente.interface';
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
    return this.http.put<GestionClientesAdmiResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
}
