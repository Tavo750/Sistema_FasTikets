// src/app/core/services/request-handler.service.ts

import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { finalize, catchError, Observable, throwError } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class RequestHandlerService {

  constructor(
    private loading: LoadingService,
    private message: MessageService
  ) { }

  handle<T>(obs$: Observable<T>): Observable<T> {
    this.loading.show();

    return obs$.pipe(
      finalize(() => this.loading.hide()),
      catchError((error) => {
        const message = error?.message || 'Ocurrió un error inesperado';
        this.message.add({ severity: 'error', summary: 'Error', detail: message });
        return throwError(() => error);
      })
    );
  }

   /**
   * Muestra un mensaje de éxito
   */
  showSuccess(message: string, summary: string = 'Éxito'): void {
    this.message.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000
    });
  }

  /**
   * Muestra un mensaje de información
   */
  showInfo(message: string, summary: string = 'Información'): void {
    this.message.add({
      severity: 'info',
      summary,
      detail: message,
      life: 3000
    });
  }

  /**
   * Muestra un mensaje de advertencia
   */
  showWarning(message: string, summary: string = 'Advertencia'): void {
    this.message.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 4000
    });
  }
}
