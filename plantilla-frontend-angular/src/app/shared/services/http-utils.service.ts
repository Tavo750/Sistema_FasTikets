import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {

  handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error HTTP completo:', error);
    
    // Imprimir detalles específicos del error del endpoint
    if (error.error) {
      console.error('Mensaje del endpoint:', error.error.message || error.error.mensaje);
      console.error('Código de respuesta del endpoint:', error.error.responseCode);
      console.error('Detalles del error:', error.error);
    }
    
    console.error('Status HTTP:', error.status);
    console.error('Status Text:', error.statusText);

    // Crear un objeto de error estructurado
    const errorResponse = {
      responseCode: error.error?.responseCode || error.status?.toString() || 'Unknown',
      message: error.error?.message || error.error?.mensaje || error.message || 'Error inesperado en la solicitud',
      status: error.status,
      statusText: error.statusText,
      url: error.url
    };

    console.error('Error procesado:', errorResponse);
    
    return throwError(() => errorResponse);
  }
}
