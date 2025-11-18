import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirmar-transferencia',
  standalone: false,
  templateUrl: './confirmar-transferencia.component.html',
  styleUrls: ['./confirmar-transferencia.component.css']
})
export class ConfirmarTransferenciaComponent {
  data: any = {};
  transferCompleted = false;

  // fecha formateada para mostrar en pantalla de éxito
  fechaTransferencia: string | null = null;
  // controlar diálogo de confirmación al cancelar
  showCancelDialog = false;
  // transferencias restantes después de confirmar (cálculo): remainingTransfers - 1
  remainingAfterTransfer: number | null = null;
  // diálogo de error al solicitar la transferencia
  showErrorDialog = false;
  errorMessage: string | null = null;

  // indicar que se está procesando la petición
  isSubmitting = false;

  constructor(private router: Router, private messageService: MessageService, private http: HttpClient) {
    // Leer datos enviados por navigation state (desde MisEntradas)
    this.data = history.state?.transferData || {};
  }

  confirmar() {
    if (this.isSubmitting) return;

    // Construir body requerido por la API
    const body = {
      idTicket: Number(this.data?.idTick ?? this.data?.idTick ?? 0),
      emailReceptor: this.data?.email ?? this.data?.emailReceptor ?? '',
      nombreCompletoReceptor: this.data?.nombre ?? this.data?.nombreCompletoReceptor ?? '',
      numeroDocumentoReceptor: this.data?.documento ?? this.data?.numeroDocumentoReceptor ?? '',
      telefonoReceptor: this.data?.telefono ?? this.data?.telefonoReceptor ?? '',
      mensaje: this.data?.mensaje ?? ''
    };

    const url = 'http://localhost:8081/api/v1/transferencias/solicitudes';
    this.isSubmitting = true;

    this.http.post(url, body).subscribe({
      next: (resp) => {
        // Mostrar la pantalla de éxito solo si la API responde correctamente
        this.transferCompleted = true;
        this.fechaTransferencia = new Date().toLocaleDateString();
        const current = Number(this.data?.remainingTransfers ?? 1);
        this.remainingAfterTransfer = Math.max(0, current - 1);
        this.messageService.add({ severity: 'success', summary: 'Transferencia', detail: 'Transferencia confirmada' });
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error al solicitar transferencia', err);
        this.isSubmitting = false;
        // Mostrar diálogo con el detalle del error si está disponible
        try {
          // Preferir la propiedad 'mensaje' que devuelve el backend en español
          const detail = err?.error?.mensaje || err?.error?.message || err?.message || JSON.stringify(err);
          this.errorMessage = String(detail);
        } catch (e) {
          this.errorMessage = 'Ocurrió un error desconocido al solicitar la transferencia.';
        }
        this.showErrorDialog = true;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo solicitar la transferencia. Revisa el detalle.' });
      }
    });
  }

  closeErrorDialog() {
    this.showErrorDialog = false;
    this.errorMessage = null;
    try {
      this.router.navigate(['/usuario/misEntradas']);
    } catch (e) {
      console.warn('No se pudo navegar a Mis Entradas después de cerrar el diálogo de error', e);
    }
  }

  cancelar() {
    // mostrar diálogo de confirmación antes de salir
    this.showCancelDialog = true;
  }

  // usuario confirma que quiere cancelar la transferencia
  confirmCancel() {
    this.showCancelDialog = false;
    this.router.navigate(['/usuario/misEntradas']);
  }

  // usuario rechaza la cancelación y vuelve al flujo
  rejectCancel() {
    this.showCancelDialog = false;
  }

  // En la pantalla de éxito, este botón NO debe redirigir a ninguna parte.
  // Mostrar un mensaje informativo en su lugar.
  viewMyEntries() {
    // Navegar a Mis Entradas pasando el id y el nuevo valor de transferencias restantes
    const update = {
      idTick: this.data?.idTick,
      remainingAfterTransfer: this.remainingAfterTransfer
    };
    this.router.navigate(['/usuario/misEntradas'], { state: { updatedEntry: update } });
  }
}
