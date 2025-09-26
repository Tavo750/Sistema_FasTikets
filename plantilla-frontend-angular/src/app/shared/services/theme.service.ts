import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.applyTheme(this.getStoredTheme());
  }

  private getStoredTheme(): string {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) {
      return temaGuardado;
    }
    // Si no hay tema almacenado, usa el sistema (claro si el sistema está en claro, oscuro si está en oscuro)
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  public setTheme(tema: string): void {
    if (tema !== this.themeSubject.value) {
      localStorage.setItem('tema', tema);
      this.themeSubject.next(tema);
      this.applyTheme(tema);
    }
  }

  private applyTheme(tema: string): void {
    const htmlElement = document.querySelector('html');
    if (!htmlElement) {
      return;
    }

    const darkClass = 'my-app-dark';
    const hasDarkClass = htmlElement.classList.contains(darkClass);

    if (tema === 'dark' && !hasDarkClass) {
      htmlElement.classList.add(darkClass);
    } else if (tema === 'light' && hasDarkClass) {
      htmlElement.classList.remove(darkClass);
    }
  }
}
