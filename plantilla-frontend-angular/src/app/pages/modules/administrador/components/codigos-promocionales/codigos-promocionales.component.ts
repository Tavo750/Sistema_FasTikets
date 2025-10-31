import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

interface CodigoPromocional {
  idCodigoPromocional: number;
  codigo: string;
  descripcion: string;
  fechaFin: string;
  tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  stock: number;
  cantidadPorCliente: number;
}

@Component({
  selector: 'app-codigos-promocionales',
  standalone: false,
  templateUrl: './codigos-promocionales.component.html',
  styleUrls: ['./codigos-promocionales.component.css'],
  providers: [ConfirmationService]
})
export class CodigosPromocionalesComponent implements OnInit {
  filtro = '';
  codigos: CodigoPromocional[] = [
    { 
      idCodigoPromocional: 1, 
      codigo: 'PikeStereo', 
      descripcion: 'Concierto Monumental', 
      fechaFin: '2025-11-15T10:01:36.472', 
      tipo: 'MONTO_FIJO', 
      valor: 7.0, 
      stock: 0, 
      cantidadPorCliente: 3 
    },
    { 
      idCodigoPromocional: 2, 
      codigo: 'VERANO2025', 
      descripcion: 'Descuento verano', 
      fechaFin: '2025-12-31T23:59:59.000', 
      tipo: 'PORCENTAJE', 
      valor: 15, 
      stock: 100, 
      cantidadPorCliente: 1 
    },
    { 
      idCodigoPromocional: 3, 
      codigo: 'EARLY20', 
      descripcion: 'Early bird discount', 
      fechaFin: '2025-11-30T18:00:00.000', 
      tipo: 'PORCENTAJE', 
      valor: 20, 
      stock: 50, 
      cantidadPorCliente: 2 
    },
    { 
      idCodigoPromocional: 4, 
      codigo: 'BIENVENIDA10', 
      descripcion: 'Código de bienvenida', 
      fechaFin: '2026-01-01T00:00:00.000', 
      tipo: 'MONTO_FIJO', 
      valor: 10.0, 
      stock: 5, 
      cantidadPorCliente: 1 
    },
  ];

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
    private toast: MessageService
  ) {}

  ngOnInit(): void {
    // TODO: Cargar códigos desde el servicio
    // this.codigoPromocionalService.listar().subscribe({
    //   next: (response) => {
    //     if (response.ok) {
    //       this.codigos = response.data;
    //     }
    //   },
    //   error: (err) => {
    //     this.toast.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'No se pudieron cargar los códigos promocionales'
    //     });
    //   }
    // });
  }

  getStockSeverity(stock: number): 'success' | 'warning' | 'danger' {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  }

<<<<<<< HEAD
  private cargarCodigosPromocionales() {
    console.log('Iniciando carga de códigos promocionales...');

    this.codigosPromocionalesService.getListarCodigosPromocionales()
      .subscribe({
        next: (response) => {
          console.log('Respuesta recibida:', response);

          if (response && response.ok) {
            if (Array.isArray(response.data)) {
              this.codigos = response.data;
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
        }
      });
  }

=======
>>>>>>> parent of 739e4e3 (Merge branch 'feature/joharFinal' into develop)
  confirmarEliminar(row: CodigoPromocional) {
    this.confirm.confirm({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar el código <strong>${row.codigo}</strong>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // TODO: Llamar al servicio para eliminar
        // this.codigoPromocionalService.eliminar(row.idCodigoPromocional).subscribe({
        //   next: (response) => {
        //     if (response.ok) {
        //       this.codigos = this.codigos.filter(c => c.idCodigoPromocional !== row.idCodigoPromocional);
        //       this.toast.add({
        //         severity: 'success',
        //         summary: 'Eliminado',
        //         detail: response.mensaje
        //       });
        //     }
        //   },
        //   error: (err) => {
        //     this.toast.add({
        //       severity: 'error',
        //       summary: 'Error',
        //       detail: 'No se pudo eliminar el código promocional'
        //     });
        //   }
        // });

        // Simulación
        this.codigos = this.codigos.filter(c => c.idCodigoPromocional !== row.idCodigoPromocional);
        this.toast.add({
          severity: 'success', 
          summary: 'Eliminado', 
          detail: 'Código promocional eliminado exitosamente'
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
