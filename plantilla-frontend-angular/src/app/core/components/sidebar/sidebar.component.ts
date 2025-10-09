import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from '../../services/menu.service';
import { SessionService } from '../../../shared/services/session.service';
import { MenuElemento } from '../../interfaces/core.interface';
import * as global from '../../../global';
import { titulo } from '../../../global';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  titulo = global.titulo;

  @Input()
  open: boolean = true;

  menuItems: MenuItem[] = [];
  currentExpandedLevel: number = -1; // Nivel de expansión actual, por defecto ninguno
  currentExpandedItemIndex: number[] = [];

  constructor(
    private menuService: MenuService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUrl = this.router.url.split('?')[0]; // ignora query params
    this.loadMenuItems();
    this.expandMenuToMatchUrl(currentUrl);

    // Suscribirse a cambios de usuario para actualizar el menú dinámicamente
    this.sessionService.user$.subscribe((user: any) => {
      this.loadMenuItems();
      const newUrl = this.router.url.split('?')[0];
      this.expandMenuToMatchUrl(newUrl);
    });

    // Suscribirse a cambios de ruta para actualizar el menú dinámicamente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const newUrl = event.urlAfterRedirects.split('?')[0];
      this.expandMenuToMatchUrl(newUrl);
    });
  }

  /**
   * Carga los elementos del menú según el rol del usuario
   */
  private loadMenuItems() {
    const user = this.sessionService.getCurrentUser();

    if (user && user.rol) {
      // Si el usuario tiene un rol definido, usar ese rol
      this.menuItems = this.menuService.getMenuItemsByRole(user.rol);
    } else {
      // Fallback: usar la URL actual para determinar el contexto
      const currentUrl = this.router.url.split('?')[0];
      this.menuItems = this.menuService.getMenuItemsByContext(currentUrl);
    }
  }

  /**
   * Obtiene elementos del menú para administradores
   */
  getAdminMenuItems(): MenuItem[] {
    return this.menuService.getAdminMenuItems();
  }

  /**
   * Obtiene elementos del menú para usuarios
   */
  getUserMenuItems(): MenuItem[] {
    return this.menuService.getUserMenuItems();
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  isAdmin(): boolean {
    const user = this.sessionService.getCurrentUser();
    return !!(user && user.rol === 'ADMINISTRADOR');
  }

  /**
   * Verifica si el usuario actual es un usuario regular (cliente)
   */
  isUser(): boolean {
    const user = this.sessionService.getCurrentUser();
    return !!(user && user.rol === 'CLIENTE');
  }

  handleExpandChange(event: { depth: number, index: number }) {
    const { depth, index } = event;

    // Si ya está expandido, colapsamos y eliminamos todos los hijos
    if (this.currentExpandedItemIndex[depth] === index) {
      this.currentExpandedItemIndex[depth] = -1;

      // Limpiar los hijos desde el siguiente nivel
      this.currentExpandedItemIndex = this.currentExpandedItemIndex.slice(0, depth + 1);
      for (let i = depth + 1; i < 20; i++) { // hasta un nivel razonable
        this.currentExpandedItemIndex[i] = -1;
      }

    } else {
      // Expandimos el nuevo ítem y colapsamos otros en el mismo nivel
      this.currentExpandedItemIndex[depth] = index;
      // Limpiar los niveles hijos (si los había abiertos antes)
      this.currentExpandedItemIndex = this.currentExpandedItemIndex.slice(0, depth + 1);
    }

  }

  expandMenuToMatchUrl(url: string) {
    const expandedIndex: number[] = [];

    const findMatch = (items: MenuItem[], depth = 0): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Normaliza el routerLink a string de URL
        let path = '';
        if (Array.isArray(item.routerLink)) {
          path = '/' + item.routerLink.join('/');
        } else if (typeof item.routerLink === 'string') {
          path = '/' + item.routerLink;
        }

        if (path && url.startsWith(path)) {
          expandedIndex[depth] = i;
          return true;
        }

        if (item.items && findMatch(item.items, depth + 1)) {
          expandedIndex[depth] = i;
          return true;
        }
      }
      return false;
    };

    if (findMatch(this.menuItems)) {
      this.currentExpandedItemIndex = [...expandedIndex];
    }
  }

}
