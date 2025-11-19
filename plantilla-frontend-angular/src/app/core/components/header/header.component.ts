import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { Data } from '../../interfaces/login.interface';
import { SessionService } from '../../../shared/services/session.service';
import { LoginService } from '../../services/login.service';
import { CartService } from '../../../shared/services/cart.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Datum } from '../../interfaces/favoritos.interface';
import { EventoService } from '../../../pages/modules/administrador/services/evento.service';
import { Data as EventoData } from '../../../pages/modules/administrador/interfaces/gestion-evento/evento.interface';

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

  // Variables para favoritos
  mostrarDialogoFavoritos: boolean = false;
  eventosFavoritos: Datum[] = [];
  cargandoFavoritos: boolean = false;

  // Variable para menú móvil
  mobileMenuOpen: boolean = false;

  // Subject para búsqueda con debounce
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  // Variables para el dropdown de búsqueda
  showSearchDropdown: boolean = false;
  eventosFiltrados: EventoData[] = [];
  todosLosEventos: EventoData[] = [];
  cargandoEventos: boolean = false;

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
    private cartService: CartService,
    private favoritosService: FavoritosService,
    private messageService: MessageService,
    private eventoService: EventoService
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
    this.closeMobileMenu();
  }

  /**
   * Alterna el estado del menú móvil
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.toggleBodyScroll();
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('mobile-menu-open');
    }
  }

  /**
   * Controla el scroll del body cuando el menú móvil está abierto
   */
  private toggleBodyScroll(): void {
    if (typeof document !== 'undefined') {
      if (this.mobileMenuOpen) {
        document.body.classList.add('mobile-menu-open');
      } else {
        document.body.classList.remove('mobile-menu-open');
      }
    }
  }

  /**
   * Maneja el click en el menú para cerrar el overlay
   */
  onMenuClick(event: MouseEvent): void {
    // Si se hace click en el overlay (fuera del contenido), cerrar el menú
    if ((event.target as HTMLElement).classList.contains('header-actions')) {
      this.closeMobileMenu();
    }
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
        this.closeMobileMenu(); // Cerrar menú móvil al cambiar de ruta
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

    // Búsqueda desactivada
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
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

  /**
   * Abre el diálogo de favoritos y carga la lista
   */
  abrirFavoritos(): void {
    if (!this.usuario) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debes iniciar sesión para ver tus favoritos',
        life: 3000
      });
      return;
    }

    this.mostrarDialogoFavoritos = true;
    this.cargarFavoritos();
    this.closeMobileMenu();
  }

  /**
   * Carga la lista de eventos favoritos
   */
  cargarFavoritos(): void {
    this.cargandoFavoritos = true;
    this.favoritosService.GetListarEventoFavorito().subscribe({
      next: (response) => {
        this.cargandoFavoritos = false;
        if (response.ok && response.data) {
          this.eventosFavoritos = response.data;
        }
      },
      error: (error) => {
        this.cargandoFavoritos = false;
        console.error('Error al cargar favoritos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los favoritos',
          life: 3000
        });
      }
    });
  }

  /**
   * Elimina un evento de favoritos
   */
  eliminarDeFavoritos(eventoId: number): void {
    this.favoritosService.DeleteEliminaEventoFavorito(eventoId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evento eliminado de favoritos',
            life: 3000
          });
          // Recargar la lista de favoritos
          this.cargarFavoritos();
        }
      },
      error: (error) => {
        console.error('Error al eliminar de favoritos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensaje || 'No se pudo eliminar el evento de favoritos',
          life: 3000
        });
      }
    });
  }

  /**
   * Navega al detalle del evento
   */
  verDetalleEvento(eventoId: number): void {
    this.mostrarDialogoFavoritos = false;
    this.router.navigate(['/home/evento', eventoId]);
  }

  /**
   * Formatea la fecha del evento
   */
  formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  /**
   * Maneja el cambio en el término de búsqueda
   */
  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
    this.showSearchDropdown = this.searchTerm.length > 0;
  }

  /**
   * Maneja el evento de presionar Enter en el buscador
   */
  onSearchEnter(): void {
    this.showSearchDropdown = false;
    if (this.eventosFiltrados.length > 0) {
      // Navegar al primer evento encontrado
      this.seleccionarEvento(this.eventosFiltrados[0]);
    }
  }

  /**
   * Carga todos los eventos disponibles (solo publicados)
   */
  cargarEventos(): void {
    this.cargandoEventos = true;
    this.eventoService.getListarEventos().subscribe({
      next: (response) => {
        this.cargandoEventos = false;
        if (response.ok && response.data) {
          // Si response.data es un array
          if (Array.isArray(response.data)) {
            // Filtrar solo eventos publicados
            this.todosLosEventos = response.data.filter(evento => 
              evento.estadoEvento === 'PUBLICADO'
            );
          } else {
            // Si response.data es un objeto único, verificar si está publicado
            this.todosLosEventos = response.data.estadoEvento === 'PUBLICADO' ? [response.data] : [];
          }
        }
      },
      error: (error) => {
        this.cargandoEventos = false;
        console.error('Error al cargar eventos:', error);
      }
    });
  }

  /**
   * Filtra los eventos según el término de búsqueda (solo eventos publicados)
   */
  filtrarEventos(termino: string): void {
    if (!termino || termino.trim() === '') {
      this.eventosFiltrados = [];
      return;
    }

    const terminoLower = termino.toLowerCase();
    this.eventosFiltrados = this.todosLosEventos.filter(evento =>
      evento.estadoEvento === 'PUBLICADO' &&
      (
        evento.nombre.toLowerCase().includes(terminoLower) ||
        evento.descripcion.toLowerCase().includes(terminoLower) ||
        evento.tipoEvento.toLowerCase().includes(terminoLower) ||
        evento.nombreLocal.toLowerCase().includes(terminoLower)
      )
    ).slice(0, 5); // Limitar a 5 resultados
  }

  /**
   * Selecciona un evento del dropdown
   */
  seleccionarEvento(evento: EventoData): void {
    this.showSearchDropdown = false;
    this.searchTerm = '';
    this.router.navigate(['/home/evento', evento.idEvento]);
  }

  /**
   * Cierra el dropdown de búsqueda
   */
  cerrarDropdown(): void {
    setTimeout(() => {
      this.showSearchDropdown = false;
    }, 200);
  }

  /**
   * Formatea la fecha para mostrar en el dropdown
   */
  formatearFechaCorta(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  /**
   * Resalta el texto de búsqueda en el resultado
   */
  resaltarTexto(texto: string): string {
    if (!this.searchTerm) return texto;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return texto.replace(regex, '<strong>$1</strong>');
  }

}
