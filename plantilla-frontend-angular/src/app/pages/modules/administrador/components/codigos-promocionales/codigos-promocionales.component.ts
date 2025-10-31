import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { CodigosPromocionalesService } from '../../services/codigos-promocionales.service';
import { Datum } from '../../interfaces/codigos-promocionales/lista-codigos.interface';
import { CrearCodigoPromocionalRequest } from '../../interfaces/codigos-promocionales/codigos.interface';
import { MessageService } from '../../../../../core/services/message.service';

@Component({
  selector: 'app-codigos-promocionales',
  standalone: false,
  templateUrl: './codigos-promocionales.component.html',
  styleUrls: ['./codigos-promocionales.component.css'],
  providers: [ConfirmationService]
})
export class CodigosPromocionalesComponent implements OnInit {
  filtro = '';
  codigos: Datum[] = [];

  get codigosFiltrados(): Datum[] {
    const t = this.filtro.trim().toLowerCase();
    if (!t) return this.codigos;
    return this.codigos.filter(c =>
      c.codigo.toLowerCase().includes(t) ||
      String(c.idCodigoPromocional).includes(t) ||
      c.descripcion.toLowerCase().includes(t)
    );
  }

  constructor(
    private confirm: ConfirmationService,
    private messageService: MessageService,
    private codigoPromocionalService: CodigosPromocionalesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCodigos();
  }

  getStockSeverity(stock: number): 'success' | 'warning' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }

  editarCodigo(id: number): void {
    this.router.navigate(['/administrador/codigosPromocionales/editar', id]);
  }
  confirmarEliminar(row: Datum) {
    this.confirm.confirm({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar el código <strong>${row.codigo}</strong>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.codigoPromocionalService.deleteCodigoPromocional(row.idCodigoPromocional).subscribe({
          next: (response) => {
            if (response.ok) {
              this.codigos = this.codigos.filter(c => c.idCodigoPromocional !== row.idCodigoPromocional);
              this.messageService.success(response.mensaje, 'Eliminado');
            }
          },
          error: (err) => {
            this.messageService.error('No se pudo eliminar el código promocional');
          }
        });
      }
    });
  }

  private cargarCodigos() {
    this.codigoPromocionalService.getListadoCodigosPromocionales().subscribe({
      next: (response) => {
        if (response.ok) {
          this.codigos = response.data;
        }
      },
      error: (err) => {
        this.messageService.error('No se pudieron cargar los códigos promocionales');
      }
    });
  }
}
