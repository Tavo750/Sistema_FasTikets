import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { CartService } from '../../../../../../shared/services/cart.service';
import { PurchaseService } from '../../../../../../shared/services/purchase.service';
import { MessageService } from 'primeng/api';
import { EventoService } from '../../../../administrador/services/evento.service';
import { LocalService } from '../../../../administrador/services/local.service';
import { Data as EventoData } from '../../../../administrador/interfaces/gestion-evento/evento.interface';
import { Data as LocalData } from '../../../../administrador/interfaces/gestion-locales/local.interface';

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
export class EventoComponent implements AfterViewInit, OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
    private purchaseService: PurchaseService,
    private messageService: MessageService,
    private eventoService: EventoService,
    private localService: LocalService
  ) {}

  @ViewChild('eventoMapa', { static: false }) mapaElement!: ElementRef;

  // Propiedades del evento (ahora serán dinámicas)
  eventoId: number | null = null;
  eventoData: EventoData | null = null;
  localData: LocalData | null = null;
  cargandoDatos: boolean = false;

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

    ngOnInit(): void {
      // Obtener el ID del evento de la ruta
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.eventoId = +params['id'];
          this.cargarDatosEvento();
        } else {
          // Si no hay ID, usar datos estáticos (para casos como navegación sin parámetros)
          console.log('Modo estático: usando datos predeterminados');
          this.cargandoDatos = false;
        }
      });
    }

    cargarDatosEvento(): void {
      if (!this.eventoId) return;

      this.cargandoDatos = true;

      this.eventoService.getEventoPorId(this.eventoId).subscribe({
        next: (response) => {
          if (response.ok && response.data) {
            this.eventoData = response.data;
            this.actualizarDatosEvento();

            // Cargar datos del local
            this.cargarDatosLocal(response.data.idLocal);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo cargar la información del evento'
            });
            this.cargandoDatos = false;
          }
        },
        error: (error) => {
          console.error('Error al cargar evento:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la información del evento'
          });
          this.cargandoDatos = false;
        }
      });
    }

    cargarDatosLocal(idLocal: number): void {
      this.localService.getlistarLocalesPorID(idLocal).subscribe({
        next: (response) => {
          if (response.ok && response.data) {
            // Manejar tanto si viene un array como un objeto único
            if (Array.isArray(response.data)) {
              this.localData = response.data.length > 0 ? response.data[0] : null;
            } else {
              // Si el backend devuelve un objeto único en lugar de array
              this.localData = response.data as any;
            }

            if (this.localData) {
              this.actualizarDatosLocal();
            }
          } else {
            console.warn('No se encontraron datos del local');
          }
          this.cargandoDatos = false;
        },
        error: (error) => {
          console.error('Error al cargar local:', error);
          this.cargandoDatos = false;
        }
      });
    }

    actualizarDatosEvento(): void {
      if (!this.eventoData) return;

      this.title = this.eventoData.nombre;
      this.description = this.eventoData.descripcion;
      this.date = this.formatearFecha(this.eventoData.fechaEvento);
      this.time = this.formatearHora(this.eventoData.horaInicio);
      this.imageUrl = this.eventoData.imagenUrl || this.imageUrl;
    }

    private formatearHora(hora: string): string {
      // Si la hora ya viene en formato correcto, la devolvemos
      if (hora.includes('PM') || hora.includes('AM')) {
        return hora;
      }

      // Si viene en formato 24h (ej: "18:00"), convertir a 12h
      const [hours, minutes] = hora.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';

      return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }

    actualizarDatosLocal(): void {
      if (!this.localData) return;

      this.venue = this.localData.nombre;
      this.address = this.localData.direccion;

      // Verificar si existe urlMapa en los datos del local
      const localConMapa = this.localData as any;
      if (localConMapa.urlMapa) {
        // Si urlMapa contiene coordenadas, se podría parsear aquí
        // Por ahora mantenemos las coordenadas por defecto
        console.log('URL del mapa:', localConMapa.urlMapa);
      }

      // Actualizar el mapa después de cargar los datos
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }

    private formatearFecha(fecha: Date): string {
      const fechaObj = new Date(fecha);
      const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      return fechaObj.toLocaleDateString('es-ES', opciones);
    }

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
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Selecciona al menos una entrada para añadir al carrito'
        });
        return;
      }

      // Preparar información del evento
      const eventInfo = {
        title: this.eventoData ? this.eventoData.nombre : this.title,
        image: this.eventoData ? this.eventoData.imagenUrl : this.imageUrl,
        date: this.date,
        venue: this.localData ? this.localData.nombre : this.venue,
        eventId: this.eventoId ? this.eventoId.toString() : this.title.toLowerCase().replace(/\s+/g, '-')
      };

      // Añadir tickets al carrito
      this.cartService.addEventTicketsToCart(selectedTickets, eventInfo);

      // Mostrar mensaje de éxito
      const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `${totalTickets} entrada(s) añadida(s) al carrito correctamente`
      });

      // Opcional: limpiar selección de tickets
      this.resetTicketQuantities();

      console.log('Entradas añadidas al carrito:', selectedTickets);
    }

    resetTicketQuantities() {
      this.tickets.forEach(ticket => {
        ticket.quantity = 0;
      });
    }

    onBuyNow() {
      const selectedTickets = this.tickets.filter(t => t.quantity > 0);
      if (selectedTickets.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Selecciona al menos una entrada para comprar'
        });
        return;
      }

      // Preparar datos para el componente de compra
      const purchaseData = {
        eventInfo: {
          title: this.eventoData ? this.eventoData.nombre : this.title,
          date: this.date,
          time: this.time,
          venue: this.localData ? this.localData.nombre : this.venue,
          address: this.localData ? this.localData.direccion : this.address,
          organizer: this.organizer,
          image: this.eventoData ? this.eventoData.imagenUrl : this.imageUrl
        },
        tickets: selectedTickets.map(ticket => ({
          name: ticket.name,
          price: ticket.price,
          quantity: ticket.quantity,
          description: this.getTicketDescription(ticket.name)
        })),
        totalTickets: this.getTotalTickets(),
        totalPrice: this.getTotalPrice(),
        source: 'evento' as const
      };

      // Enviar datos al servicio de compra
      this.purchaseService.setPurchaseDataFromEvent(purchaseData);

      // Navegar al componente de compra
      this.router.navigate(['/home/compraEntradas']);

      console.log('Comprar ahora', selectedTickets);
    }

    ngAfterViewInit() {
      // El mapa se inicializará después de cargar los datos del local
      // Solo inicializar si no hay ID de evento (modo estático)
      if (!this.eventoId) {
        setTimeout(() => {
          this.initializeMap();
        }, 100);
      }
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
              <strong>${this.localData ? this.localData.nombre : this.venue}</strong><br>
              ${this.localData ? this.localData.direccion : this.address}<br>
              <small>${this.eventoData ? this.eventoData.nombre : this.title}</small>
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
