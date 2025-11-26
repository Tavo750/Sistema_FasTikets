import { Injectable } from '@angular/core';
import { MessageService as PrimeMessageService } from 'primeng/api';

export interface MessageConfig {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageCount: number = 0;
  private readonly MAX_MESSAGES = 10;

  constructor(private primeMessageService: PrimeMessageService) { }

  // ==================== MÉTODOS PRINCIPALES ====================

  /**
   * Muestra un mensaje de éxito
   */
  success(message: string, summary: string = 'Éxito', life: number = 1000): void {
    this.add({
      severity: 'success',
      summary,
      detail: message,
      life
    });
  }

  /**
   * Muestra un mensaje de información
   */
  info(message: string, summary: string = 'Información', life: number = 1000): void {
    this.add({
      severity: 'info',
      summary,
      detail: message,
      life
    });
  }

  /**
   * Muestra un mensaje de advertencia
   */
  warn(message: string, summary: string = 'Advertencia', life: number = 1000): void {
    this.add({
      severity: 'warn',
      summary,
      detail: message,
      life
    });
  }

  /**
   * Muestra un mensaje de error
   */
  error(message: string, summary: string = 'Error', life: number = 5000): void {
    this.add({
      severity: 'error',
      summary,
      detail: message,
      life
    });
  }

  // ==================== MÉTODOS ESPECÍFICOS PARA COTIZACIONES ====================

  /**
   * Muestra mensaje de búsqueda exitosa
   */
  searchSuccess(message: string, life: number = 4000): void {
    this.success(message, 'Éxito', life);
  }

  /**
   * Muestra mensaje de búsqueda sin resultados
   */
  searchNoResults(message: string, life: number = 6000): void {
    this.warn(message, 'Búsqueda', life);
  }

  /**
   * Muestra mensaje de aviso del backend
   */
  backendInfo(message: string, life: number = 4000): void {
    this.info(message, 'Información', life);
  }

  /**
   * Muestra mensaje de error del backend
   */
  backendError(message: string, life: number = 6000): void {
    this.error(message, 'Error', life);
  }

  /**
   * Muestra mensaje de error de conexión
   */
  connectionError(life: number = 6000): void {
    this.error('No se pudo conectar con el servidor', 'Error de Conexión', life);
  }

  // ==================== MÉTODOS PARA ACTUALIZACIONES ====================

  /**
   * Muestra mensaje de actualización exitosa
   */
  updateSuccess(message: string, summary: string, life: number = 8000): void {
    this.success(message, summary, life);
  }

  /**
   * Muestra mensaje de actualización con advertencia
   */
  updateWarning(message: string, summary: string, life: number = 8000): void {
    this.warn(message, summary, life);
  }

  // ==================== MÉTODOS PARA RESPUESTAS DEL BACKEND ====================

  /**
   * Procesa respuesta del backend y muestra mensajes apropiados
   */
  handleBackendResponse(response: any, isUpdate: boolean = false, successSummary: string = 'Éxito'): void {
    if (response.success) {
      // Respuesta exitosa
      if (!isUpdate && response.message) {
        this.success(response.message, successSummary);
      }
      if (response.mensajeAviso) {
        this.backendInfo(response.mensajeAviso);
      }
    } else {
      // Respuesta fallida
      if (response.message) {
        this.searchNoResults(response.message);
      }
      if (response.mensajeAviso) {
        this.backendInfo(response.mensajeAviso);
      }
    }
  }

  /**
   * Procesa error HTTP y muestra mensajes apropiados
   */
  handleHttpError(error: any): void {
    const backendResponse = error?.error || error;

    if (backendResponse?.message) {
      // Mostrar mensaje del backend
      this.searchNoResults(backendResponse.message);

      // Mostrar mensaje de aviso si existe
      if (backendResponse.mensajeAviso) {
        this.backendInfo(backendResponse.mensajeAviso);
      }
    } else {
      // Error genérico
      this.connectionError();
    }
  }

  // ==================== MÉTODOS DE UTILIDAD ====================

  /**
   * Limpia todos los mensajes
   */
  clear(): void {
    this.primeMessageService.clear();
    this.messageCount = 0;
  }

  /**
   * Agrega un mensaje personalizado
   */
  add(config: MessageConfig): void {
    // Verificar límite de mensajes
    this.checkMessageLimit();

    this.primeMessageService.add(config);
    this.messageCount++;
  }

  /**
   * Agrega múltiples mensajes
   */
  addAll(configs: MessageConfig[]): void {
    this.clear(); // Limpiar antes de agregar múltiples mensajes
    this.primeMessageService.addAll(configs);
    this.messageCount = configs.length;
  }

  /**
   * Verifica y limita el número de mensajes para evitar acumulación
   */
  private checkMessageLimit(): void {
    if (this.messageCount >= this.MAX_MESSAGES) {
      this.clear();
    }
  }

  /**
   * Limita el número de mensajes para evitar acumulación
   * @deprecated Use checkMessageLimit instead
   */
  private limitMessages(maxMessages: number = 5): void {
    // Obtener mensajes actuales si es posible
    const currentMessages = (this.primeMessageService as any).messages || [];
    if (currentMessages.length >= maxMessages) {
      this.clear();
    }
  }
}
