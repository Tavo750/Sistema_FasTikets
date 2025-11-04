import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Data } from '../../interfaces/login.interface';
import { SessionService } from '../../../shared/services/session.service';
import { LoginService } from '../../services/login.service';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentLabel: string = '';
  breadcrumbDisplay = '';     // Para la vista
  breadcrumbFull = '';        // Para el tooltip completo
  items: MenuItem[] | undefined;
  itemsAdmin: MenuItem[] | undefined;
  searchTerm: string = '';
  notificationCount: number = 5; // Ejemplo
  cartItemCount: number = 0; // Contador de items del carrito
  @Input() usuario: Data | null = null; // Usuario actual, puede ser nulo si no hay sesión activa

  /**
   * Getter que retorna los items del menú según el rol del usuario
   */
  get menuItems(): MenuItem[] | undefined {
    if (!this.usuario) {
      return undefined;
    }
    return this.usuario.rol === 'ADMINISTRADOR' ? this.itemsAdmin : this.items;
  }

  private routerSubscription!: Subscription;
  private userSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private sessionService: SessionService,
    private loginService: LoginService,
    private cartService: CartService
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
            routerLink: '/administrador/perfilAdministrador',
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

    // Suscribirse a cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const newUrl = event.urlAfterRedirects;
        this.findLabelForUrl(newUrl);
        console.log('hola')
      });

    // Suscribirse a cambios del usuario autenticado
    this.userSubscription = this.sessionService.user$.subscribe((user: Data | null) => {
      // Si no hay usuario o el input usuario no está definido, usar el del SessionService
      if (!this.usuario) {
        this.usuario = user;
      }
    });

    // Suscribirse a cambios del carrito
    this.cartSubscription = this.cartService.getCartItems$().subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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
    // Limpiar ambos servicios de sesión
    this.loginService.logout(); // Este ya llama a sessionService.clearUser()
    this.usuario = null; // Limpiar el usuario del componente
    this.router.navigate(['/login']);
  }

}
