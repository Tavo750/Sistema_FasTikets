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

  

  // URL fija del endpoint de configuración para el tiempo de reserva del carrito
  // Cambiado para usar el nombre real del endpoint: TIEMPO_CARRO_MINUTOS
  private readonly CONFIG_URL = `${baseUrl}/configuracion/TIEMPO_CARRO_MINUTOS`;
  // Promesa que se resuelve cuando la carga inicial (petición remota) termina
  private initialLoadPromise: Promise<void> | null = null;
  private resolveInitialLoad: (() => void) | null = null;
  // Mecanismo para evitar múltiples peticiones concurrentes: si ya hay una carga
  // en curso, reutilizamos la promesa.
  private loadInProgress: boolean = false;
  private loaderPromise: Promise<void> | null = null;
  private loaderResolve: (() => void) | null = null;

  /**
   * Crea el servicio e intenta cargar la configuración remota si está disponible
   */
  constructor(private http: HttpClient) {
    // No cargar/guardar el tiempo límite ni la marca de inicio en localStorage.
    // El valor remoto (si existe) se aplicará cuando llegue la respuesta.

    this.initialLoadPromise = null; // se asignará cuando lancemos la primera carga
    // Intentar obtener valor remoto y aplicar si es válido (se reutiliza cualquier
    // carga en curso y se guarda la promesa inicial para consumidores que esperen)
    this.loadTimeLimitFromEndpoint();
  }

  /**
   * Consulta el endpoint de configuración y si devuelve un valor entero válido
   * lo aplica como tiempo límite en minutos.
   */
  private loadTimeLimitFromEndpoint(): Promise<void> | null {
    // Si ya hay una carga en curso, devolver su promesa para evitar duplicados
    if (this.loadInProgress && this.loaderPromise) {
      return this.loaderPromise;
    }

    this.loadInProgress = true;
    this.loaderPromise = new Promise<void>((resolve) => { this.loaderResolve = resolve; });
    // Si la promesa inicial no existe (primera carga), enlazarla a la loaderPromise
    if (!this.initialLoadPromise) {
      this.initialLoadPromise = this.loaderPromise;
    }

    try {
      console.debug('CartTimerService.loadTimeLimitFromEndpoint -> GET', this.CONFIG_URL);
      this.http.get<any>(this.CONFIG_URL).subscribe({
        next: (resp) => {
          try {
            const value = resp?.data?.value ?? resp?.value ?? resp ?? null;
            const parsed = value !== null && value !== undefined ? parseFloat(String(value)) : NaN;
            const minutes = !isNaN(parsed) ? Math.round(parsed) : NaN;
            if (!isNaN(minutes) && minutes >= 1 && minutes <= 120) {
              this.setTimeLimitMinutes(minutes);
            } else {
              console.info('CartTimerService: valor de tiempo remoto no válido, se mantiene el valor actual', value);
            }
          } catch (e) {
            console.warn('Error procesando respuesta de configuración de tiempo', e);
          }
          // resolver la promesa de carga
          try { if (this.loaderResolve) { this.loaderResolve(); this.loaderResolve = null; } } catch(_) {}
          this.loadInProgress = false;
          this.loaderPromise = null;
        },
        error: (err) => {
          console.warn('No se pudo obtener configuración remota de tiempo de carrito, se mantiene valor actual', err);
          try { if (this.loaderResolve) { this.loaderResolve(); this.loaderResolve = null; } } catch(_) {}
          this.loadInProgress = false;
          this.loaderPromise = null;
        }
      });
    } catch (e) {
      console.warn('Error iniciando petición de configuración remota', e);
      try { if (this.loaderResolve) { this.loaderResolve(); this.loaderResolve = null; } } catch(_) {}
      this.loadInProgress = false;
      this.loaderPromise = null;
    }

    return this.loaderPromise;
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
    
    // Actualizar el valor interno (no persistimos en localStorage)
    this.CART_TIMER_MS = minutes * 60 * 1000;
    this.timeLimitSubject.next(minutes);
    try { console.debug('CartTimerService.setTimeLimitMinutes -> applied minutes', minutes, 'CART_TIMER_MS', this.CART_TIMER_MS); } catch (_) {}
    return true;
  }

  async startIfNotStarted(userId?: number | string, forceRestart: boolean = false): Promise<void> {
    const key = userId ? `cart_timer_start_${userId}` : 'cart_timer_start_guest';
    this.storageKey = key;
    try { console.debug('CartTimerService.startIfNotStarted -> called', { userId, storageKey: key, CART_TIMER_MS: this.CART_TIMER_MS, timeLimitSubject: this.timeLimitSubject.value, forceRestart }); } catch(_) {}
    try {
      // If the timer is already running and we're not explicitly forcing a restart,
      // do nothing. This prevents accidental resets (for example when the page
      // visibility changes and components re-subscribe). Consumers that want to
      // restart the timer after an explicit action (adding an item) should pass
      // `forceRestart = true`.
      if (this.runningSubject.value === true && !forceRestart) {
        try { console.debug('CartTimerService.startIfNotStarted -> timer already running, skipping start'); } catch(_) {}
        return;
      }
      // Solicitar la configuración más reciente (evitar duplicados internamente).
      // De esta forma no quedamos “pegados” con la primera lectura y podremos
      // refrescar el valor cada vez que se intente iniciar el temporizador.
      try { this.loadTimeLimitFromEndpoint(); } catch (_) {}
      try { if (this.loaderPromise) await this.loaderPromise; } catch(_) {}
      // Si no se obtuvo un tiempo límite válido desde el endpoint, intentar usar el valor
      // que pudo haberse colocado en timeLimitSubject. Si sigue sin haber un valor válido,
      // NO iniciar el temporizador: requerimos un valor explícito desde el endpoint.
      if (!this.CART_TIMER_MS || this.CART_TIMER_MS <= 0) {
        const tl = this.timeLimitSubject.value;
        if (tl && tl > 0) {
          this.CART_TIMER_MS = tl * 60 * 1000;
        } else {
          console.info('CartTimerService.startIfNotStarted: no hay tiempo límite válido remoto o en memoria; no se iniciará el temporizador');
          return;
        }
      }

      // Iniciar el temporizador en memoria ahora que tenemos un valor válido
      const now = Date.now();
      this.startFromTimestamp(now);
    } catch (e) {
      // No iniciar el temporizador en caso de error al intentar cargar la configuración.
      console.error('CartTimerService.startIfNotStarted -> error al intentar iniciar temporizador', e);
      return;
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
   * Resetea el tiempo límite a 0 (sin valor). El temporizador no se iniciará
   * hasta que se establezca un valor válido proveniente del endpoint de configuración.
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
