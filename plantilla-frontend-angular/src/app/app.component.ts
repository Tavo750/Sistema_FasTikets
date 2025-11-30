import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { InactivityService } from './shared/services/inactivity.service';
import { FavoritosStateService } from './shared/services/favoritos-state.service';
import { PrimeNG } from 'primeng/config';
import * as global from './global';
import { FullscreenService } from './shared/services/fullscreen.service';
import { Subscription } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  title = global.titulo;

  currentTheme = 'light';
  isFullscreen = false;

  private themeSub!: Subscription;
  private fullscreenSub!: Subscription;

  constructor(
    private inactivityService: InactivityService,
    private primeng: PrimeNG,
    private fullscreenService: FullscreenService,
    private themeService: ThemeService,
    private favoritosStateService: FavoritosStateService // Inyectar para inicializar
  ) {
  }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.inactivityService.startWatching();
    this.themeSub = this.themeService.theme$.subscribe(tema => {
      this.currentTheme = tema;
      this.themeService.setTheme('light');
    });
    this.fullscreenSub = this.fullscreenService.isFullscreen$.subscribe(state => {
      this.isFullscreen = state;
    });
  }

  ngOnDestroy(): void {
    this.inactivityService.stopWatching();
    if (this.themeSub) { this.themeSub.unsubscribe(); }
    if (this.fullscreenSub) { this.fullscreenSub.unsubscribe(); }
  }
}
