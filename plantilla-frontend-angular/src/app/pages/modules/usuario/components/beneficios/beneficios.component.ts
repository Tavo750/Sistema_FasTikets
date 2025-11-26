import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiosService } from '../../services/beneficios.service';
import { BeneficiosResponse } from '../../interfaces/beneficios/beneficios.interface';
import { HistorialPuntosService } from '../../services/historial-puntos.service';
import { HistorialPuntosResponse, Datum } from '../../interfaces/beneficios/historial-puntos.interface';
import { LoginService } from '../../../../../core/services/login.service';

type Tier = 'BRONCE' | 'PLATA' | 'ORO' | 'BLACK';
type EstadoPuntos = 'Vigentes' | 'Canjeado';

interface Membership {
  id: Tier;
  label: string;
  image: string;
}
interface MovimientoPuntos {
  fechaAdquisicion: string;
  fechaVencimiento: string;
  estado: EstadoPuntos;
  fechaCanje: string | '-';
  cantidad: number;
}

@Component({
  selector: 'app-beneficios',
  standalone: false,
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {

  userName = 'Usuario';
  isLoadingUserName = true;
  tier: Tier = 'PLATA';  // nivel real del usuario (solo para saludo)

  // Sin selección por defecto en "Nuestras Membresías"
  selectedTier: Tier | null = null;

  // Puntos - ahora dinámicos
  points = 0;
  targetBlack = 500;
  isLoadingPoints = false;

  get progressToBlack(): number {
    return Math.min(Math.round((this.points / this.targetBlack) * 100), 100);
  }
  // Posición del marcador sobre el banner (compensa el ancho del marcador)
  get progressMarkerLeft(): string {
    return `calc(${this.progressToBlack}% - 10px)`;
  }

  // Lingotes
  memberships = [
    { id: 'BRONCE' as const, label: 'Bronce', image: '/img/membresias/lingotes/bronce.jpg' },
    { id: 'PLATA'  as const, label: 'Plata',  image: '/img/membresias/lingotes/plata.jpg'  },
    { id: 'ORO'    as const, label: 'Oro',    image: '/img/membresias/lingotes/oro.jpg'    },
  ];

  // Subtítulo/rango por tier
  tierRange: Record<Tier, string> = {
    BRONCE: 'hasta 30 entradas',
    PLATA:  'de 30 a 50 entradas',
    ORO:    'más de 50 entradas',
    BLACK:  'beneficios premium'
  };

  // Beneficios (mock)
  benefitsByTier: Record<Tier, string[]> = {
    BRONCE: [
      'Descuento del 0% en compras',
      'Acceso a preventas seleccionadas',
      'Soporte estándar',
      'Acumulación de puntos'
    ],
    PLATA: [
      'Descuento del 5% en todas las entradas',
      'Puntos dobles en compras',
      'Acceso exclusivo a pre-ventas',
      'Beneficios especiales en lanzamientos'
    ],
    ORO: [
      'Descuento del 10% en todas las entradas',
      'Puntos triples en compras',
      'Acceso exclusivo a pre-ventas',
      'Beneficios especiales en lanzamientos',
      'Atención prioritaria'
    ],
    BLACK: [
      'Concierge 24/7',
      'Meet & Greet sujetos a stock',
      'Upgrades automáticos',
      'Invitaciones a eventos VIP'
    ]
  };

  // Historial - ahora dinámico
  showHistory = false;
  history: MovimientoPuntos[] = [];
  historialPuntosRaw: Datum[] = [];
  isLoadingHistory = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private beneficiosService: BeneficiosService,
    private historialPuntosService: HistorialPuntosService,
    private loginService: LoginService
  ) {
    // Deep-link opcional: ?tier=ORO
    const qpTier = (this.route.snapshot.queryParamMap.get('tier') as Tier) || null;
    if (qpTier && ['BRONCE','PLATA','ORO','BLACK'].includes(qpTier)) {
      this.selectedTier = qpTier;
    }
  }

  ngOnInit(): void {
    // Cargar datos del usuario autenticado
    this.cargarDatosUsuario();
    // Cargar puntos del cliente autenticado al inicializar el componente
    this.cargarPuntosCliente();
  }

  /**
   * Carga los datos del usuario autenticado
   */
  private cargarDatosUsuario(): void {
    try {
      const usuario = this.loginService.getCurrentUser();
      const persona = this.loginService.getCurrentPersona();
      
      if (persona && persona.nombreCompleto) {
        // Usar el nombre completo de la persona
        this.userName = persona.nombreCompleto;
      } else if (usuario && usuario.nombPers) {
        // Fallback al nombre del usuario en cacheStore
        this.userName = usuario.nombPers;
      } else {
        // Último fallback
        this.userName = 'Usuario';
      }
      
      console.log('Nombre de usuario cargado:', this.userName);
      this.isLoadingUserName = false;
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.userName = 'Usuario';
      this.isLoadingUserName = false;
    }
  }

  /**
   * Carga los puntos del cliente autenticado desde el servicio
   * El endpoint usa el token de autenticación para identificar automáticamente al cliente
   */
  private cargarPuntosCliente(): void {
    this.isLoadingPoints = true;
    
    this.beneficiosService.getObtenerPuntosDeClienteAutenticado()
      .subscribe({
        next: (response: BeneficiosResponse) => {
          if (response.ok && response.data) {
            // Actualizar puntos y tier dinámicamente
            this.points = response.data.puntosAcumulados;
            this.tier = this.calculateTierByPoints(this.points);
            
            console.log('Cliente ID:', response.data.idCliente);
            console.log('Puntos cargados:', this.points);
            console.log('Tier calculado:', this.tier);
            console.log('Mensaje del servidor:', response.data.mensaje);
            
            // Opcional: mostrar mensaje de éxito
            // this.messageService.success(`Puntos actualizados: ${this.points}`, 'Beneficios');
          } else {
            console.error('Error en la respuesta del servidor:', response.mensaje);
            this.handlePuntosError('Error en la respuesta del servidor');
          }
          this.isLoadingPoints = false;
        },
        error: (error) => {
          console.error('Error al cargar puntos del cliente autenticado:', error);
          this.handlePuntosError('Error de conexión al cargar puntos');
          this.isLoadingPoints = false;
        }
      });
  }

  /**
   * Maneja errores al cargar puntos
   */
  private handlePuntosError(mensaje: string): void {
    this.points = 0;
    this.tier = 'BRONCE';
    // Opcional: mostrar mensaje de error al usuario
    // this.messageService.error(mensaje, 'Error');
  }

  /**
   * Calcula el tier basado en los puntos acumulados
   * @param points Puntos acumulados del cliente
   * @returns Tier correspondiente
   */
  private calculateTierByPoints(points: number): Tier {
    if (points >= 500) return 'BLACK';
    if (points >= 200) return 'ORO';
    if (points >= 100) return 'PLATA';
    return 'BRONCE';
  }

  openTier(t: Tier) {
    this.selectedTier = t;
    //this.router.navigate([], { queryParams: { tier: t }, queryParamsHandling: 'merge' });
  }

  closeTier() {
    this.selectedTier = null;
    //this.router.navigate([], { queryParams: { tier: null }, queryParamsHandling: 'merge' });
  }

  viewPointsHistory() { 
    this.showHistory = true; 
    this.cargarHistorialPuntos();
  }
  
  closeHistory() { 
    this.showHistory = false; 
  }

  /**
   * Refresca los puntos del cliente (útil para botón de actualizar)
   */
  refreshPoints(): void {
    if (!this.isLoadingPoints) {
      this.cargarPuntosCliente();
      // Si el historial está visible, también refrescar
      if (this.showHistory && !this.isLoadingHistory) {
        this.cargarHistorialPuntos();
      }
    }
  }

  /**
   * Getter para mostrar el estado de los puntos
   */
  get puntosDisplay(): string {
    if (this.isLoadingPoints) {
      return 'Cargando...';
    }
    return this.points.toString();
  }

  /**
   * Carga el historial de puntos del cliente autenticado
   */
  private cargarHistorialPuntos(): void {
    this.isLoadingHistory = true;
    
    this.historialPuntosService.getObtenerHistorialDePuntosDeClienteAutenticado()
      .subscribe({
        next: (response: HistorialPuntosResponse) => {
          if (response.ok && response.data) {
            this.historialPuntosRaw = response.data;
            this.history = this.transformarHistorialParaVista(response.data);
            
            console.log('Historial de puntos cargado:', this.historialPuntosRaw);
            console.log('Historial transformado:', this.history);
          } else {
            console.error('Error en la respuesta del historial:', response.mensaje);
            this.history = [];
          }
          this.isLoadingHistory = false;
        },
        error: (error) => {
          console.error('Error al cargar historial de puntos:', error);
          this.history = [];
          this.isLoadingHistory = false;
        }
      });
  }

  /**
   * Transforma los datos del servidor al formato esperado por la vista
   * @param historialRaw Datos raw del servidor
   * @returns Array de MovimientoPuntos para la vista
   */
  private transformarHistorialParaVista(historialRaw: Datum[]): MovimientoPuntos[] {
    return historialRaw.map(item => {
      // Determinar el estado basado en el tipo de transacción y si está activo
      const estado: EstadoPuntos = this.determinarEstadoPunto(item);
      
      // Formatear fechas
      const fechaTransaccion = this.formatearFecha(item.fechaTransaccion);
      const fechaVencimiento = this.formatearFecha(item.fechaVencimiento);
      
      return {
        fechaAdquisicion: fechaTransaccion,
        fechaVencimiento: fechaVencimiento,
        estado: estado,
        fechaCanje: estado === 'Canjeado' ? fechaTransaccion : '-',
        cantidad: Math.abs(item.cantPuntos) // Usar valor absoluto para mostrar
      };
    });
  }

  /**
   * Determina el estado del punto basado en los datos del servidor
   */
  private determinarEstadoPunto(item: Datum): EstadoPuntos {
    // Si no está activo o es una transacción negativa (canje), es "Canjeado"
    if (!item.activo || item.cantPuntos < 0 || item.tipoTransaccion.includes('CANJE')) {
      return 'Canjeado';
    }
    
    // Si la fecha de vencimiento ya pasó, también es considerado como usado
    const fechaVencimiento = new Date(item.fechaVencimiento);
    const hoy = new Date();
    if (fechaVencimiento < hoy) {
      return 'Canjeado';
    }
    
    return 'Vigentes';
  }

  /**
   * Formatea una fecha para mostrar en la vista
   */
  private formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
