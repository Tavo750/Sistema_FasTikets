import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../global';

@Injectable({ providedIn: 'root' })
export class CartTimerService {
  private readonly STORAGE_KEY_TIME_LIMIT = 'cart_time_limit_minutes';
  private CART_TIMER_MS: number = 0;
  private intervalId: any = null;
  private startTs: number | null = null;
  private storageKey: string | null = null;

  private runningSubject = new BehaviorSubject<boolean>(false);
  private remainingSubject = new BehaviorSubject<number>(0);
  private displaySubject = new BehaviorSubject<string>('');
  private expiredSubject = new Subject<void>();
  // Inicialmente 0 — se actualizará desde storage o desde el endpoint remoto
  private timeLimitSubject = new BehaviorSubject<number>(0); // minutos

  public running$: Observable<boolean> = this.runningSubject.asObservable();
  public remaining$: Observable<number> = this.remainingSubject.asObservable();
  public display$: Observable<string> = this.displaySubject.asObservable();
  public expired$: Observable<void> = this.expiredSubject.asObservable();
  public timeLimit$: Observable<number> = this.timeLimitSubject.asObservable();

  

  // URL del endpoint de configuración (puede ajustarse según entorno)
  private readonly CONFIG_URL = `${baseUrl}/configuracion/LIMITE_PERSONAS_COMPRA`;
  // Promesa que se resuelve cuando la carga inicial (petición remota) termina
  private initialLoadPromise: Promise<void> | null = null;
  private resolveInitialLoad: (() => void) | null = null;

  /**
   * Crea el servicio e intenta cargar la configuración remota si está disponible
   */
  constructor(private http: HttpClient) {
    // Cargar tiempo límite desde localStorage si existe
    const savedLimit = this.loadTimeLimitFromStorage();
    if (savedLimit !== null) {
      this.setTimeLimitMinutes(savedLimit);
    }

    // Preparar promesa que indica cuando la carga inicial ha terminado
    this.initialLoadPromise = new Promise<void>((resolve) => { this.resolveInitialLoad = resolve; });

    // Intentar obtener valor remoto y aplicar si es válido
    this.loadTimeLimitFromEndpoint();
  }

  /**
   * Consulta el endpoint de configuración y si devuelve un valor entero válido
   * lo aplica como tiempo límite en minutos.
   */
  private loadTimeLimitFromEndpoint(): void {
    try {
      this.http.get<any>(this.CONFIG_URL).subscribe({
        next: (resp) => {
          try {
            const value = resp?.data?.value ?? resp?.value ?? null;
            const minutes = value !== null && value !== undefined ? parseInt(String(value), 10) : NaN;
            if (!isNaN(minutes) && minutes >= 1 && minutes <= 120) {
              // Aplicar nuevo tiempo límite
              this.setTimeLimitMinutes(minutes);
            } else {
              // no válido: ignorar
              // console.info('CartTimerService: valor de tiempo remoto no válido', value);
            }
          } catch (e) {
            console.warn('Error procesando respuesta de configuración de tiempo', e);
          }
          // resolver promesa inicial
          try { if (this.resolveInitialLoad) { this.resolveInitialLoad(); this.resolveInitialLoad = null; } } catch(_) {}
        },
        error: (err) => {
          // No bloquear si falla la petición; se sigue con el valor guardado o por defecto
          console.warn('No se pudo obtener configuración remota de tiempo de carrito', err);
          try { if (this.resolveInitialLoad) { this.resolveInitialLoad(); this.resolveInitialLoad = null; } } catch(_) {}
        }
      });
    } catch (e) {
      console.warn('Error iniciando petición de configuración remota', e);
      try { if (this.resolveInitialLoad) { this.resolveInitialLoad(); this.resolveInitialLoad = null; } } catch(_) {}
    }
  }

