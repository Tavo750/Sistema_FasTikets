import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenesService } from '../../../../../shared/services/ordenes.service';
import { SessionService } from '../../../../../shared/services/session.service';

@Component({
  selector: 'app-historial-compras',
  standalone: false,
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {

  purchases: any[] = [];
  lastResp: any = null; // para debugging si es necesario

  // Filtros (no funcionales todavía)
  filterCategory = '';
  filterStatus = '';
  filterDate = '';

  constructor(
    private router: Router,
    private ordenesService: OrdenesService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadHistorial();
  }

  private loadHistorial(): void {
    // El endpoint ya determina el cliente a partir del token, por eso no pasamos id
    this.ordenesService.getHistorialCompras().subscribe({
      next: (resp: any) => {
        try { console.debug('Historial response raw:', resp); } catch(e) {}
        this.lastResp = resp;
        if (!resp) return;
        // Intentar localizar el array de órdenes de forma robusta
        let data: any = null;
        if (Array.isArray(resp)) data = resp;
        else if (Array.isArray(resp.data)) data = resp.data;
        else if (resp.data && Array.isArray(resp.data.data)) data = resp.data.data;
        else {
          // buscar la primera propiedad que sea array
          for (const k of Object.keys(resp)) {
            if (Array.isArray((resp as any)[k])) { data = (resp as any)[k]; break; }
          }
        }
        if (!data) data = [];

        this.purchases = (data || []).map((o: any) => {
          // obtener nombre del evento: preferir tickets[0].evento.nombre o tipoTicket.evento.nombre
          const firstItem = (o.items && o.items.length) ? o.items[0] : null;
          const eventName = firstItem?.tickets?.[0]?.evento?.nombre || firstItem?.tipoTicket?.evento?.nombre || 'Evento';
          const ticketsCount = (o.items || []).reduce((s: number, it: any) => s + (it.cantidad || (it.tickets ? it.tickets.length : 0) || 0), 0);
          const image = firstItem?.tickets?.[0]?.evento?.imagenUrl || firstItem?.tipoTicket?.evento?.imagenUrl || '/assets/img/banners/default.jpg';
          const estado = (o.estado || '').toString().toUpperCase();
          const statusClass = estado === 'APROBADO' ? 'status-approved' : (estado === 'RECHAZADO' ? 'status-rejected' : (estado === 'TRANSFERIDO' ? 'status-transfer' : 'status-pending'));
          return {
            id: o.idOrdenCompra,
            title: eventName,
            date: o.fechaOrden,
            tickets: ticketsCount,
            total: o.total,
            estado: estado,
            statusClass: statusClass,
            image: image,
            raw: o
          };
        });
      },
      error: (err: any) => { console.error('Error cargando historial', err); }
    });
  }

  viewDetail(p: any) {
    // Navigate to detail page and pass purchase in navigation state
    const url = `/usuario/historialCompras/detalle/${p.id}`;
    // Pass the real purchase object so the detail page shows the correct layout
    this.router.navigateByUrl(url, { state: { purchase: p } });
  }

}
