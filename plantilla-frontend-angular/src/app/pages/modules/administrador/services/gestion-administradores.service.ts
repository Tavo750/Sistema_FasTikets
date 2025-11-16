import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { 
  AdministradorPorIdResponse, 
  ListarAdministradoresResponse, 
  ModificarAdministradorRequest, 
  ModificarAdministradorResponse,
  DesactivarAdministradorResponse 
} from '../interfaces/gestion-administradores/gestion-admi.interface';
import { baseUrl } from '../../../../global';

@Injectable({
  providedIn: 'root'
})
export class GestionAdministradoresService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }



  /**
   * Listar todos los administradores
   * GET /api/v1/administrador/listar
   */
  listarAdministradores(): Observable<ListarAdministradoresResponse> {
    const url = `${baseUrl}/administrador/listar`;
    return this.http.get<ListarAdministradoresResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  
  /**
   * Desactivar administrador
   * PUT /api/v1/administrador/desactivar/{id}
   */
  desactivarAdministrador(id: number): Observable<DesactivarAdministradorResponse> {
    const url = `${baseUrl}/administrador/desactivar/${id}`;
    return this.http.put<DesactivarAdministradorResponse>(url, {})
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
}
