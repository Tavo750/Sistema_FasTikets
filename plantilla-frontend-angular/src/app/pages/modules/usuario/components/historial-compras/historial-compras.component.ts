import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenesService } from '../../../../../shared/services/ordenes.service';
import { SessionService } from '../../../../../shared/services/session.service';
import { LoadingService } from '../../../../../shared/services/loading.service';

@Component({
  selector: 'app-historial-compras',
  standalone: false,
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {

  purchases: any[] = [];
  // Paginación
  currentPage = 1;
  rowsPerPage = 9; // mostrar 9 filas por página
  lastResp: any = null; // para debugging si es necesario

  // Filtros (no funcionales todavía)
  filterCategory = '';
  filterStatus = '';
  filterDate = '';

  // Apply filters: estado and fechaCompra
  get filteredPurchases(): any[] {
    let list = (this.purchases || []).slice();
    // Filter by status if provided
    if (this.filterStatus && this.filterStatus.trim()) {
      const wanted = (this.filterStatus || '').toString().toUpperCase();
      list = list.filter(p => ((p.estado || '').toString().toUpperCase()) === wanted);
    }
    // Filter by date (input type=date yields 'yyyy-MM-dd')
    if (this.filterDate && this.filterDate.trim()) {
      const wanted = this.filterDate;
      list = list.filter(p => {
        if (!p.date) return false;
        try {
          const d = new Date(p.date);
          if (isNaN(d.getTime())) return false;
          const y = d.getFullYear();
          const m = ('0' + (d.getMonth() + 1)).slice(-2);
          const day = ('0' + d.getDate()).slice(-2);
          return `${y}-${m}-${day}` === wanted;
        } catch (e) {
          return false;
        }
      });
    }
    return list;
  }

  constructor(
    private router: Router,
    private ordenesService: OrdenesService,
    private sessionService: SessionService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadHistorial();
  }

  get visiblePurchases(): any[] {
    // Visible purchases come from filtered list (estado + fecha)
    return this.filteredPurchases;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.visiblePurchases.length / this.rowsPerPage));
  }

  get pagedPurchases(): any[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    return this.visiblePurchases.slice(start, start + this.rowsPerPage);
  }

  goToPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  nextPage() { this.goToPage(this.currentPage + 1); }
  prevPage() { this.goToPage(this.currentPage - 1); }

  onFilterChange() {
    // Reset to first page when filters change
    this.currentPage = 1;
  }

  private loadHistorial(): void {
    this.loadingService.show();
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
          // Preferir campos directos del endpoint (imagenUrl, nombreEvento, fechaCompra, totalPagado)
          const firstItem = (o.items && o.items.length) ? o.items[0] : null;
          const eventName = o.nombreEvento || firstItem?.tickets?.[0]?.evento?.nombre || firstItem?.tipoTicket?.evento?.nombre || 'Evento';
          const ticketsCount = (o.items || []).reduce((s: number, it: any) => s + (it.cantidad || (it.tickets ? it.tickets.length : 0) || 0), 0);
          const image = o.imagenUrl || firstItem?.tickets?.[0]?.evento?.imagenUrl || firstItem?.tipoTicket?.evento?.imagenUrl || '/assets/img/banners/default.jpg';
          const estado = (o.estado || '').toString().toUpperCase();
          const statusClass = estado === 'APROBADO' ? 'status-approved' : (estado === 'RECHAZADO' ? 'status-rejected' : (estado === 'TRANSFERIDO' ? 'status-transfer' : 'status-pending'));
          return {
            id: o.idOrden ?? o.idOrdenCompra ?? o.id,
            idOrden: o.idOrden ?? o.idOrdenCompra ?? o.id,
            title: eventName,
            date: o.fechaCompra ?? o.fechaOrden ?? o.fechaOrdenCompra ?? null,
            tickets: ticketsCount,
            total: o.totalPagado ?? o.total ?? o.subtotal ?? 0,
            estado: estado,
            statusClass: statusClass,
            image: image,
            raw: o
          };
        });
        this.loadingService.hide();
        // Reset pagination to first page after loading data
        this.currentPage = 1;
        // Pagination reset after loading data
        // (removed debug logging)
      },
      error: (err: any) => {
        console.error('Error cargando historial', err);
        this.loadingService.hide();
      }
    });
  }

  viewDetail(p: any) {
    // Navigate to detail page and pass purchase in navigation state
    const url = `/usuario/historialCompras/detalle/${p.id}`;
    // Pass the real purchase object so the detail page shows the correct layout
    this.router.navigateByUrl(url, { state: { purchase: p } });
  }

}
