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
      items: [
        {
          label: 'Subopción 1',
          routerLink: ['inicio', 'inicio'],
          icon: 'pi pi-check',
          iconRef: 'iconSubopcion1',
        }
      ]
    },
    {
      label: 'Lotes Hilo',
      icon: 'pi pi-list',
      iconRef: 'iconHilo',
      items: [
        {
          label: 'Subopción 1',
          icon: 'pi pi-check',
          iconRef: 'iconSubopcion1',
          items: [
            {
              label: 'Subopción 11',
              routerLink: ['lote', 'agregar'],
              icon: 'pi pi-check',
              iconRef: 'iconSubopcion1'
            },
            {
              label: 'Subopción 12',
              routerLink: ['lote', 'eliminar'],
              icon: 'pi pi-times',
              iconRef: 'iconSubopcion2'
            }
          ]
        },
        {
          label: 'Subopción 2',
          routerLink: '/lote/subopcion2',
          icon: 'pi pi-times',
          iconRef: 'iconSubopcion2',
          items: [
            {
              label: 'Subopción 21',
              routerLink: '/lote/subopcion1',
              icon: 'pi pi-check',
              iconRef: 'iconSubopcion1'
            },
            {
              label: 'Subopción 22',
              routerLink: '/lote/subopcion2',
              icon: 'pi pi-times',
              iconRef: 'iconSubopcion2'
            }
          ]
        }
      ]
    },
    {
      label: 'Logos',
      routerLink: '/logo',
      icon: 'pi pi-image',
      iconRef: 'iconCroco',
      items: [
        {
          label: 'Subopción 21',
          routerLink: ['logo', 'inicio'],
          icon: 'pi pi-check',
          iconRef: 'iconSubopcion1'
        },
      ]
    },
    {
      label: 'Facturacion',
      icon: 'pi pi-image',
      iconRef: 'iconSubopcion1',
      items: [
        {
          label: 'Registro de factura - sub 1',
          icon: 'pi pi-check',
          iconRef: 'iconSubopcion1',
          items:[
              {
              label: 'Registro',
              routerLink: ['facturacion', 'registro'],
              icon: 'pi pi-times',
              iconRef: 'iconSubopcion1'
            },
          ]
        },
      ]
    },
    {
      label: 'Cotizacion',
      icon: 'pi pi-image',
      iconRef: 'iconSubopcion1',
      items: [
        {
          label: 'Crear Cotizacion Nueva',
          routerLink: ['cotizacion', 'crear'],
          icon: 'pi pi-check',
          iconRef: 'iconSubopcion1'
        },
        {
          label: 'Modificar Cotizacion',
          routerLink: ['cotizacion', 'modificar'],
          icon: 'pi pi-check',
          iconRef: 'iconSubopcion1'
        },
      ]
    },
  ]

  getMenuItems(): MenuItem[] {
    return this.items;
  }
}
