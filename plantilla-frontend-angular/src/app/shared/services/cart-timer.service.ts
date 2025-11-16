import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartTimerService {
  private readonly CART_TIMER_MS = 15 * 60 * 1000; // 15 minutos
  private intervalId: any = null;
  private startTs: number | null = null;
  private storageKey: string | null = null;

  private runningSubject = new BehaviorSubject<boolean>(false);
  private remainingSubject = new BehaviorSubject<number>(0);
  private displaySubject = new BehaviorSubject<string>('');
  private expiredSubject = new Subject<void>();

  public running$: Observable<boolean> = this.runningSubject.asObservable();
  public remaining$: Observable<number> = this.remainingSubject.asObservable();
  public display$: Observable<string> = this.displaySubject.asObservable();
  public expired$: Observable<void> = this.expiredSubject.asObservable();

  constructor() {
    // nothing to do; start is lazy when components call startIfNotStarted
  }

  startIfNotStarted(userId?: number | string): void {
    const key = userId ? `cart_timer_start_${userId}` : 'cart_timer_start_guest';
    this.storageKey = key;
    try {
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
}
