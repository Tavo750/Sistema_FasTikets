import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { baseUrl } from '../../global';

export interface CanjeRequest {
  idCliente: number;
  idOrdenCompra: number;
  puntosCanje: number;
  montoDescuento: number;
}

export interface CanjeResponse {
  ok: boolean;
  mensaje: string;
  data?: any;
}

export interface ReglaPuntos {
  idRegla: number;
  solesPorPunto: number;
  tipoRegla: 'CANJE' | 'COMPRA' | string;
  activo: boolean;
  estado: string;
}

export interface ReglasPuntosResponse {
  ok: boolean;
  mensaje: string;
  data: ReglaPuntos[];
}

@Injectable({
  providedIn: 'root'
})
export class CanjePuntosService {
  private readonly apiUrl = `${baseUrl}/cliente/fidelizacion/canje`;
  private readonly reglasUrl = `${baseUrl}/admin/fidelizacion/reglas-puntos`;
  
  // Subject para almacenar la tasa de conversión actual (cuántos soles por punto)
  private solesPorPuntoSubject = new BehaviorSubject<number>(1); // Valor por defecto: 1 sol = 1 punto
  public solesPorPunto$ = this.solesPorPuntoSubject.asObservable();
  
  // Límite máximo de puntos que se pueden canjear por compra
  private maxPuntosCanje: number = 1000; // Valor por defecto

  constructor(private http: HttpClient) {
    this.cargarReglaPuntos();
    this.cargarLimiteMaximoPuntos();
  }

  /**
   * Carga el límite máximo de puntos desde localStorage o configuración
   */
  private cargarLimiteMaximoPuntos(): void {
    const maxPuntos = localStorage.getItem('max_puntos_canje');
    if (maxPuntos) {
      this.maxPuntosCanje = parseInt(maxPuntos, 10);
      console.log('Límite máximo de puntos cargado:', this.maxPuntosCanje);
    } else {
      console.log('Usando límite por defecto:', this.maxPuntosCanje);
    }
  }

  /**
   * Obtiene el límite máximo de puntos que se pueden canjear
   */
  public getMaxPuntosCanje(): number {
    return this.maxPuntosCanje;
  }

  /**
   * Recarga el límite máximo de puntos (útil después de cambios en configuración)
   */
  public recargarLimiteMaximoPuntos(): void {
    this.cargarLimiteMaximoPuntos();
  }

  /**
   * Carga la regla de puntos activa para canje desde el backend
   */
  private cargarReglaPuntos(): void {
    this.http.get<ReglasPuntosResponse>(this.reglasUrl).pipe(
      tap(response => {
        if (response.ok && response.data) {
          // Buscar la regla activa de tipo CANJE
          const reglaCanje = response.data.find(
            regla => regla.tipoRegla === 'CANJE' && regla.activo
          );
          
          if (reglaCanje) {
            this.solesPorPuntoSubject.next(reglaCanje.solesPorPunto);
            console.log('Regla de puntos cargada:', reglaCanje.solesPorPunto, 'soles por punto');
          } else {
            console.warn('No se encontró regla de canje activa, usando valor por defecto: 1 sol por punto');
          }
        }
      }),
      catchError(error => {
        console.error('Error al cargar reglas de puntos:', error);
        console.warn('Usando valor por defecto: 1 sol por punto');
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Recarga las reglas de puntos (útil después de cambios en configuración)
   */
  public recargarReglasPuntos(): void {
    this.cargarReglaPuntos();
  }

  /**
   * Obtiene el valor actual de soles por punto
   */
  public getSolesPorPunto(): number {
    return this.solesPorPuntoSubject.value;
  }

  /**
   * Realiza el canje de puntos del cliente
   * @param request Datos del canje (idCliente, idOrdenCompra, puntosCanje, montoDescuento)
   * @returns Observable con la respuesta del backend
   */
  realizarCanje(request: CanjeRequest): Observable<CanjeResponse> {
    return this.http.post<CanjeResponse>(this.apiUrl, request);
  }

  /**
   * Calcula el monto de descuento basado en los puntos a canjear
   * Usa la regla de conversión configurada en el sistema
   * @param puntos Cantidad de puntos a canjear
   * @returns Monto de descuento en soles
   */
  calcularMontoDescuento(puntos: number): number {
    const solesPorPunto = this.getSolesPorPunto();
    return puntos * solesPorPunto;
  }

  /**
   * Calcula cuántos puntos se necesitan para un descuento específico
   * @param montoSoles Monto en soles que se desea descontar
   * @returns Cantidad de puntos necesarios
   */
  calcularPuntosNecesarios(montoSoles: number): number {
    const solesPorPunto = this.getSolesPorPunto();
    return Math.ceil(montoSoles / solesPorPunto);
  }

  /**
   * Valida que los puntos a canjear sean válidos
   * @param puntosACanjear Puntos que el usuario quiere canjear
   * @param puntosDisponibles Puntos disponibles del cliente
   * @param montoTotal Monto total de la compra
   * @returns Mensaje de error o null si es válido
   */
  validarCanje(puntosACanjear: number, puntosDisponibles: number, montoTotal: number): string | null {
    if (puntosACanjear <= 0) {
      return 'Debes canjear al menos 1 punto';
    }

    if (puntosACanjear > this.maxPuntosCanje) {
      return `No puedes canjear más de ${this.maxPuntosCanje} puntos por compra`;
    }

    if (puntosACanjear > puntosDisponibles) {
      return `No tienes suficientes puntos. Disponibles: ${puntosDisponibles}`;
    }

    const descuento = this.calcularMontoDescuento(puntosACanjear);
    if (descuento > montoTotal) {
      return `El descuento (S/${descuento.toFixed(2)}) no puede ser mayor al total (S/${montoTotal.toFixed(2)})`;
    }

    return null; // Válido
  }

  /**
   * Formatea el texto de conversión para mostrar al usuario
   * @returns Texto descriptivo de la conversión (ej: "1 punto = S/ 1.00")
   */
  getTextoConversion(): string {
    const solesPorPunto = this.getSolesPorPunto();
    return `1 punto = S/ ${solesPorPunto.toFixed(2)}`;
  }
}
