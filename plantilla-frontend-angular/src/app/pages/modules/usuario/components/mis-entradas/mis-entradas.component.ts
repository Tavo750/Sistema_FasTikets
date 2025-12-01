import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../../../../../core/services/login.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-mis-entradas',
  standalone: false,
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css']
})
export class MisEntradasComponent implements OnInit {
  userName = 'Usuario';
  isLoadingUserName = true;
  // Nueva lógica para lista de entradas
  myEntries: any[] = [];
  isLoadingEntries: boolean = false;
  lastResp: any = null;
  // Solicitudes de transferencias recibidas (donde este usuario es destinatario)
  receivedTransfers: any[] = [];
  isLoadingReceivedTransfers: boolean = false;
  // Aceptar solicitud dialog
  showAcceptDialog: boolean = false;
  selectedReceivedTransfer: any = null;
  isProcessingAccept: boolean = false;
  // Rechazar solicitud dialog
  showCancelDialog: boolean = false;
  selectedCancelTransfer: any = null;
  isProcessingCancel: boolean = false;
  // Se removieron las propiedades relacionadas a la transferencia de entradas

  constructor(
    private messageService: MessageService,
    private router: Router,
    private loginService: LoginService,
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    // Cargar entradas desde el endpoint
    this.loadMyEntries();
    // Cargar solicitudes de transferencias recibidas
    this.loadReceivedTransfers();
  }

