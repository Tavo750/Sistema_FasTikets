import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { CartService } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { SessionService } from '../../../../../../shared/services/session.service';
import { PurchaseService } from '../../../../../../shared/services/purchase.service';
import { MessageService } from 'primeng/api';
import { EventoService } from '../../../../administrador/services/evento.service';
import { LocalService } from '../../../../administrador/services/local.service';
import { Data as EventoData } from '../../../../administrador/interfaces/gestion-evento/evento.interface';
import { Data as LocalData } from '../../../../administrador/interfaces/gestion-locales/local.interface';
import { Data as ZonaData } from '../../../../administrador/interfaces/gestion-evento/zona-categoria.interface';
import { Data as EntradaData } from '../../../../administrador/interfaces/gestion-evento/entrada.interface';

interface TicketType {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  stock?: number;
  idZona?: number;
  limitePorPersona?: number;
}

interface ZonaConTickets {
  zona: ZonaData;
  tickets: TicketType[];
  expanded: boolean; // Nueva propiedad para controlar expansión
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
    private localService: LocalService,
    private carritoService: CarritoService,
    private sessionService: SessionService
  ) {}

  @ViewChild('eventoMapa', { static: false }) mapaElement!: ElementRef;

  // Propiedades del evento (ahora serán dinámicas)
  eventoId: number | null = null;
  eventoData: EventoData | null = null;
  localData: LocalData | null = null;
  cargandoDatos: boolean = false;
  cargandoEntradas: boolean = false;

  // Sistema de tickets en cascada por zonas
  zonasConTickets: ZonaConTickets[] = [];

  // Propiedades dinámicas que se actualizan desde el backend
  imageUrl: string = '';
  videoUrl: string = '';
  title: string = '';
  date: string = '';
  time: string = '';
  description: string = '';
  venue: string = '';
  address: string = '';
  organizer: string = '';
  showSeatingChart: boolean = true;

  // Coordenadas para el mapa (Los Olivos, Lima)
  @Input() latitude: number = -11.9746;
  @Input() longitude: number = -77.0669;

  private map: L.Map | undefined;

    // Tickets dinámicos que se cargarán del backend
    tickets: TicketType[] = [];

    ngOnInit(): void {
      // Obtener el ID del evento de la ruta
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.eventoId = +params['id'];
          this.cargarDatosEvento();
        } else {
          // Si no hay ID, usar datos estáticos (para casos como navegación sin parámetros)
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

              // Cargar entradas/tickets después de cargar el local
              this.cargarEntradasEvento();
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
      this.imageUrl = this.eventoData.imagenUrl || '';
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

      // Actualizar el mapa después de cargar los datos
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }

    cargarEntradasEvento(): void {
      if (!this.eventoId) {
        console.error('No hay eventoId disponible');
        this.cargarTicketsDefault();
        return;
      }

      this.cargandoEntradas = true;
      this.zonasConTickets = []; // Limpiar datos anteriores

      console.log('Cargando zonas para evento ID:', this.eventoId);

      // Primero obtener las zonas del evento
      this.eventoService.getListarZonas(this.eventoId).subscribe({
        next: (zonesResponse) => {
          console.log('Respuesta de zonas:', zonesResponse);
          
          if (zonesResponse.ok && zonesResponse.data) {
            const zonas: ZonaData[] = Array.isArray(zonesResponse.data) ? zonesResponse.data : [zonesResponse.data];
            
            console.log('Zonas encontradas:', zonas.length, zonas);

            if (zonas.length === 0) {
              this.cargandoEntradas = false;
              console.warn('⚠️ Este evento no tiene zonas configuradas');
              this.messageService.add({
                severity: 'info',
                summary: 'Sin zonas disponibles',
                detail: 'Este evento aún no tiene zonas configuradas. Por favor, contacte al organizador.'
              });
              // No cargar tickets por defecto cuando el evento no tiene zonas reales
              // this.cargarTicketsDefault();
              return;
            }

            // Para cada zona, obtener sus tickets
            let zonasProcessed = 0;

            zonas.forEach(zona => {
              console.log('Cargando tickets para zona:', zona.idZona, zona.nombre);
              
              this.eventoService.getListarEntradasID(zona.idZona).subscribe({
                next: (ticketsResponse) => {
                  console.log(`Respuesta tickets para zona ${zona.idZona}:`, ticketsResponse);
                  
                  const ticketsDeZona: TicketType[] = [];

                  if (ticketsResponse.ok && ticketsResponse.data) {
                    const tickets: EntradaData[] = Array.isArray(ticketsResponse.data) ? ticketsResponse.data : [ticketsResponse.data];
                    
                    console.log(`Tickets encontrados para zona ${zona.nombre}:`, tickets.length);

                    tickets.forEach(ticket => {
                      if (ticket.activo) { // Solo agregar tickets activos
                        ticketsDeZona.push({
                          id: ticket.idTipoTicket,
                          name: ticket.nombre,
                          price: ticket.precio,
                          quantity: 0,
                          description: ticket.descripcion,
                          stock: ticket.stock,
                          idZona: ticket.idZona,
                          limitePorPersona: ticket.limitePorPersona
                        });
                      }
                    });
                  }

                  // Agregar la zona con sus tickets (aunque no tenga tickets)
                  this.zonasConTickets.push({
                    zona: zona,
                    tickets: ticketsDeZona.sort((a, b) => a.price - b.price), // Ordenar por precio
                    expanded: false // Por defecto las zonas inician colapsadas
                  });

                  zonasProcessed++;
                  if (zonasProcessed === zonas.length) {
                    // Todas las zonas han sido procesadas
                    // Ordenar zonas por nombre
                    this.zonasConTickets.sort((a, b) => a.zona.nombre.localeCompare(b.zona.nombre));
                    this.cargandoEntradas = false;
                  }
                },
                error: (error) => {
                  console.error(`Error al cargar tickets para zona ${zona.idZona}:`, error);

                  // Agregar la zona sin tickets en caso de error
                  this.zonasConTickets.push({
                    zona: zona,
                    tickets: [],
                    expanded: false // Por defecto las zonas inician colapsadas
                  });

                  zonasProcessed++;
                  if (zonasProcessed === zonas.length) {
                    this.zonasConTickets.sort((a, b) => a.zona.nombre.localeCompare(b.zona.nombre));
                    this.cargandoEntradas = false;
                  }
                }
              });
            });
          } else {
            console.warn('No se encontraron zonas para el local');
            this.cargandoEntradas = false;
            this.cargarTicketsDefault();
          }
        },
        error: (error) => {
          console.error('Error al cargar zonas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar las zonas del evento'
          });
          this.cargandoEntradas = false;
          this.cargarTicketsDefault();
        }
      });
    }

    cargarTicketsDefault(): void {
      // Crear una zona por defecto con tickets de ejemplo
      this.zonasConTickets = [
        {
          zona: {
            idZona: 0,
            aforoMax: 1000,
            usuarioCreacion: null,
            usuarioActualizacion: null,
            nombre: 'Zona General',
            activo: true,
            fechaCreacion: null,
            fechaActualizacion: null,
            idEvento: 0
          } as ZonaData,
          tickets: [
            { name: 'Platinum', price: 410.00, quantity: 0, description: 'Acceso VIP completo' },
            { name: 'VIP', price: 150.00, quantity: 0, description: 'Zona VIP premium' },
            { name: 'Tribuna', price: 130.00, quantity: 0, description: 'Asientos con buena vista' },
            { name: 'General', price: 100.00, quantity: 0, description: 'Acceso general' },
          ],
          expanded: false // Por defecto colapsada
        }
      ];
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

    getUrlMapa(): string | null {
      if (this.localData) {
        const localConMapa = this.localData as any;
        return localConMapa.urlMapa || null;
      }
      return null;
    }

    increment(t: TicketType) {
      t.quantity++;
    }

    decrement(t: TicketType) {
      if (t.quantity > 0) { t.quantity--; }
    }

    toggleZonaExpansion(zonaConTickets: ZonaConTickets) {
      zonaConTickets.expanded = !zonaConTickets.expanded;
    }

    expandirTodasLasZonas() {
      this.zonasConTickets.forEach(zona => zona.expanded = true);
    }

    colapsarTodasLasZonas() {
      this.zonasConTickets.forEach(zona => zona.expanded = false);
    }

    getTicketDescription(ticketName: string): string {
      // Buscar la descripción real del ticket en todas las zonas
      for (const zonaConTickets of this.zonasConTickets) {
        const ticket = zonaConTickets.tickets.find(t => t.name === ticketName);
        if (ticket && ticket.description) {
          return ticket.description;
        }
      }

      // Fallback a descripciones por defecto
      const descriptions: { [key: string]: string } = {
        'Platinum': 'Acceso VIP completo, zona preferencial y servicios exclusivos',
        'VIP': 'Zona VIP con servicios premium y vista privilegiada',
        'Vip': 'Zona VIP con servicios premium y vista privilegiada',
        'Tribuna': 'Asientos con buena vista del escenario',
        'General': 'Acceso general al evento'
      };
      return descriptions[ticketName] || 'Entrada estándar al evento';
    }

    getTotalTickets(): number {
      let total = 0;
      for (const zonaConTickets of this.zonasConTickets) {
        total += zonaConTickets.tickets.reduce((zoneTotal, ticket) => zoneTotal + ticket.quantity, 0);
      }
      return total;
    }

    getTotalPrice(): number {
      let total = 0;
      for (const zonaConTickets of this.zonasConTickets) {
        total += zonaConTickets.tickets.reduce((zoneTotal, ticket) => zoneTotal + (ticket.price * ticket.quantity), 0);
      }
      return total;
    }

    onAddToCart() {
      // Obtener todos los tickets seleccionados de todas las zonas
      const selectedTickets: TicketType[] = [];
      for (const zonaConTickets of this.zonasConTickets) {
        const ticketsSeleccionados = zonaConTickets.tickets.filter(t => t.quantity > 0);
        selectedTickets.push(...ticketsSeleccionados);
      }

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

      // Actualizar el carrito local (BehaviorSubject) para reflejar la UI
      const localIds = this.cartService.addEventTicketsToCart(selectedTickets, eventInfo);

      // Si el usuario está autenticado, persistir cada item en la BD mediante el endpoint
      const currentUser = this.sessionService.getCurrentUser();
      if (currentUser && currentUser.idUsuario) {
        const idCliente = currentUser.idUsuario;

        selectedTickets.forEach((ticket, index) => {
          const idTipoTicket = (ticket as any).id || (ticket as any).idTipoTicket;
          const cantidad = ticket.quantity;
          const localId = localIds[index];

          if (idTipoTicket && cantidad > 0) {
            this.carritoService.addItemToServer(idTipoTicket, cantidad, idCliente).subscribe({
              next: (resp: any) => {
                // Extraer el id asignado por el servidor si está disponible
                let serverId: number | undefined;
                try {
                  serverId = resp?.data?.idItemCarrito || resp?.data?.id || resp?.idItemCarrito || resp?.id;
                  if (!serverId && typeof resp === 'object') {
                    serverId = resp['idItemCarrito'] || resp['id'];
                  }
                } catch (e) {
                  console.warn('No se pudo obtener serverId de la respuesta', resp);
                }

                if (serverId && localId) {
                  this.cartService.setServerId(localId, serverId);
                }
              },
              error: (err: any) => {
                // Registro y notificación de error de sincronización
                try {
                  const status = err?.status;
                  const body = err?.error;
                  const message = err?.message || (body && (body.mensaje || body.message)) || 'Error desconocido';
                  console.error('Error guardando item en servidor:', { status, body, message });
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Sincronización parcial',
                    detail: `No se pudo guardar uno o varios items en el servidor (${status}): ${message}`
                  });
                } catch (e) {
                  console.error('Error procesando error del servidor', e);
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Sincronización parcial',
                    detail: 'No se pudo guardar uno o varios items en el servidor. Se han añadido al carrito en memoria.'
                  });
                }
              }
            });
          }
        });
      } else {
        // No autenticado: informar que para persistir en BD se requiere sesión
        this.messageService.add({
          severity: 'info',
          summary: 'Sesión requerida',
          detail: 'Inicia sesión para sincronizar el carrito en la base de datos.'
        });
      }

      // Mensaje rápido de éxito en la UI
      const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `${totalTickets} entrada(s) añadida(s) al carrito correctamente`
      });

      // Limpiar selección de tickets
      this.resetTicketQuantities();
    }

    resetTicketQuantities() {
      for (const zonaConTickets of this.zonasConTickets) {
        zonaConTickets.tickets.forEach(ticket => {
          ticket.quantity = 0;
        });
      }
    }

    onBuyNow() {
      // Obtener todos los tickets seleccionados de todas las zonas
      const selectedTickets: TicketType[] = [];
      for (const zonaConTickets of this.zonasConTickets) {
        const ticketsSeleccionados = zonaConTickets.tickets.filter(t => t.quantity > 0);
        selectedTickets.push(...ticketsSeleccionados);
      }

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
