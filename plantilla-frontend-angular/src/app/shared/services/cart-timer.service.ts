import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfiguracionGeneralService } from '../../pages/modules/administrador/services/configuracion-general.service';

@Injectable({ providedIn: 'root' })
export class CartTimerService {
  private readonly STORAGE_KEY_TIME_LIMIT = 'cart_time_limit_minutes';
  private readonly DEFAULT_TIME_LIMIT_MINUTES = 15; // Valor por defecto
  private CART_TIMER_MS: number = 15 * 60 * 1000; // 15 minutos por defecto
  private intervalId: any = null;
  private startTs: number | null = null;
  private storageKey: string | null = null;

  private runningSubject = new BehaviorSubject<boolean>(false);
  private remainingSubject = new BehaviorSubject<number>(0);
  private displaySubject = new BehaviorSubject<string>('');
  private expiredSubject = new Subject<void>();
  // Inicialmente 15 minutos — se actualizará desde storage o desde el endpoint remoto
  private timeLimitSubject = new BehaviorSubject<number>(15); // minutos

  public running$: Observable<boolean> = this.runningSubject.asObservable();
  public remaining$: Observable<number> = this.remainingSubject.asObservable();
  public display$: Observable<string> = this.displaySubject.asObservable();
  public expired$: Observable<void> = this.expiredSubject.asObservable();
  public timeLimit$: Observable<number> = this.timeLimitSubject.asObservable();

  // Referencia al servicio de configuración (lazy loading para evitar dependencias circulares)
  private configuracionGeneralService: ConfiguracionGeneralService | null = null;
  // Promesa que se resuelve cuando la carga inicial (petición remota) termina
  private initialLoadPromise: Promise<void> | null = null;
  private resolveInitialLoad: (() => void) | null = null;
  // Indica si ya se inició la petición remota al menos una vez
  private initialLoadStarted: boolean = false;

  /**
   * Crea el servicio e intenta cargar la configuración remota si está disponible
   */
  constructor(private injector: Injector) {
    // Cargar tiempo límite desde localStorage si existe
    const savedLimit = this.loadTimeLimitFromStorage();
    if (savedLimit !== null) {
      this.setTimeLimitMinutes(savedLimit);
    }

    // Preparar promesa que indica cuando la carga inicial ha terminado
    this.initialLoadPromise = new Promise<void>((resolve) => { this.resolveInitialLoad = resolve; });

    // Intentar obtener valor remoto y aplicar si es válido
    this.loadTimeLimitFromEndpoint();

    // Escuchar cambios en localStorage para sincronizar entre pestañas/componentes
    this.setupStorageListener();
  }