  /**
   * Carga el tiempo límite guardado en localStorage
   */
  private loadTimeLimitFromStorage(): number | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_TIME_LIMIT);
      if (saved) {
        const minutes = parseInt(saved, 10);
        if (!isNaN(minutes) && minutes >= 1 && minutes <= 120) {
          return minutes;
        }
      }
    } catch (e) {
      console.warn('Error cargando tiempo límite del carrito', e);
    }
    return null;
  }

  /**
   * Obtiene el tiempo límite actual en minutos
   */
  getTimeLimitMinutes(): number {
    return this.timeLimitSubject.value;
  }

  /**
   * Establece un nuevo tiempo límite (solo para administradores)
   * @param minutes Tiempo límite en minutos (1-120)
   */
  setTimeLimitMinutes(minutes: number): boolean {
    if (minutes < 1 || minutes > 120) {
      console.warn('El tiempo límite debe estar entre 1 y 120 minutos');
      return false;
    }
    
    try {
      // Guardar en localStorage
      localStorage.setItem(this.STORAGE_KEY_TIME_LIMIT, String(minutes));
      
      // Actualizar el valor interno
      this.CART_TIMER_MS = minutes * 60 * 1000;
      this.timeLimitSubject.next(minutes);
      
      return true;
    } catch (e) {
      console.error('Error guardando tiempo límite del carrito', e);
      return false;
    }
  }

  async startIfNotStarted(userId?: number | string): Promise<void> {
    const key = userId ? `cart_timer_start_${userId}` : 'cart_timer_start_guest';
    this.storageKey = key;
    try {
      // Esperar la carga inicial (si está en progreso)
      try { if (this.initialLoadPromise) await this.initialLoadPromise; } catch(_) {}
      // Si no se obtuvo un tiempo límite válido, no iniciar el temporizador
      if (!this.CART_TIMER_MS || this.CART_TIMER_MS <= 0) {
        console.warn('CartTimerService: no hay tiempo límite válido, no se iniciará el temporizador');
        return;
      }
      const stored = localStorage.getItem(key);
      const now = Date.now();
      let start = stored ? parseInt(stored, 10) : null;
      if (!start || isNaN(start)) {
        start = now;
        localStorage.setItem(key, String(start));
      }
      this.startFromTimestamp(start);
    } catch (e) {
      // fallback: start now
      const now = Date.now();
      try { if (this.storageKey) localStorage.setItem(this.storageKey, String(now)); } catch(_) {}
      this.startFromTimestamp(now);
    }
  }

  private startFromTimestamp(startTs: number): void {
    this.clearInterval();
    this.startTs = startTs;
    const elapsed = Date.now() - startTs;
    const remaining = this.CART_TIMER_MS - elapsed;
    if (remaining <= 0) {
      // expired immediately
      this.handleExpired();
      return;
    }
    this.runningSubject.next(true);
    this.remainingSubject.next(remaining);
    this.updateDisplay(remaining);

    this.intervalId = setInterval(() => {
      const rem = Math.max(0, (this.remainingSubject.value || 0) - 1000);
      this.remainingSubject.next(rem);
      if (rem <= 0) {
        this.handleExpired();
      } else {
        this.updateDisplay(rem);
      }
    }, 1000);
  }

  private updateDisplay(ms: number): void {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const text = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    this.displaySubject.next(text);
  }

  private handleExpired(): void {
    this.clearInterval();
    this.expiredSubject.next();
    this.runningSubject.next(false);
    this.remainingSubject.next(0);
    this.displaySubject.next('00:00');
    // cleanup storage
    try { if (this.storageKey) localStorage.removeItem(this.storageKey); } catch (e) {}
  }

  clear(): void {
    this.clearInterval();
    this.runningSubject.next(false);
    this.remainingSubject.next(0);
    this.displaySubject.next('');
    try { if (this.storageKey) localStorage.removeItem(this.storageKey); } catch (e) {}
    this.startTs = null;
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Resetea el tiempo límite al valor por defecto (15 minutos)
   */
  resetTimeLimitToDefault(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY_TIME_LIMIT);
    } catch (e) {}
    this.CART_TIMER_MS = 0;
    this.timeLimitSubject.next(0);
  }

  /** Devuelve una promesa que se resuelve cuando la carga inicial termina. */
  public whenReady(): Promise<void> | null {
    return this.initialLoadPromise;
  }
}
