import { Factura } from './../interfaces/factura-registro.interface';
import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class MenuService {

  items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      iconRef: 'iconInicio',
    },
    {
      label: 'Lotes Hilo',
      icon: 'pi pi-list',
      iconRef: 'iconHilo',
    },
    {
      label: 'Logos',
      routerLink: '/logo',
      icon: 'pi pi-image',
      iconRef: 'iconCroco',
    },
    {
      label: 'Facturacion',
      icon: 'pi pi-image',
      iconRef: 'iconSubopcion1',
    },
    {
      label: 'Cotizacion',
      icon: 'pi pi-image',
      iconRef: 'iconSubopcion1',
    },
  ]

  getMenuItems(): MenuItem[] {
    return this.items;
  }
}
