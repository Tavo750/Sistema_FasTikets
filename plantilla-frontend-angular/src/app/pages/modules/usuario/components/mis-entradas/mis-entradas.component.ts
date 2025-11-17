import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../../../../../core/services/login.service';
import { HttpClient } from '@angular/common/http';

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
  // Se removieron las propiedades relacionadas a la transferencia de entradas

  constructor(
    private messageService: MessageService,
    private router: Router,
    private loginService: LoginService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    // Cargar entradas desde el endpoint
    this.loadMyEntries();
  }

  loadMyEntries(): void {
    const url = 'http://localhost:8081/api/v1/clientes/mis-entradas';
    console.log('mis-entradas: iniciando petición a', url);
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
        this.isLoadingEntries = false;
      },
      error: (err) => {
        console.error('Error cargando mis-entradas', err);
        this.lastResp = { error: err };
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener tus entradas.' });
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

  // Helpers para la plantilla eliminados (antes relacionados al formulario de transferencia)
}