  /**
   * Configura el listener de storage para detectar cambios en el tiempo límite
   */
  private setupStorageListener(): void {
    try {
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === this.STORAGE_KEY_TIME_LIMIT && event.newValue) {
          const minutes = parseInt(event.newValue, 10);
          if (!isNaN(minutes) && minutes >= 1 && minutes <= 120) {
            console.log('CartTimerService: Cambio detectado en localStorage, actualizando tiempo límite:', minutes);
            this.CART_TIMER_MS = minutes * 60 * 1000;
            this.timeLimitSubject.next(minutes);
          }
        }
      });
      
      // También escuchar custom event para cambios en la misma pestaña
      window.addEventListener('cartTimerConfigChanged', ((event: CustomEvent) => {
        const minutes = event.detail?.minutes;
        if (minutes && !isNaN(minutes) && minutes >= 1 && minutes <= 120) {
          console.log('CartTimerService: Cambio detectado vía custom event, actualizando tiempo límite:', minutes);
          this.CART_TIMER_MS = minutes * 60 * 1000;
          this.timeLimitSubject.next(minutes);
        }
      }) as EventListener);
    } catch (e) {
      console.warn('No se pudo configurar storage listener', e);
    }
  }

  /**
   * Consulta el servicio de configuración y si devuelve un valor entero válido
   * lo aplica como tiempo límite en minutos.
   */
  private loadTimeLimitFromEndpoint(): void {
    try {
      // Lazy loading del servicio para evitar dependencias circulares
      if (!this.configuracionGeneralService) {
        this.configuracionGeneralService = this.injector.get(ConfiguracionGeneralService);
      }
      
      console.debug('CartTimerService: Cargando tiempo límite desde ConfiguracionGeneralService');
      this.initialLoadStarted = true;
      
      // Usar timeout para resolver la promesa inicial incluso si el servicio tarda
      const timeoutId = setTimeout(() => {
        console.info('CartTimerService: Timeout esperando configuración, usando valor por defecto');
        try { if (this.resolveInitialLoad) { this.resolveInitialLoad(); this.resolveInitialLoad = null; } } catch(_) {}
      }, 5000); // 5 segundos de timeout
      
      this.configuracionGeneralService.getConfiguracionPorKey('TIEMPO_CARRO_MINUTOS').subscribe({
        next: (resp) => {
          clearTimeout(timeoutId);
          try {
            if (resp.ok && resp.data) {
              const value = resp.data.value;
              // Aceptar formatos como "15", "15.0", "15.00"
              const parsed = value !== null && value !== undefined ? parseFloat(String(value)) : NaN;
              const minutes = !isNaN(parsed) ? Math.round(parsed) : NaN;
              if (!isNaN(minutes) && minutes >= 1 && minutes <= 120) {
                // Aplicar nuevo tiempo límite
                this.setTimeLimitMinutes(minutes);
                console.log('CartTimerService: Tiempo límite cargado desde backend:', minutes, 'minutos');
              } else {
                // no válido: mantener valor por defecto
                console.info('CartTimerService: valor de tiempo remoto no válido, usando valor por defecto:', this.DEFAULT_TIME_LIMIT_MINUTES, 'minutos');
              }
            } else {
              console.warn('CartTimerService: No se encontró configuración TIEMPO_CARRO_MINUTOS, usando valor por defecto:', this.DEFAULT_TIME_LIMIT_MINUTES, 'minutos');
            }
          } catch (e) {
            console.warn('Error procesando respuesta de configuración de tiempo', e);
          }
          // resolver promesa inicial
          try { if (this.resolveInitialLoad) { this.resolveInitialLoad(); this.resolveInitialLoad = null; } } catch(_) {}
        },
        error: (err) => {
          clearTimeout(timeoutId);
          // No bloquear si falla la petición; se sigue con el valor por defecto
          console.warn('No se pudo obtener configuración remota de tiempo de carrito (puede que no exista en BD), usando valor por defecto:', this.DEFAULT_TIME_LIMIT_MINUTES, 'minutos', err);
          // resolver promesa inicial para que no se quede esperando
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
      try { console.debug('CartTimerService.setTimeLimitMinutes -> applied minutes', minutes, 'CART_TIMER_MS', this.CART_TIMER_MS); } catch (_) {}
      
      // Emitir evento custom para notificar a otros componentes en la misma pestaña
      try {
        const event = new CustomEvent('cartTimerConfigChanged', { detail: { minutes } });
        window.dispatchEvent(event);
      } catch (e) {
        console.warn('No se pudo emitir evento de cambio de configuración', e);
      }
      
      return true;
    } catch (e) {
      console.error('Error guardando tiempo límite del carrito', e);
      return false;
    }
  }

  /**
   * Recarga la configuración desde el endpoint (útil para sincronizar después de cambios)
   */
  reloadConfiguration(): void {
    console.log('CartTimerService: Recargando configuración desde backend');
    this.loadTimeLimitFromEndpoint();
  }

  async startIfNotStarted(userId?: number | string): Promise<void> {
    const key = userId ? `cart_timer_start_${userId}` : 'cart_timer_start_guest';
    this.storageKey = key;
    try { console.debug('CartTimerService.startIfNotStarted -> called', { userId, storageKey: key, CART_TIMER_MS: this.CART_TIMER_MS, timeLimitSubject: this.timeLimitSubject.value, initialLoadStarted: this.initialLoadStarted }); } catch(_) {}
    try {
      // Esperar la carga inicial (si está en progreso)
      // Si no se ha iniciado la petición aún, intentar iniciarla ahora
      try { if (!this.initialLoadStarted) this.loadTimeLimitFromEndpoint(); } catch(_) {}
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
