import { Component, HostListener } from '@angular/core';
import * as global from '../../../global'
import { Persona } from '../../interfaces/login.interface';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  isSidebarOpen = true; // Inicialmente abierto
  isSidebarOpenMobile = false; // Inicialmente cerrado
  isMobile = false;
  shouldShowSidebar = false; // Controla si el sidebar debe mostrarse

  usuario: Persona | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.usuario = this.authService.getDecodedToken();

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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoute(event.urlAfterRedirects);
    });
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
