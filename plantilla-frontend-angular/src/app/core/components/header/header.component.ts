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
import { FavoritosStateService } from '../../../shared/services/favoritos-state.service';
import { Datum } from '../../interfaces/favoritos.interface';
import { EventoService } from '../../../pages/modules/administrador/services/evento.service';
import { Data as EventoData } from '../../../pages/modules/administrador/interfaces/gestion-evento/evento.interface';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Content, NotificacionesResponse } from '../../interfaces/notificaciones.interface';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  currentLabel: string = '';
  breadcrumbDisplay = '';
  breadcrumbFull = '';
  items: MenuItem[] | undefined;
  itemsAdmin: MenuItem[] | undefined;
  searchTerm: string = '';
  notificationCount: number = 0; // Contador de notificaciones
  cartItemCount: number = 0; // Contador de items del carrito
  @Input() usuario: Data | null = null; // Usuario actual, puede ser nulo si no hay sesión activa

  // Variables para favoritos
  mostrarDialogoFavoritos: boolean = false;
  eventosFavoritos: Datum[] = [];
  contadorFavoritos: number = 0;
  cargandoFavoritos: boolean = false;

  // Variables para notificaciones
  mostrarDialogoNotificaciones: boolean = false;
  notificaciones: Content[] = [];
  cargandoNotificaciones: boolean = false;
  notificacionesNoLeidas: number = 0;

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
  private favoritosSubscription!: Subscription;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private sessionService: SessionService,
    private loginService: LoginService,
    private cartService: CartService,
    private favoritosService: FavoritosService,
    private favoritosStateService: FavoritosStateService,
    private messageService: MessageService,
    private eventoService: EventoService,
    private notificacionesService: NotificacionesService
  ) {
    this.actualizarMenuItems();
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('mobile-menu-open');
    }
  }

  private toggleBodyScroll(): void {
    if (typeof document !== 'undefined') {
      if (this.mobileMenuOpen) {
        document.body.classList.add('mobile-menu-open');
      } else {
        document.body.classList.remove('mobile-menu-open');
      }
    }
  }

  onMenuClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('header-actions')) {
      this.closeMobileMenu();
    }
  }

  private actualizarMenuItems(): void {
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

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const newUrl = event.urlAfterRedirects;
        this.findLabelForUrl(newUrl);
        this.closeMobileMenu();
      });

    this.userSubscription = this.sessionService.user$.subscribe((user: Data | null) => {
      if (!this.usuario) {
        this.usuario = user;
      }
      if (!this.usuario) {
        this.eventosFavoritos = [];
        this.contadorFavoritos = 0;
      }
    });

    this.cartSubscription = this.cartService.getCartItems$().subscribe(items => {
      this.cartItemCount = this.cartService.getTotalItems();
    });

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filtrarEventos(searchTerm);
      });

    this.cargarEventos();

    // Cargar notificaciones si hay usuario autenticado
    if (this.usuario) {
      this.cargarNotificaciones();
    }
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
    if (this.favoritosSubscription) {
      this.favoritosSubscription.unsubscribe();
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

  cerrarSesion(): void {
    this.loginService.logout();
    this.usuario = null;
    this.router.navigate(['/login']);
  }

  abrirFavoritos(): void {
    if (!this.usuario) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Debes iniciar sesión para ver tus favoritos',
        life: 1000
      });
      return;
    }

    this.mostrarDialogoFavoritos = true;
    this.cargarFavoritos(true);
    this.closeMobileMenu();
  }

  cargarFavoritos(mostrarLoading: boolean = false): void {
    if (mostrarLoading) {
      this.cargandoFavoritos = true;
    }
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
          life: 1000
        });
      }
    });
  }

  eliminarDeFavoritos(eventoId: number): void {
    this.favoritosStateService.quitarFavorito(eventoId).subscribe({
      next: (exito) => {
        if (exito) {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Evento eliminado de favoritos',
            life: 1000
          });
          // Recargar la lista de favoritos para el diálogo
          this.cargarFavoritos(true);
        }
      },
      error: (error) => {
        console.error('Error al eliminar de favoritos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.mensaje || 'No se pudo eliminar el evento de favoritos',
          life: 1000
        });
      }
    });
  }

  verDetalleEvento(eventoId: number): void {
    this.mostrarDialogoFavoritos = false;
    this.router.navigate(['/home/evento', eventoId]);
  }

  formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
    this.showSearchDropdown = this.searchTerm.length > 0;
  }

  onSearchEnter(): void {
    this.showSearchDropdown = false;
    if (this.eventosFiltrados.length > 0) {
      this.seleccionarEvento(this.eventosFiltrados[0]);
    }
  }

  cargarEventos(): void {
    this.cargandoEventos = true;
    this.eventoService.getListarEventos().subscribe({
      next: (response) => {
        this.cargandoEventos = false;
        if (response.ok && response.data) {
          if (Array.isArray(response.data)) {
            this.todosLosEventos = response.data.filter(evento =>
              evento.estadoEvento === 'PUBLICADO'
            );
          } else {
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
    ).slice(0, 5);
  }

  seleccionarEvento(evento: EventoData): void {
    this.showSearchDropdown = false;
    this.searchTerm = '';
    this.router.navigate(['/home/evento', evento.idEvento]);
  }

  cerrarDropdown(): void {
    setTimeout(() => {
      this.showSearchDropdown = false;
    }, 200);
  }

  formatearFechaCorta(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  resaltarTexto(texto: string): string {
    if (!this.searchTerm) return texto;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return texto.replace(regex, '<strong>$1</strong>');
  }

  /**
   * Abre el diálogo de notificaciones y carga la lista
   */
  abrirNotificaciones(): void {
    if (!this.usuario) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debes iniciar sesión para ver tus notificaciones',
        life: 3000
      });
      return;
    }

    this.mostrarDialogoNotificaciones = true;
    this.cargarNotificaciones();
    this.closeMobileMenu();
  }

  /**
   * Carga la lista de notificaciones del usuario
   */
  cargarNotificaciones(): void {
    this.cargandoNotificaciones = true;
    this.notificacionesService.GetListaNotificaciones().subscribe({
      next: (response: NotificacionesResponse) => {
        if (response.ok && response.data) {
          this.notificaciones = response.data.content;
          this.notificacionesNoLeidas = this.notificaciones.filter(n => !n.leida).length;
          this.notificationCount = this.notificacionesNoLeidas;
        }
        this.cargandoNotificaciones = false;
      },
      error: (error: any) => {
        console.error('Error al cargar notificaciones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las notificaciones',
          life: 3000
        });
        this.cargandoNotificaciones = false;
      }
    });
  }

  /**
   * Formatea la fecha de la notificación para mostrarla de forma relativa
   */
  formatearFechaNotificacion(fecha: Date): string {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diff = ahora.getTime() - fechaNotif.getTime();

    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;

    return fechaNotif.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: fechaNotif.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
    });
  }

  /**
   * Obtiene el ícono según el tipo de notificación
   */
  obtenerIconoNotificacion(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'INFO': 'pi-info-circle',
      'EXITO': 'pi-check-circle',
      'ADVERTENCIA': 'pi-exclamation-triangle',
      'ERROR': 'pi-times-circle',
      'PROMOCION': 'pi-tag',
      'EVENTO': 'pi-calendar',
      'SISTEMA': 'pi-cog'
    };
    return iconos[tipo] || 'pi-bell';
  }

  /**
   * Obtiene la severidad según el tipo de notificación
   */
  obtenerSeveridadNotificacion(tipo: string): string {
    const severidades: { [key: string]: string } = {
      'INFO': 'info',
      'EXITO': 'success',
      'ADVERTENCIA': 'warn',
      'ERROR': 'danger',
      'PROMOCION': 'secondary',
      'EVENTO': 'info',
      'SISTEMA': 'contrast'
    };
    return severidades[tipo] || 'info';
  }

}
