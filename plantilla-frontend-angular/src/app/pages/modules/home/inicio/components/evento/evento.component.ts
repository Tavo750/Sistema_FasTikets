import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

interface TicketType {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent implements AfterViewInit {
  constructor(
    private router: Router
  ) {}

  @ViewChild('eventoMapa', { static: false }) mapaElement!: ElementRef;

  @Input() imageUrl: string = 'assets/images/ub40.jpg';
  @Input() videoUrl: string = 'assets/videos/ub40-preview.mp4';
  @Input() title: string = 'UB40 Ft. Ali Campbell';
  @Input() date: string = 'Jueves 11 de Septiembre, 2025';
  @Input() time: string = '06:00 PM';
  @Input() description: string = 'UB40, la leyenda de la música contemporánea y considerado como uno de los más importantes exponentes del balada en toda América Latina, llega el próximo 9 de septiembre para ofrecer un increíble concierto en Costa 21 como parte de su Gira Perú 2025.';
  @Input() venue: string = 'Lima, PE';
  @Input() address: string = 'Av. Naranjal 398, Los Olivos, Perú';
  @Input() organizer: string = 'El Huaralino Internacional';
  @Input() showSeatingChart: boolean = true;

  // Coordenadas para el mapa (Los Olivos, Lima)
  @Input() latitude: number = -11.9746;
  @Input() longitude: number = -77.0669;

  private map: L.Map | undefined;

    tickets: TicketType[] = [
      { name: 'Platinum', price: 410.00, quantity: 0 },
      { name: 'Vip',      price: 150.00, quantity: 0 },
      { name: 'Tribuna',  price: 130.00, quantity: 0 },
      { name: 'General',  price: 100.00, quantity: 0 },
    ];

    increment(t: TicketType) {
      t.quantity++;
    }

    decrement(t: TicketType) {
      if (t.quantity > 0) { t.quantity--; }
    }

    getTicketDescription(ticketName: string): string {
      const descriptions: { [key: string]: string } = {
        'Platinum': 'Acceso VIP completo, zona preferencial y servicios exclusivos',
        'Vip': 'Zona VIP con servicios premium y vista privilegiada',
        'Tribuna': 'Asientos con buena vista del escenario',
        'General': 'Acceso general al evento'
      };
      return descriptions[ticketName] || 'Entrada estándar al evento';
    }

    getTotalTickets(): number {
      return this.tickets.reduce((total, ticket) => total + ticket.quantity, 0);
    }

    getTotalPrice(): number {
      return this.tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
    }

    onAddToCart() {
      const selectedTickets = this.tickets.filter(t => t.quantity > 0);
      if (selectedTickets.length === 0) {
        return;
      }
      // aquí disparar lógica para añadir al carrito
      console.log('Añadir al carrito', selectedTickets);
    }

    onBuyNow() {
      const selectedTickets = this.tickets.filter(t => t.quantity > 0);
      if (selectedTickets.length === 0) {
        return;
      }
      // aquí disparar flujo de compra inmediata
      this.router.navigate(['/home/compraEntradas']);

      console.log('Comprar ahora', selectedTickets);

    }

    ngAfterViewInit() {
      // Inicializar el mapa automáticamente después de que la vista se haya cargado
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }

    private initializeMap() {
      if (this.mapaElement) {
        // Inicializar el mapa
        this.map = L.map(this.mapaElement.nativeElement).setView(
          [this.latitude, this.longitude],
          16
        );

        // Agregar capa de tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(this.map);

        // Configurar el ícono por defecto de Leaflet
        const DefaultIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = DefaultIcon;

        // Agregar marcador del evento
        L.marker([this.latitude, this.longitude])
          .addTo(this.map)
          .bindPopup(`
            <div style="text-align: center;">
              <strong>${this.venue}</strong><br>
              ${this.address}<br>
              <small>${this.title}</small>
            </div>
          `)
          .openPopup();

        // Forzar redibujado del mapa
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        }, 100);
      }
    }
}
