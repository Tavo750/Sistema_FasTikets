import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-item',
  standalone: false,
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css'
})
export class SidebarItemComponent {

  @Input() item!: MenuItem;
  @Input() depth: number = 0; // Para controlar la profundidad
  @Input() index: number = 0; // Índice del ítem en su nivel
  @Input() expanded: boolean = false;
  @Output() expandChange = new EventEmitter<{ depth: number, index: number }>(); // Evento para emitir cambios de expansión

  @Input() currentExpandedItemIndex: number[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Escuchar cambios de navegación para actualizar el estado activo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  toggleExpansion(index: number) {
    if (this.item.items && this.item.items.length > 0) {
      // Solo emitir expand/collapse si tiene hijos
      this.expandChange.emit({ depth: this.depth, index: index });
    } else if (this.item.routerLink) {
      // Navegar a la ruta
      const route = Array.isArray(this.item.routerLink) ? this.item.routerLink : [this.item.routerLink];
      this.router.navigate(route);
    }
  }


  handleExpandChange(event: { depth: number, index: number }) {
    this.expandChange.emit(event);
  }

  isExpanded(): boolean {
    return this.expanded;
  }

  isActive(): boolean {
    if (!this.item.routerLink) return false;

    let path: string;

    if (Array.isArray(this.item.routerLink)) {
      // Si es array, tomar el primer elemento (que ya debería ser la ruta completa)
      path = this.item.routerLink[0];
    } else {
      // Si es string, usar tal como está
      path = this.item.routerLink;
    }

    // Verificar si la URL actual coincide exactamente o es una sub-ruta
    const currentUrl = this.router.url;

    // Para debug - puedes remover este console.log después
    console.log('Comparing:', path, 'with current URL:', currentUrl);

    // Verificar coincidencia exacta o si es una sub-ruta
    return currentUrl === path || currentUrl.startsWith(path + '/');
  }

}
