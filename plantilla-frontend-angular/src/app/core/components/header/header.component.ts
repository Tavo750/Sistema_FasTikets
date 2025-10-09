import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Usuario, Persona } from '../../interfaces/login.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  currentLabel: string = '';
  breadcrumbDisplay = '';     // Para la vista
  breadcrumbFull = '';        // Para el tooltip completo
  items: MenuItem[] | undefined;
  itemsAdmin: MenuItem[] | undefined;
  searchTerm: string = '';
  notificationCount: number = 5; // Ejemplo
  @Input() usuario: Persona | null = null; // Usuario actual, puede ser nulo si no hay sesión activa

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService
  ) {
    // Inicializar los items del menú
    this.actualizarMenuItems();
  }

  /**
   * Navega a la ruta especificada
   * @param ruta Ruta a la que se desea navegar
   */
  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  /**
   * Actualiza los items del menú según el estado de autenticación
   */
  private actualizarMenuItems(): void {
    // Menú para usuarios con rol CLIENTE
    this.items = [
      {
        label: 'Usuario',
        items: [
          { separator: true },
          {
            label: 'Mi perfil',
            icon: 'pi pi-user',
            routerLink: '/usuario/perfilPersonal',
          },
          {
            label: 'Mis entradas',
            icon: 'pi pi-ticket',
            routerLink: '/usuario/misEntradas',
          },
          {
            label: 'Regresar a Inicio',
            icon: 'pi pi-home',
            routerLink: '/home/inicio',
          },
          { separator: true },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.cerrarSesion()
          }
        ]
      }
    ];

    // Menú para usuarios con rol ADMINISTRADOR
    this.itemsAdmin = [
      {
        label: 'Administrador',
        items: [
          { separator: true },
          {
            label: 'Mi perfil',
            icon: 'pi pi-user',
            routerLink: '/usuario/perfilPersonal',
          },
          { separator: true },
          {
            label: 'Gestión de clientes',
            icon: 'pi pi-users',
            routerLink: '/administrador/gestionClientes',
          },
          {
            label: 'Auditoría',
            icon: 'pi pi-chart-bar',
            routerLink: '/administrador/auditoria',
          },
          { separator: true },
          {
            label: 'Regresar a Inicio',
            icon: 'pi pi-home',
            routerLink: '/home/inicio',
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.cerrarSesion()
          }
        ]
      }
    ];
  }

  ngOnInit() {
    const currentUrl = this.router.url;
    this.findLabelForUrl(currentUrl);

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const newUrl = event.urlAfterRedirects;
        this.findLabelForUrl(newUrl);
        console.log('hola')
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  private findLabelForUrl(url: string) {
    const items = this.menuService.getMenuItems();
    const path = this.normalizePath(url);

    const labelPath: string[] = [];

    const findPath = (items: MenuItem[], parentLabels: string[] = []): boolean => {
      for (const item of items) {
        const fullPath = this.normalizeRouterLink(item.routerLink);
        const currentLabels = [...parentLabels, item.label ?? ''];


        if (fullPath && path.startsWith(fullPath)) {
          labelPath.splice(0, labelPath.length, ...currentLabels);
          return true;
        }

        if (item.items && findPath(item.items, currentLabels)) {
          return true;
        }
      }
      return false;
    };

    if (findPath(items)) {
      this.breadcrumbFull = labelPath.join(' > ');
      const last = labelPath[labelPath.length - 1] ?? '';
      this.breadcrumbDisplay = labelPath.length > 1 ? `... > ${last}` : last;
    } else {
      this.breadcrumbFull = '';
      this.breadcrumbDisplay = '';
    }
  }

  private normalizePath(url: string): string {
    return url.replace(/^\/+|\/+$/g, '').toLowerCase();
  }

  private normalizeRouterLink(routerLink: any): string {
    if (!routerLink) return '';
    if (typeof routerLink === 'string') return routerLink.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (Array.isArray(routerLink)) return routerLink.join('/').replace(/^\/+|\/+$/g, '').toLowerCase();
    return '';
  }

  /**
   * Cierra la sesión del usuario actual
   */
  cerrarSesion(): void {
    this.authService.removeAccessToken();
    this.router.navigate(['/login']);
  }

}
