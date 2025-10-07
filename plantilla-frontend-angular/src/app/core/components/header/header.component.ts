import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Usuario } from '../../interfaces/login.interface';

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
  searchTerm: string = '';
  notificationCount: number = 5; // Ejemplo
  @Input() usuario: Usuario | null = null; // Usuario actual, puede ser nulo si no hay sesión activa

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private menuService: MenuService
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
    this.items = [
      {
        label: 'usuario',
        items: [
          { separator: true },
          {
            label: 'Mi perfil',
            icon: 'pi pi-user',
            routerLink: '/usuario/perfilPersonal',
          },
          {
            label: 'Regresar a Inicio',
            icon: 'pi pi-home',
            routerLink: '/home/inicio',
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

}