  loadReceivedTransfers(): void {
    // Usar endpoint oficial para solicitudes recibidas
    const primary = 'https://api.francoricra.online/api/v1/transferencias/solicitudes/recibidas';
    const fallback = 'https://api.francoricra.online/api/v1/transferencias/solicitudes/recibidas';
    this.isLoadingReceivedTransfers = true;
    this.receivedTransfers = [];
    this.http.get<any>(primary).subscribe({
      next: (resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);
        this.receivedTransfers = items.map((t: any) => ({
          id: t.idTicket ?? t.idSolicitud ?? t.id ?? null,
          fromUser: t.nombreEmisor ?? t.fromUser ?? t.nombreRemitente ?? '—',
          eventName: t.nombreEvento ?? t.eventName ?? '',
          eventDate: t.fechaEvento ?? t.eventDate ?? null,
          expirationDate: t.fechaExpiracion ?? t.fechaExpiracion ?? t.fechaExpiracion ?? null,
          status: t.estado ?? t.status ?? 'PENDIENTE',
          raw: t
        }));
        this.isLoadingReceivedTransfers = false;
      },
      error: (err) => {
        console.error('Error cargando transferencias recibidas', err);
        this.messageService.add({ severity: 'warn', summary: 'Transferencias', detail: 'No se pudieron cargar las solicitudes recibidas.' });
        this.isLoadingReceivedTransfers = false;
      }
    });
  }

  openAcceptDialog(tr: any): void {
    this.selectedReceivedTransfer = tr;
    this.showAcceptDialog = true;
  }

  cancelAccept(): void {
    this.selectedReceivedTransfer = null;
    this.showAcceptDialog = false;
  }

  confirmAccept(): void {
    if (!this.selectedReceivedTransfer) return;
    const idSolicitud = this.selectedReceivedTransfer?.raw?.idSolicitud ?? this.selectedReceivedTransfer?.raw?.id ?? null;
    if (!idSolicitud) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró idSolicitud para procesar.' });
      this.cancelAccept();
      return;
    }

    // Llamada al endpoint unificado de respuesta
    const url = `https://api.francoricra.online/api/v1/transferencias/solicitudes/${idSolicitud}/responder`;
    const body = { idSolicitud: idSolicitud, aceptar: true };
    this.isProcessingAccept = true;
    this.http.post<any>(url, body).subscribe({
      next: (resp) => {
        this.isProcessingAccept = false;
        this.messageService.add({ severity: 'success', summary: 'Aceptada', detail: resp?.mensaje || 'Transferencia aceptada.' });
        // actualizar estado en la lista local
        try {
          const idx = this.receivedTransfers.findIndex(r => (r.raw?.idSolicitud ?? r.raw?.id) === idSolicitud || r.id === idSolicitud);
          if (idx !== -1) this.receivedTransfers[idx].status = 'ACEPTADA';
        } catch (e) {}
        this.cancelAccept();
      },
      error: (err) => {
        this.isProcessingAccept = false;
        console.error('Error al aceptar solicitud', err);
        const detail = err?.error?.mensaje || err?.message || 'No se pudo aceptar la solicitud.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  // ----------------- Rechazo de solicitud -----------------
  openCancelDialog(tr: any): void {
    this.selectedCancelTransfer = tr;
    this.showCancelDialog = true;
  }

  cancelCancel(): void {
    this.selectedCancelTransfer = null;
    this.showCancelDialog = false;
  }

  confirmCancel(): void {
    if (!this.selectedCancelTransfer) return;
    const idSolicitud = this.selectedCancelTransfer?.raw?.idSolicitud ?? this.selectedCancelTransfer?.raw?.id ?? null;
    if (!idSolicitud) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se encontró idSolicitud para procesar.' });
      this.cancelCancel();
      return;
    }

    const url = `https://api.francoricra.online/api/v1/transferencias/solicitudes/${idSolicitud}/responder`;
    const body = { idSolicitud: idSolicitud, aceptar: false };
    this.isProcessingCancel = true;
    this.http.post<any>(url, body).subscribe({
      next: (resp) => {
        this.isProcessingCancel = false;
        this.messageService.add({ severity: 'success', summary: 'Rechazada', detail: resp?.mensaje || 'Transferencia rechazada.' });
        try {
          const idx = this.receivedTransfers.findIndex(r => (r.raw?.idSolicitud ?? r.raw?.id) === idSolicitud || r.id === idSolicitud);
          if (idx !== -1) this.receivedTransfers[idx].status = 'RECHAZADA';
        } catch (e) {}
        this.cancelCancel();
      },
      error: (err) => {
        this.isProcessingCancel = false;
        console.error('Error al rechazar solicitud', err);
        const detail = err?.error?.mensaje || err?.message || 'No se pudo rechazar la solicitud.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  loadMyEntries(): void {
    const url = 'https://api.francoricra.online/api/v1/clientes/mis-entradas';
    console.log('mis-entradas: iniciando petición a', url);
    this.loadingService.show();
    this.isLoadingEntries = true;
    this.lastResp = null;
    this.http.get<any>(url).subscribe({
      next: (resp) => {
        console.log('mis-entradas: respuesta recibida', resp);
        this.lastResp = { body: resp };
        const items = Array.isArray(resp?.data) ? resp.data : [];
        // Mapear campos al formato usado por la plantilla
        this.myEntries = items.map((t: any) => ({
          id: t.idTicket,
          seat: t.nombreZona ?? t.nombreTipoTicket ?? '',
          remainingTransfers: t.transferenciasRestantes ?? 0,
          price: t.precioPagado ?? 0,
          eventName: t.nombreEvento ?? '',
          eventDate: t.fechaEvento ? `${t.fechaEvento} ${t.horaEvento ?? ''}`.trim() : '',
          estado: t.estado,
          raw: t
        }));

        // Si venimos con un estado que contiene una actualización de transferencias, aplicarla
        try {
          const st: any = (history && (history as any).state) || {};
          const upd = st?.updatedEntry;
          if (upd && upd.idTick) {
            const idx = this.myEntries.findIndex(e => e.id === upd.idTick || e.id === (upd.idTick + ''));
            if (idx !== -1) {
              // Actualizar el valor mostrado (usar remainingAfterTransfer si está presente)
              this.myEntries[idx].remainingTransfers = (typeof upd.remainingAfterTransfer === 'number') ? upd.remainingAfterTransfer : this.myEntries[idx].remainingTransfers;
            }
          }
        } catch (e) {
          console.warn('No se aplicó actualización desde state', e);
        }
        this.loadingService.hide();
        this.isLoadingEntries = false;
      },
      error: (err) => {
        console.error('Error cargando mis-entradas', err);
        this.lastResp = { error: err };
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener tus entradas.' });
        this.loadingService.hide();
        this.isLoadingEntries = false;
      }
    });
  }

  private cargarDatosUsuario(): void {
    try {
      const usuario = this.loginService.getCurrentUser();
      const persona = this.loginService.getCurrentPersona();

      if (persona && (persona as any).nombreCompleto) {
        this.userName = (persona as any).nombreCompleto;
      } else if (usuario && (usuario as any).nombPers) {
        this.userName = (usuario as any).nombPers;
      } else {
        this.userName = 'Usuario';
      }
    } catch (error) {
      console.error('Error al cargar nombre de usuario:', error);
      this.userName = 'Usuario';
    } finally {
      this.isLoadingUserName = false;
    }
  }

  // Métodos de verificación/selección de transferencia removidos.

  // Acciones de botones
  // La acción de transferir fue removida: el método original eliminado intencionalmente.

  // Navegar a la página de transferencia, pasando la entrada seleccionada en el state
  goToTransfer(entry: any) {
    try {
      const state = { selectedEntry: entry };
      this.router.navigateByUrl('/usuario/transferir-entrada', { state });
    } catch (err) {
      console.error('Error navegando a transferir-entrada', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo abrir la página de transferencia.' });
    }
  }

  /**
   * Intenta descargar el QR asociado a una entrada.
   * Busca heurísticamente propiedades como codigoQr, codigoQrBase64, codigo, qr, qrCode en el objeto
   * y si encuentra un payload de texto genera una imagen QR mediante el servicio qrserver y la descarga.
   */
  downloadQr(entry: any): void {
    try {
      const src = entry?.raw ?? entry;
      const code = this.findQrCodeValue(src);
      if (!code) {
        this.messageService.add({ severity: 'warn', summary: 'QR', detail: 'No hay QR disponible para esta entrada.' });
        return;
      }

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(code)}`;
      fetch(qrUrl)
        .then((resp) => {
          if (!resp.ok) throw new Error('No se pudo obtener la imagen del QR');
          return resp.blob();
        })
        .then((blob) => {
          const filename = `QR-${entry?.id ?? 'ticket'}.png`;
          this.triggerDownload(blob, filename);
        })
        .catch((err) => {
          console.error('Error descargando QR', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el QR.' });
        });
    } catch (e) {
      console.error('downloadQr error', e);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar descargar el QR.' });
    }
  }

  /**
   * Heurística simple para buscar un payload de QR dentro de un objeto/array.
   */
  private findQrCodeValue(obj: any, depth = 0): string | null {
    if (!obj || depth > 6) return null;
    if (typeof obj === 'string') return obj.trim() ? obj : null;
    if (Array.isArray(obj)) {
      for (const it of obj) {
        const found = this.findQrCodeValue(it, depth + 1);
        if (found) return found;
      }
      return null;
    }
    if (typeof obj === 'object') {
      const candidates = /codigoQr|codigo_qr|codigoQrBase64|codigo|qrCode|qr|codigoQR/i;
      // Check direct properties
      for (const k of Object.keys(obj)) {
        try {
          if (candidates.test(k) && typeof (obj as any)[k] === 'string' && (obj as any)[k].trim()) {
            return (obj as any)[k];
          }
        } catch (e) {}
      }
      // Deep scan
      for (const k of Object.keys(obj)) {
        try {
          const found = this.findQrCodeValue((obj as any)[k], depth + 1);
          if (found) return found;
        } catch (e) {}
      }
    }
    return null;
  }

  private triggerDownload(blob: Blob, filename: string) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error triggering download', e);
    }
  }

  // Helpers para la plantilla eliminados (antes relacionados al formulario de transferencia)
}
