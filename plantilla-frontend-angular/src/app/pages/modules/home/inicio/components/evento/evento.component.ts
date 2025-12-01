import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../../../../shared/services/cart.service';
import { CarritoService } from '../../../../../../shared/services/carrito.service';
import { SessionService } from '../../../../../../shared/services/session.service';
import { PurchaseService } from '../../../../../../shared/services/purchase.service';
import { MessageService } from 'primeng/api';
import { EventoService } from '../../../../administrador/services/evento.service';
import { LocalService } from '../../../../administrador/services/local.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogoComponent } from '../../../../../../shared/components/dialogo/dialogo.component';
import { Data as EventoData } from '../../../../administrador/interfaces/gestion-evento/evento.interface';
import { Data as LocalData } from '../../../../administrador/interfaces/gestion-locales/local.interface';
import { Data as ZonaData } from '../../../../administrador/interfaces/gestion-evento/zona-categoria.interface';
import { Data as EntradaData } from '../../../../administrador/interfaces/gestion-evento/entrada.interface';
import { GOOGLE_MAPS_CONFIG } from '../../../../../../config/google-maps.config';
import { LoadingService } from '../../../../../../shared/services/loading.service';
import { CartTimerService } from '../../../../../../shared/services/cart-timer.service';

// Declarar Google Maps para TypeScript
declare global {
  interface Window {
    google: any;
  }
}

