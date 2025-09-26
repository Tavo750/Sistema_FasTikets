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
    // Si no hay tema almacenado, usa el sistema (por ejemplo, dark o light según el match)
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'dark' : 'light';
  }

  public setTheme(tema: string): void {
    localStorage.setItem('tema', tema);
    this.themeSubject.next(tema);
    this.applyTheme(tema);
  }

  private applyTheme(tema: string): void {
    const htmlElement = document.querySelector('html');
    if (!htmlElement) {
      return;
    }
    if (tema === 'dark') {
      htmlElement.classList.add('my-app-dark');
    } else {
      htmlElement.classList.remove('my-app-dark');
    }
  }
}
