import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

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

  constructor(private router: Router) { }

  toggleExpansion(index: number) {
    if (this.item.items && this.item.items.length > 0) {
      // Solo emitir expand/collapse si tiene hijos
      this.expandChange.emit({ depth: this.depth, index: index });
    } else if (this.item.routerLink) {
      // Solo navegar, sin modificar el estado del sidebar
      this.router.navigate(Array.isArray(this.item.routerLink) ? this.item.routerLink : [this.item.routerLink]);
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

    const path = Array.isArray(this.item.routerLink)
      ? '/' + this.item.routerLink.join('/')
      : '/' + this.item.routerLink;

    return this.router.isActive(path, true); // o `true` para exact match
  }

}