declare var google: any;

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
    private sessionService: SessionService,
    private dialogService: DialogService,
    private loadingService: LoadingService
    , private cartTimerService: CartTimerService
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
  menoresDeEdadPermitidos: boolean = false;
  restricciones: string = '';
  politicasDevolucion: string = '';

  private map: any;
  private marker: any;
  private geocoder: any;
  mapLoading = true;

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

      // Manejar menoresDeEdadPermitidos (null se trata como false)
      this.menoresDeEdadPermitidos = this.eventoData.menoresDeEdadPermitidos === true;

      // Manejar restricciones y políticas (null se convierte en string vacío)
      this.restricciones = this.eventoData.restricciones || '';
      this.politicasDevolucion = this.eventoData.politicasDevolucion || '';

      console.log('Datos del evento cargados:', {
        menoresDeEdadPermitidos: this.menoresDeEdadPermitidos,
        restricciones: this.restricciones,
        politicasDevolucion: this.politicasDevolucion
      });
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

                    // Obtener la fecha actual (sin hora para comparación correcta)
                    const fechaActual = new Date();
                    fechaActual.setHours(0, 0, 0, 0);

                    tickets.forEach(ticket => {
                      if (ticket.activo) { // Solo agregar tickets activos
                        // Validar que la entrada esté dentro del rango de fechas de venta
                        let dentroDelRango = true;

                        if (ticket.fechaInicioVenta) {
                          const fechaInicio = new Date(ticket.fechaInicioVenta);
                          fechaInicio.setHours(0, 0, 0, 0);
                          if (fechaActual < fechaInicio) {
                            dentroDelRango = false;
                            console.log(`Entrada "${ticket.nombre}" aún no está disponible. Inicia el ${ticket.fechaInicioVenta}`);
                          }
                        }

                        if (ticket.fechaFinVenta) {
                          const fechaFin = new Date(ticket.fechaFinVenta);
                          fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día final
                          if (fechaActual > fechaFin) {
                            dentroDelRango = false;
                            console.log(`Entrada "${ticket.nombre}" ya no está disponible. Finalizó el ${ticket.fechaFinVenta}`);
                          }
                        }

                        // Solo agregar el ticket si está dentro del rango de fechas
                        if (dentroDelRango) {
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

    /**
     * Obtiene el límite máximo de entradas configurado por el administrador
     */
    getMaxEntradasPermitidas(): number {
      const maxEntradas = localStorage.getItem('max_entradas_por_cliente');
      return maxEntradas ? parseInt(maxEntradas, 10) : 10;
    }

    /**
     * Calcula el total de entradas seleccionadas actualmente
     */
    getTotalEntradasSeleccionadas(): number {
      let total = 0;
      for (const zonaConTickets of this.zonasConTickets) {
        total += zonaConTickets.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      }
      return total;
    }

    increment(t: TicketType) {
      const limiteMaximo = this.getMaxEntradasPermitidas();
      const totalActual = this.getTotalEntradasSeleccionadas();
      
      if (totalActual >= limiteMaximo) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Límite alcanzado',
          detail: `No puedes seleccionar más de ${limiteMaximo} entradas en total para este evento.`
        });
        return;
      }
      
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

    /**
     * Persiste items en el servidor por lotes para evitar problemas con tamaños grandes de payload.
     * ItemsPayload: [{ idTipoTicket, cantidad }]
     * localIds: ids locales generados por cartService.addEventTicketsToCart (en el mismo orden)
     */
    private async persistItemsInBatches(itemsPayload: Array<{ idTipoTicket: number; cantidad: number }>, localIds: number[], idCliente: number): Promise<void> {
      const BATCH_SIZE = 50; // ajustar según capacidad del servidor
      let offset = 0;
      while (offset < itemsPayload.length) {
        const batch = itemsPayload.slice(offset, offset + BATCH_SIZE);
        const localSlice = localIds.slice(offset, offset + BATCH_SIZE);
        try {
          const resp: any = await firstValueFrom(this.carritoService.addItemsToServer(batch, idCliente));
          const data = resp?.data ?? resp;
          if (Array.isArray(data)) {
            data.forEach((created: any, idx: number) => {
              const serverId = created?.idItemCarrito || created?.id || created?.id_carrito || created?.idItem;
              const localId = localSlice[idx];
              if (serverId && localId) this.cartService.setServerId(localId, serverId);
            });
          } else if (Array.isArray(data?.items)) {
            data.items.forEach((created: any, idx: number) => {
              const serverId = created?.idItemCarrito || created?.id;
              const localId = localSlice[idx];
              if (serverId && localId) this.cartService.setServerId(localId, serverId);
            });
          } else if (typeof data === 'object') {
            const possibleArray = Object.values(data).filter(v => Array.isArray(v)).shift();
            if (Array.isArray(possibleArray)) {
              possibleArray.forEach((created: any, idx: number) => {
                const serverId = created?.idItemCarrito || created?.id;
                const localId = localSlice[idx];
                if (serverId && localId) this.cartService.setServerId(localId, serverId);
              });
            }
          }
        } catch (err) {
          // En caso de error, lanzar para que el llamador gestione el revert y notificación
          throw err;
        }
        offset += BATCH_SIZE;
      }
    }

    onAddToCart() {
      return (async () => {
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

      // Validar límite máximo de entradas configurado por el administrador
      const maxEntradas = localStorage.getItem('max_entradas_por_cliente');
      const limiteMaximo = maxEntradas ? parseInt(maxEntradas, 10) : 10;
      
      const totalSeleccionado = selectedTickets.reduce((sum: number, ticket: TicketType) => sum + ticket.quantity, 0);
      const eventoId = this.eventoId ? this.eventoId.toString() : this.title.toLowerCase().replace(/\s+/g, '-');
      
      // Calcular entradas actuales en el carrito para este evento
      const currentCartItems = this.cartService.getCartItems();
      const entradasActualesEvento = currentCartItems
        .filter(item => item.eventId === eventoId)
        .reduce((sum, item) => sum + item.quantity, 0);
      
      const totalFinal = entradasActualesEvento + totalSeleccionado;
      
      if (totalFinal > limiteMaximo) {
        this.messageService.add({
          severity: 'error',
          summary: 'Límite excedido',
          detail: `No puedes comprar más de ${limiteMaximo} entradas para este evento. Ya tienes ${entradasActualesEvento} en el carrito.`
        });
        return;
      }

      // Si no está autenticado, mostrar modal y redirigir al login solo después de aceptar
      const currentUser = this.sessionService.getCurrentUser();
      if (!currentUser || !currentUser.idUsuario) {
        const ref = this.dialogService.open(DialogoComponent, {
          header: 'Sesión requerida',
          data: {
            mensaje: 'No has iniciado sesión. Debes registrarte o iniciar sesión para añadir al carrito.',
            severidad: 'info',
            buttonLabel: 'Aceptar'
          },
          width: '420px'
        });

        ref.onClose.subscribe(() => {
          this.router.navigate(['/login']);
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

      // Reiniciar el temporizador de reserva del carrito porque el usuario agregó items
      try {
        if (currentUser && currentUser.idUsuario) {
          this.cartTimerService.startIfNotStarted(currentUser.idUsuario, true);
        } else {
          // For guests, force restart as well
          this.cartTimerService.startIfNotStarted(undefined, true);
        }
      } catch (e) { console.debug('No se pudo reiniciar temporizador tras añadir items', e); }

      // Si el usuario está autenticado, persistir los items en la BD en lotes (batches)
      if (currentUser && currentUser.idUsuario) {
        const idCliente = currentUser.idUsuario;
        const itemsPayload = selectedTickets
          .filter(t => t.quantity > 0)
          .map(t => ({ idTipoTicket: (t as any).id || (t as any).idTipoTicket, cantidad: t.quantity }));

        try {
          await this.persistItemsInBatches(itemsPayload, localIds, idCliente);
        } catch (err) {
          // Revertir items locales ya añadidos y mostrar diálogo de error
          try { localIds.forEach(id => this.cartService.removeLocalOnly(id)); } catch(e) { console.warn('No se pudieron revertir items locales tras error de servidor (onAddToCart)', e); }
          this.dialogService.open(DialogoComponent, {
            header: 'Error al sincronizar carrito',
            width: '480px',
            data: { mensaje: 'No se pudo guardar los items en el servidor. Intenta de nuevo.', severidad: 'error', buttonLabel: 'Aceptar' }
          });
        }
      } else {
        // No autenticado: informar que para persistir en BD se requiere sesión
        this.messageService.add({ severity: 'info', summary: 'Sesión requerida', detail: 'Inicia sesión para sincronizar el carrito en la base de datos.' });
      }
      // Mensaje rápido de éxito en la UI
      const totalTickets = selectedTickets.reduce((sum: number, ticket: TicketType) => sum + ticket.quantity, 0);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `${totalTickets} entrada(s) añadida(s) al carrito correctamente`
      });

      // Limpiar selección de tickets
      this.resetTicketQuantities();
    })();
    }

    resetTicketQuantities() {
      for (const zonaConTickets of this.zonasConTickets) {
        zonaConTickets.tickets.forEach(ticket => {
          ticket.quantity = 0;
        });
      }
    }

    volverAEventos() {
      this.router.navigate(['/home/inicio']);
    }

    onBuyNow() {
      (async () => {
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

      // Si no está autenticado, mostrar modal y redirigir al login solo después de aceptar
      const currentUser = this.sessionService.getCurrentUser();
      if (!currentUser || !currentUser.idUsuario) {
        const ref = this.dialogService.open(DialogoComponent, {
          header: 'Sesión requerida',
          data: {
            mensaje: 'No has iniciado sesión. Debes registrarte o iniciar sesión para comprar ahora.',
            severidad: 'info',
            buttonLabel: 'Aceptar'
          },
          width: '420px'
        });

        ref.onClose.subscribe(() => {
          this.router.navigate(['/login']);
        });

        return;
      }

      // Antes de navegar a la pantalla de compra, añadir los items al carrito local
      // y persistirlos en el servidor en una sola llamada si el usuario está autenticado.
      const eventInfo = {
        title: this.eventoData ? this.eventoData.nombre : this.title,
        image: this.eventoData ? this.eventoData.imagenUrl : this.imageUrl,
        date: this.date,
        venue: this.localData ? this.localData.nombre : this.venue,
        eventId: this.eventoId ? this.eventoId.toString() : this.title.toLowerCase().replace(/\s+/g, '-')
      };

      // Añadir al carrito en memoria (genera localIds)
      const localIds = this.cartService.addEventTicketsToCart(selectedTickets.map(t => ({ name: t.name, price: t.price, quantity: t.quantity })), eventInfo);

      // Reiniciar el temporizador al empezar una operación de compra
      try {
        const currentUser2 = this.sessionService.getCurrentUser();
        if (currentUser2 && currentUser2.idUsuario) {
          this.cartTimerService.startIfNotStarted(currentUser2.idUsuario, true);
        } else {
          this.cartTimerService.startIfNotStarted(undefined, true);
        }
      } catch (e) { console.debug('No se pudo reiniciar temporizador tras añadir items (buyNow)', e); }

      // Si el usuario está autenticado, persistir los items en el servidor en batches
      const currentUser2 = this.sessionService.getCurrentUser();
      if (currentUser2 && currentUser2.idUsuario) {
        const idCliente = currentUser2.idUsuario;
        const itemsPayload = selectedTickets
          .filter(t => t.quantity > 0)
          .map(t => ({ idTipoTicket: (t as any).id || (t as any).idTipoTicket, cantidad: t.quantity }));

        try {
          await this.persistItemsInBatches(itemsPayload, localIds, idCliente);
        } catch (err) {
          try { localIds.forEach(id => this.cartService.removeLocalOnly(id)); } catch(e) { console.warn('No se pudieron revertir items locales tras error de servidor (buyNow)', e); }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo sincronizar el carrito en el servidor. Intenta de nuevo.' });
          this.proceedToPurchase(selectedTickets);
          return;
        }
        // Continuar con la compra
        this.proceedToPurchase(selectedTickets);
      } else {
        // No autenticado: proceder a compra con items en memoria
        this.proceedToPurchase(selectedTickets);
      }
      })();
    }

    private proceedToPurchase(selectedTickets: TicketType[]) {
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
      // El mapa se inicializará después de cargar los datos del local en actualizarDatosLocal()
      // Solo inicializar si no hay ID de evento (modo estático)
      if (!this.eventoId) {
        setTimeout(() => {
          this.initializeMap();
        }, 100);
      }
    }

    private initializeMap(): void {
      // Verificar si Google Maps está disponible
      if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps no está disponible');
        this.mapLoading = false;
        return;
      }

      if (!this.mapaElement) {
        console.error('Elemento del mapa no encontrado');
        this.mapLoading = false;
        return;
      }

      if (!this.address || this.address.trim() === '') {
        console.error('No hay dirección disponible para mostrar en el mapa');
        this.mapLoading = false;
        return;
      }

      try {
        const mapElement = this.mapaElement.nativeElement;

        // Inicializar el geocoder
        this.geocoder = new google.maps.Geocoder();

        // Construir dirección completa para buscar
        const direccionCompleta = `${this.address}, Perú`;

        // Usar Geocoding para convertir la dirección en coordenadas
        this.geocoder.geocode({ address: direccionCompleta }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;

            // Configuración del mapa (solo lectura, sin controles de edición)
            const mapOptions = {
              center: location,
              zoom: 16,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: true,
              fullscreenControl: true,
              draggable: true, // Permitir arrastrar para ver alrededor
              scrollwheel: true, // Permitir zoom con scroll
              disableDoubleClickZoom: false,
              gestureHandling: 'cooperative' // Requiere Ctrl+scroll para zoom
            };

            // Crear el mapa
            this.map = new google.maps.Map(mapElement, mapOptions);

            // Crear marcador en la ubicación del local (NO arrastreable)
            this.marker = new google.maps.Marker({
              position: location,
              map: this.map,
              draggable: false, // NO permitir arrastrar el marcador
              title: this.venue || 'Ubicación del evento',
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(40, 40)
              }
            });

            // Crear InfoWindow con información del local y evento
            const infoWindowContent = `
              <div style="padding: 10px; max-width: 250px;">
                <h4 style="margin: 0 0 8px 0; color: #1976d2; font-size: 16px;">
                  📍 ${this.venue}
                </h4>
                <p style="margin: 4px 0; color: #555; font-size: 13px;">
                  <strong>Dirección:</strong><br>
                  ${this.address}
                </p>
                <p style="margin: 4px 0; color: #555; font-size: 13px;">
                  <strong>Evento:</strong><br>
                  ${this.title}
                </p>
                <p style="margin: 8px 0 0 0; color: #888; font-size: 11px;">
                  <i>📅 ${this.date} - ${this.time}</i>
                </p>
              </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent
            });

            // Mostrar InfoWindow automáticamente
            infoWindow.open(this.map, this.marker);

            // Al hacer clic en el marcador, mostrar el InfoWindow
            this.marker.addListener('click', () => {
              infoWindow.open(this.map, this.marker);
            });

            // Ocultar indicador de carga
            setTimeout(() => {
              this.mapLoading = false;
            }, 500);

            console.log('Mapa de Google Maps inicializado correctamente con dirección:', direccionCompleta);

          } else {
            console.error('Geocoding falló:', status);
            this.mapLoading = false;
            this.messageService.add({
              severity: 'warn',
              summary: 'Ubicación no encontrada',
              detail: 'No se pudo localizar la dirección en el mapa'
            });
          }
        });

      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        this.mapLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el mapa del local'
        });
      }
    }
}
