import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class MenuService {

  private userMenuItems: MenuItem[] = [
    {
      label: 'Perfil Personal',
      icon: 'pi pi-user',
      iconRef: 'iconInicio',
      routerLink: ['./usuario/perfilPersonal'],
    },
    {
      label: 'Mis Entradas',
      icon: 'pi pi-ticket',
      iconRef: 'iconHilo',
      routerLink: ['./usuario/misEntradas'],
    },
    {
      label: 'Mis Beneficios',
      icon: 'pi pi-star',
      iconRef: 'iconCroco',
      routerLink: ['./usuario/beneficios'],
    },
    {
      label: 'Carrito de Compras',
      icon: 'pi pi-shopping-cart',
      iconRef: 'iconCroco',
      routerLink: ['./home/carritoCompra'],
    },
    {
      label: 'Historial de Compras',
      icon: 'pi pi-history',
      iconRef: 'iconSubopcion1',
      routerLink: ['./usuario/historialCompras'],
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      iconRef: 'iconSubopcion1',
      routerLink: ['./usuario/configuracion'],
    }
  ];

  private adminMenuItems: MenuItem[] = [
    {
      label: 'Perfil Personal',
      icon: 'pi pi-user',
      iconRef: 'iconInicio',
      routerLink: ['./administrador/perfilAdministrador'],
    },
    {
      label: 'Gestión de Locales',
      icon: 'pi pi-building',
      iconRef: 'iconHilo',
      routerLink: ['./administrador/gestionLocales'],
    },
    {
      label: 'Gestión de Eventos',
      icon: 'pi pi-calendar',
      iconRef: 'iconCroco',
      routerLink: ['./administrador/gestionEventos'],
    },
    {
      label: 'Gestión de Clientes',
      icon: 'pi pi-users',
      iconRef: 'iconCroco',
      routerLink: ['./administrador/gestionClientes'],
    },
    {
      label: 'Códigos Promocionales',
      icon: 'pi pi-tag',
      iconRef: 'iconSubopcion1',
      routerLink: ['./administrador/codigosPromocionales'],
    },
    {
      label: 'Log de Errores',
      icon: 'pi pi-exclamation-triangle',
      iconRef: 'iconSubopcion1',
      routerLink: ['./administrador/logErrores'],
    },
    {
      label: 'Auditoría',
      icon: 'pi pi-eye',
      iconRef: 'iconSubopcion1',
      routerLink: ['./administrador/auditoria'],
    },
  ];

  // Por compatibilidad - devuelve todos los items
  items: MenuItem[] = [...this.userMenuItems, ...this.adminMenuItems];

  getMenuItems(): MenuItem[] {
    return this.items;
  }

  /**
   * Obtiene los items del menú para usuarios regulares
   */
  getUserMenuItems(): MenuItem[] {
    return this.userMenuItems;
  }

  /**
   * Obtiene los items del menú para administradores
   */
  getAdminMenuItems(): MenuItem[] {
    return this.adminMenuItems;
  }

  /**
   * Obtiene los items del menú según el contexto (ruta actual)
   * @param currentUrl URL actual para determinar el contexto
   */
  getMenuItemsByContext(currentUrl: string): MenuItem[] {
    if (currentUrl.includes('/usuario')) {
      return this.getUserMenuItems();
    } else if (currentUrl.includes('/administrador')) {
      return this.getAdminMenuItems();
    }
    return this.getUserMenuItems(); // Por defecto, mostrar menú de cliente
  }

  /**
   * Obtiene los items del menú según el rol del usuario
   * @param userRole Rol del usuario ('ADMINISTRADOR' o 'CLIENTE')
   */
  getMenuItemsByRole(userRole: string): MenuItem[] {
    if (userRole === 'ADMINISTRADOR') {
      return this.getAdminMenuItems();
    } else if (userRole === 'CLIENTE') {
      return this.getUserMenuItems();
    }
    return this.getUserMenuItems(); // Por defecto, mostrar menú de usuario
  }
}
