import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../services/codigos-promocionales.service';
import { Data as CodigoPromocional } from '../../interfaces/codigos-promocionales/codigos-promocionales.interface';
import { ReglaPuntos, CreateReglaPuntosRequest, UpdateReglaPuntosRequest } from '../../interfaces/reglas-puntos/reglas-puntos.interface';

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

  // Reglas de puntos
  mostrarDialogReglas = false;
  reglasPuntos: ReglaPuntos[] = [];
  loadingReglas = false;
  searchReglas = '';

  // Dialog edición/creación de reglas
  mostrarDialogFormRegla = false;
  formularioRegla: CreateReglaPuntosRequest = {
    solesPorPunto: 0,
    tipoRegla: 'COMPRA',
    activo: true,
    estado: 'Activo'
  };
  reglaEditando: ReglaPuntos | null = null;
  guardandoRegla = false;
  modoEdicion = false;

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

  abrirDialogReglas(): void {
    this.mostrarDialogReglas = true;
    this.cargarReglasPuntos();
  }

  private cargarReglasPuntos(): void {
    this.loadingReglas = true;
    this.codigosPromocionalesService.getReglasPuntos()
      .subscribe({
        next: (response) => {
          if (response && response.ok) {
            this.reglasPuntos = response.data || [];
          } else {
            this.mostrarError(response?.mensaje || 'No se pudieron cargar las reglas de puntos');
          }
        },
        error: (error) => {
          console.error('Error al cargar reglas de puntos:', error);
          this.mostrarError('Error al cargar las reglas de puntos');
        },
        complete: () => {
          this.loadingReglas = false;
        }
      });
  }

  getTipoReglaSeverity(tipo: string): 'success' | 'info' | 'warning' {
    switch(tipo) {
      case 'CANJE': return 'success';
      case 'COMPRA': return 'info';
      default: return 'warning';
    }
  }

  getActivoSeverity(activo: boolean): 'success' | 'danger' {
    return activo ? 'success' : 'danger';
  }

  confirmarEliminarRegla(regla: ReglaPuntos): void {
    this.confirm.confirm({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar la regla de puntos <strong>#${regla.idRegla}</strong>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.eliminarRegla(regla.idRegla);
      }
    });
  }

  private eliminarRegla(id: number): void {
    this.codigosPromocionalesService.deleteReglaPuntos(id)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.reglasPuntos = this.reglasPuntos.filter(r => r.idRegla !== id);
            this.toast.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: response.mensaje
            });
          } else {
            this.mostrarError(response.mensaje || 'No se pudo eliminar la regla');
          }
        },
        error: (error) => {
          console.error('Error al eliminar regla:', error);
          this.mostrarError('Error al eliminar la regla de puntos');
        }
      });
  }

  editarRegla(regla: ReglaPuntos): void {
    this.modoEdicion = true;
    this.reglaEditando = regla;
    this.formularioRegla = {
      solesPorPunto: regla.solesPorPunto,
      tipoRegla: regla.tipoRegla as 'CANJE' | 'COMPRA',
      activo: regla.activo,
      estado: regla.estado
    };
    this.mostrarDialogFormRegla = true;
  }

  crearNuevaRegla(): void {
    this.modoEdicion = false;
    this.reglaEditando = null;
    this.formularioRegla = {
      solesPorPunto: 0,
      tipoRegla: 'COMPRA',
      activo: true,
      estado: 'Activo'
    };
    this.mostrarDialogFormRegla = true;
  }

  guardarRegla(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardandoRegla = true;

    if (this.modoEdicion && this.reglaEditando) {
      // Actualizar regla existente
      const updateData: UpdateReglaPuntosRequest = {
        solesPorPunto: this.formularioRegla.solesPorPunto,
        tipoRegla: this.formularioRegla.tipoRegla,
        activo: this.formularioRegla.activo,
        estado: this.formularioRegla.estado
      };

      this.codigosPromocionalesService.updateReglaPuntos(this.reglaEditando.idRegla, updateData)
        .subscribe({
          next: (response) => {
            if (response.ok) {
              const index = this.reglasPuntos.findIndex(r => r.idRegla === this.reglaEditando!.idRegla);
              if (index !== -1) {
                this.reglasPuntos[index] = response.data;
              }
              this.toast.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: response.mensaje
              });
              this.cerrarDialogFormRegla();
            } else {
              this.mostrarError(response.mensaje || 'No se pudo actualizar la regla');
            }
          },
          error: (error) => {
            console.error('Error al actualizar regla:', error);
            this.mostrarError('Error al actualizar la regla de puntos');
          },
          complete: () => {
            this.guardandoRegla = false;
          }
        });
    } else {
      // Crear nueva regla
      this.codigosPromocionalesService.createReglaPuntos(this.formularioRegla)
        .subscribe({
          next: (response) => {
            if (response.ok) {
              this.reglasPuntos.push(response.data);
              this.toast.add({
                severity: 'success',
                summary: 'Creado',
                detail: response.mensaje
              });
              this.cerrarDialogFormRegla();
            } else {
              this.mostrarError(response.mensaje || 'No se pudo crear la regla');
            }
          },
          error: (error) => {
            console.error('Error al crear regla:', error);
            this.mostrarError('Error al crear la regla de puntos');
          },
          complete: () => {
            this.guardandoRegla = false;
          }
        });
    }
  }

  private validarFormulario(): boolean {
    if (!this.formularioRegla.solesPorPunto || this.formularioRegla.solesPorPunto <= 0) {
      this.mostrarError('El valor de soles por punto debe ser mayor a 0');
      return false;
    }

    if (!this.formularioRegla.tipoRegla) {
      this.mostrarError('Debe seleccionar un tipo de regla');
      return false;
    }

    if (!this.formularioRegla.estado || this.formularioRegla.estado.trim().length === 0) {
      this.mostrarError('El estado es requerido');
      return false;
    }

    return true;
  }

  cerrarDialogFormRegla(): void {
    this.mostrarDialogFormRegla = false;
    this.reglaEditando = null;
    this.modoEdicion = false;
    this.guardandoRegla = false;
  }
}
