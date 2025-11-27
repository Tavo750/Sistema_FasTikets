import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../../../shared/services/http-utils.service';
import { ZonaCategoriaResponse } from '../interfaces/gestion-evento/zona-categoria.interface';
import { baseUrl } from '../../../../global';
import { EliminaZonaResponse } from '../interfaces/gestion-evento/elimina-zona.interface';
import { CrearEventoResponse, CrearEventoRequest } from '../interfaces/gestion-evento/evento.interface';
import { EliminaEventoResponse } from '../interfaces/gestion-evento/elimina-evento.interface';
import { EntradaResponse, EntradaResponseArray } from '../interfaces/gestion-evento/entrada.interface';
import { EliminaEntradaResponse } from '../interfaces/gestion-evento/elimina-entrada.interface';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) { }

  /// ========================= local y asientos  ======================

  /*
    * Crea una nueva zona
    * @param body Datos de la zona a crear
    * @returns Observable con la respuesta del servidor
  */

  postCrearZona(body: { nombre: string; aforoMax: number; idEvento: number }): Observable<ZonaCategoriaResponse> {
    const url = `${baseUrl}/zonas`;
    return this.http.post<ZonaCategoriaResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   * Obtiene la lista de zonas filtradas por evento
   * @param idEvento ID del evento para filtrar las zonas
   * @returns Observable con la respuesta que contiene la lista de zonas
   */

  getListarZonas(idEvento: number): Observable<ZonaCategoriaResponse> {
    const url = `${baseUrl}/zonas?evento=${idEvento}`;
    return this.http.get<ZonaCategoriaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Actualiza una zona existente
   * @param id ID de la zona a actualizar
   * @param body Datos actualizados de la zona
   * @returns Observable con la respuesta del servidor
   */
  putActualizarZona(id: number, body: { nombre: string; aforoMax: number; idEvento: number }): Observable<ZonaCategoriaResponse> {
    const url = `${baseUrl}/zonas/${id}`;
    return this.http.put<ZonaCategoriaResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Elimina una zona por su ID
   * @param id ID de la zona a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteZona(id: number): Observable<EliminaZonaResponse> {
    const url = `${baseUrl}/zonas/${id}`;
    return this.http.delete<EliminaZonaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  // ========================= datos generales evento  ======================

  /**
   * Crea un nuevo evento
   * @param body Datos del evento a crear
   * @returns Observable con la respuesta del servidor
   */

  postCrearEvento(body: CrearEventoRequest): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos/con-imagen`;
    const formData = new FormData();

    // Agregar PRIMERO los archivos, DESPUÉS los campos de texto
    // Solo agregar imagenUrl si existe en body y es un File
    if (body.imagenUrl && body.imagenUrl instanceof File) {
      formData.append('imagenUrl', body.imagenUrl, body.imagenUrl.name);
    }

    // Solo agregar imagenZonasUrl si existe en body y es un File
    if (body.imagenZonasUrl && body.imagenZonasUrl instanceof File) {
      formData.append('imagenZonasUrl', body.imagenZonasUrl, body.imagenZonasUrl.name);
    }

    // Agregar todos los campos de texto
    formData.append('nombre', body.nombre);
    formData.append('descripcion', body.descripcion);
    formData.append('fechaEvento', body.fechaEvento);
    formData.append('fechaFinEvento', body.fechaFinEvento);
    formData.append('horaInicio', body.horaInicio);
    formData.append('horaFin', body.horaFin);
    formData.append('tipoEvento', body.tipoEvento);
    formData.append('estadoEvento', body.estadoEvento);
    formData.append('aforoDisponible', body.aforoDisponible.toString());
    formData.append('idLocal', body.idLocal.toString());

    // Agregar campos opcionales (siempre enviar, incluso si están vacíos)
    formData.append('restricciones', body.restricciones || '');
    formData.append('politicasDevolucion', body.politicasDevolucion || '');
    formData.append('menoresDeEdadPermitidos', (body.menoresDeEdadPermitidos || false).toString());

    return this.http.post<CrearEventoResponse>(url, formData)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   *  Obtiene la lista de eventos
   * @returns   Observable con la respuesta que contiene la lista de eventos
   *
   */
  getListarEventos(): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos`;
    return this.http.get<CrearEventoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Obtiene un evento por su ID
   * @param id ID del evento a obtener
   * @returns Observable con la respuesta que contiene los datos del evento
   */
  getEventoPorId(id: number): Observable<CrearEventoResponse> {
    const url = `${baseUrl}/eventos/${id}`;
    return this.http.get<CrearEventoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   *
   * @param id
   * @returns
   */

  deleteEvento(id: number): Observable<EliminaEventoResponse> {
    const url = `${baseUrl}/eventos/${id}`;
    return this.http.delete<CrearEventoResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  putActualizarEvento(id: number, body: CrearEventoRequest): Observable<CrearEventoResponse> {
    // SIEMPRE usar el endpoint con-imagen para preservar las imágenes existentes
    // Solo agregar campos de imagen al FormData si existen en el body
    const url = `${baseUrl}/eventos/${id}/con-imagen`;
    const formData = new FormData();

    // Agregar todos los campos de texto obligatorios
    formData.append('nombre', body.nombre);
    formData.append('descripcion', body.descripcion);
    formData.append('fechaEvento', body.fechaEvento);
    formData.append('fechaFinEvento', body.fechaFinEvento);
    formData.append('horaInicio', body.horaInicio);
    formData.append('horaFin', body.horaFin);
    formData.append('tipoEvento', body.tipoEvento);
    formData.append('estadoEvento', body.estadoEvento);
    formData.append('aforoDisponible', body.aforoDisponible.toString());
    formData.append('idLocal', body.idLocal.toString());

    // Agregar campos opcionales (siempre enviar, incluso si están vacíos)
    formData.append('restricciones', body.restricciones || '');
    formData.append('politicasDevolucion', body.politicasDevolucion || '');
    formData.append('menoresDeEdadPermitidos', (body.menoresDeEdadPermitidos || false).toString());

    // Solo agregar imagenUrl si existe en body y es un File
    // Si no se envía este campo, el backend DEBE mantener la imagen banner existente
    if (body.imagenUrl && body.imagenUrl instanceof File) {
      // Agregar el archivo con su nombre explícito (tercer parámetro)
      formData.append('imagenUrl', body.imagenUrl, body.imagenUrl.name);
    }

    // Solo agregar imagenZonasUrl si existe en body y es un File
    // Si no se envía este campo, el backend DEBE mantener la imagen de zonas existente
    if (body.imagenZonasUrl && body.imagenZonasUrl instanceof File) {
      // Agregar el archivo con su nombre explícito (tercer parámetro)
      formData.append('imagenZonasUrl', body.imagenZonasUrl, body.imagenZonasUrl.name);
    }

    return this.http.put<CrearEventoResponse>(url, formData)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }


// ========================= entradas ======================
  /**
   * Obtiene la lista de entradas
   * @returns Observable con la respuesta que contiene la lista de entradas
   */

  getListarEntradas(): Observable<EntradaResponse> {
    const url = `${baseUrl}/tipos-ticket`;
    return this.http.get<EntradaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  getListarEntradasID(idZona: number): Observable<EntradaResponseArray> {
    const url = `${baseUrl}/tipos-ticket?zona=${idZona}`;
    return this.http.get<EntradaResponseArray>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }
  /**
   *
   * @param body  Datos de la entrada a crear
   * @returns
   */
  postCrearEntrada(body: { nombre: string; descripcion: string; precio: number; stock: number; activo: boolean; idZona: number; limitePorPersona: number; fechaInicioVenta: string; fechaFinVenta: string }): Observable<EntradaResponse> {
    const url = `${baseUrl}/tipos-ticket`;
    return this.http.post<EntradaResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  deleteEntrada(id: number): Observable<EliminaEntradaResponse> {
    const url = `${baseUrl}/tipos-ticket/${id}`;
    return this.http.delete<EliminaEntradaResponse>(url)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  /**
   * Actualiza una entrada existente
   * @param id ID de la entrada a actualizar
   * @param body Datos actualizados de la entrada
   * @returns Observable con la respuesta del servidor
   */
  putActualizarEntrada(id: number, body: { nombre: string; descripcion: string; precio: number; stock: number; activo: boolean; idZona: number; limitePorPersona: number; fechaInicioVenta: string; fechaFinVenta: string }): Observable<EntradaResponse> {
    const url = `${baseUrl}/tipos-ticket/${id}`;
    return this.http.put<EntradaResponse>(url, body)
      .pipe(
        catchError(this.httpUtils.handleError)
      );
  }

  // ========================= reportes ======================

  /**
   * Descarga el reporte PDF de ventas de un evento específico
   * @param idEvento ID del evento para el cual se generará el reporte
   * @returns Observable con el Blob del PDF
   */
  descargarReporteVentasPDF(idEvento: number): Observable<Blob> {
    const url = `${baseUrl}/eventos/${idEvento}/reporte/ventas/pdf`;
    console.log('📝 Descargando reporte de ventas para evento ID:', idEvento);

    return this.http.get(url, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    })
    .pipe(
      catchError((error) => {
        console.error('❌ Error al descargar reporte de ventas:', error);
        return this.httpUtils.handleError(error);
      })
    );
  }

}

