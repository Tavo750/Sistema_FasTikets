import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as global from '../../../global'
import { Persona } from '../../interfaces/login.interface';
import { SessionService } from '../../../shared/services/session.service';
import { LoginService } from '../../services/login.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {

  isSidebarOpen = true; // Inicialmente abierto
  isSidebarOpenMobile = false; // Inicialmente cerrado
  isMobile = false;
  shouldShowSidebar = false; // Controla si el sidebar debe mostrarse

  usuario: Persona | null = null;
  private routerSubscription!: Subscription;
  private authCheckSubscription!: Subscription;

  constructor(
    private sessionService: SessionService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.usuario = this.loginService.getCurrentPersona();

    // Verificar periódicamente el estado de autenticación
    this.authCheckSubscription = interval(1000).subscribe(() => {
      const currentUser = this.loginService.getCurrentPersona();
      if (this.usuario !== currentUser) {
        this.usuario = currentUser;
      }
    });

    const windowWidth = window.innerWidth;

    if (windowWidth < 768) {
      this.isSidebarOpen = false;
      this.isSidebarOpenMobile = false;
      this.isMobile = true;
    } else {
      this.isSidebarOpen = true;
      this.isSidebarOpenMobile = false;
      this.isMobile = false;
    }

    // Verificar la ruta inicial
    this.checkRoute(this.router.url);

    // Suscribirse a cambios de ruta
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authCheckSubscription) {
      this.authCheckSubscription.unsubscribe();
    }
  }

  /**
   * Verifica si el sidebar debe mostrarse basado en la ruta actual
   */
  private checkRoute(url: string): void {
    // Mostrar sidebar en rutas de usuario y administrador
    this.shouldShowSidebar = url.includes('/usuario') || url.includes('/administrador');
  }

  toggleSidebar() {
    if (window.innerWidth < 768) {
      this.isSidebarOpenMobile = !this.isSidebarOpenMobile;
    } else {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 768) {
      this.isSidebarOpen = true; // Desktop: sidebar visible
      this.isSidebarOpenMobile = false; // Asegura que el drawer esté cerrado
      this.isMobile = false;
    } else {
      this.isSidebarOpen = false;
      this.isMobile = true;
    }
  }

}
