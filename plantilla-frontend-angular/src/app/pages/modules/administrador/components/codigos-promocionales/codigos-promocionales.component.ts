import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../services/codigos-promocionales.service';
import { Data as CodigoPromocional } from '../../interfaces/codigos-promocionales/codigos-promocionales.interface';

@Component({
  selector: 'app-codigos-promocionales',
  standalone: false,
  templateUrl: './codigos-promocionales.component.html',
  styleUrls: ['./codigos-promocionales.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CodigosPromocionalesComponent implements OnInit {
  searchValue = '';
  codigos: CodigoPromocional[] = [];
  loading = false;
  totalRecords = 0;

  constructor(
    private confirm: ConfirmationService,
    private toast: MessageService,
    private codigosPromocionalesService: CodigosPromocionalesService
  ) {}

  ngOnInit(): void {
    this.cargarCodigosPromocionales();
  }

  private mostrarError(mensaje: string): void {
    this.toast.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }

  getStockSeverity(stock: number): 'success' | 'warning' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }

  private cargarCodigosPromocionales() {
    console.log('Iniciando carga de códigos promocionales...');
    this.loading = true;

    this.codigosPromocionalesService.getListarCodigosPromocionales()
      .subscribe({
        next: (response) => {
          console.log('Respuesta recibida:', response);

          if (response && response.ok) {
            if (Array.isArray(response.data)) {
              this.codigos = response.data;
              this.totalRecords = response.data.length;
              console.log('Códigos cargados:', this.codigos.length);
            } else {
              console.error('Los datos no son un array:', response.data);
              this.mostrarError('Formato de datos incorrecto');
            }
          } else {
            console.error('Respuesta no exitosa:', response);
            this.mostrarError(response?.mensaje || 'No se pudieron cargar los códigos promocionales');
          }
        },
        error: (error) => {
          console.error('Error al cargar códigos:', error);
          this.mostrarError(error?.error?.mensaje || 'Error al conectar con el servidor');
        },
        complete: () => {
          console.log('Carga de códigos completada');
          this.loading = false;
        }
      });
  }

  confirmarEliminar(row: CodigoPromocional) {
    this.confirm.confirm({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar el código <strong>${row.codigo}</strong>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.codigosPromocionalesService.deleteCodigoPromocional(row.idCodigoPromocional)
          .subscribe({
            next: (response) => {
              if (response.ok) {
                this.codigos = this.codigos.filter(c => c.idCodigoPromocional !== row.idCodigoPromocional);
                this.toast.add({
                  severity: 'success',
                  summary: 'Eliminado',
                  detail: response.mensaje
                });
              }
            },
            error: (error) => {
              this.toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el código promocional'
              });
            }
          });
      }
    });
  }
}
