import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

interface CodigoPromo {
  id: number;
  codigo: string;
  descripcion: string;
  fechaExpiracion: string; // dd/MM/yyyy
  tipo: 'PORCENTAJE' | 'DINERO';
  valor: number;
  segmento: 'EVENTO' | 'CLIENTE';
  elementos: string[]; // nombres de eventos o categorías/segmentos
}

@Component({
  selector: 'app-codigos-promocionales',
  standalone: false,
  templateUrl: './codigos-promocionales.component.html',
  styleUrls: ['./codigos-promocionales.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CodigosPromocionalesComponent {
  filtro = '';
  codigos: CodigoPromo[] = [
    { id: 1, codigo: 'SHAKIRACNRT', descripcion: 'Descuento promocional', fechaExpiracion: '16/09/2025', tipo:'PORCENTAJE', valor:10, segmento:'EVENTO', elementos:['Concierto Shakira'] },
    { id: 2, codigo: 'VIP2025', descripcion: 'Promo VIP', fechaExpiracion: '16/09/2025', tipo:'DINERO', valor:10, segmento:'CLIENTE', elementos:['VIP'] },
    { id: 3, codigo: 'EARLY10', descripcion: 'Early bird', fechaExpiracion: '16/09/2025', tipo:'PORCENTAJE', valor:10, segmento:'EVENTO', elementos:['Concierto Shakira','Concierto Nuevo'] },
    { id: 4, codigo: 'STUDENT', descripcion: 'Estudiante', fechaExpiracion: '16/09/2025', tipo:'PORCENTAJE', valor:10, segmento:'CLIENTE', elementos:['Estudiante'] },
  ];

  get codigosFiltrados(): CodigoPromo[] {
    const t = this.filtro.trim().toLowerCase();
    if (!t) return this.codigos;
    return this.codigos.filter(c =>
      c.codigo.toLowerCase().includes(t) || String(c.id).includes(t)
    );
  }

  constructor(private confirm: ConfirmationService, private toast: MessageService) {}

  confirmarEliminar(row: CodigoPromo) {
    this.confirm.confirm({
      header: 'Eliminar',
      message: `¿Eliminar el código ${row.codigo}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.codigos = this.codigos.filter(c => c.id !== row.id);
        this.toast.add({severity:'success', summary:'Eliminado', detail:'Registro eliminado'});
      }
    });
  }
}
