import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CodigosPromocionalesService } from '../../../services/codigos-promocionales.service';
import { Data as CodigoPromocional } from '../../../interfaces/codigos-promocionales/codigos-promocionales.interface';

@Component({
  selector: 'app-detalle-registro-promo',
  standalone: false,
  templateUrl: './detalle-registro-promo.component.html',
  styleUrls: ['./detalle-registro-promo.component.css'],
  providers: [MessageService]
})
export class DetalleRegistroPromoComponent implements OnInit {
  data!: CodigoPromocional;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private codigosPromocionalesService: CodigosPromocionalesService,
    private toast: MessageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.mostrarError('ID no válido');
      this.router.navigate(['/admin/codigos-promocionales']);
      return;
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      this.mostrarError('ID no válido');
      this.router.navigate(['/admin/codigos-promocionales']);
      return;
    }

    this.cargarDetalle(id);
  }

  private cargarDetalle(id: number): void {
    this.loading = true;
    this.codigosPromocionalesService.getListarCodigosPromocionalesPorId(id)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.data = response.data;
          } else {
            this.mostrarError('No se pudo cargar el detalle del código promocional');
          }
        },
        error: (error) => {
          this.mostrarError('Error al cargar el detalle del código promocional');
          console.error('Error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private mostrarError(mensaje: string): void {
    this.toast.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }
}