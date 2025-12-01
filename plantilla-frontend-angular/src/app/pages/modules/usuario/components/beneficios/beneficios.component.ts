import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiosService } from '../../services/beneficios.service';
import { BeneficiosResponse } from '../../interfaces/beneficios/beneficios.interface';
import { HistorialPuntosService } from '../../services/historial-puntos.service';
import { HistorialPuntosResponse, Datum } from '../../interfaces/beneficios/historial-puntos.interface';
import { HistorialComprasService } from '../../services/historial-compras.service';
import { ResumenCompras } from '../../interfaces/beneficios/historial-compras.interface';
import { LoginService } from '../../../../../core/services/login.service';
import { LoadingService } from '../../../../../shared/services/loading.service';

type Tier = 'BRONCE' | 'PLATA' | 'ORO';
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
  tier: Tier = 'BRONCE';  // nivel calculado por historial de compras
  totalEntradas = 0; // Nueva propiedad para mostrar el total de entradas
  resumenCompras: ResumenCompras = { // Nueva propiedad para el resumen
    totalOrdenes: 0,
    totalEntradas: 0,
    montoTotal: 0
  };

  // Sin selección por defecto en "Nuestras Membresías"
  selectedTier: Tier | null = null;

  // Puntos - ahora dinámicos
  points = 0;
  targetNextTier = 500; // Target para el siguiente tier
  isLoadingPoints = false;

  // Propiedades para el sistema de entradas
  progressToOro = 0; // Progreso hacia el siguiente tier (ORO es el máximo)

  // Progreso formateado para mostrar en la barra (máximo 2 decimales)
  get progressToOroFormatted(): number {
    return Math.round(this.progressToOro * 100) / 100;
  }

  // Reglas de canje fijas por tier
  get equivalenciaPuntos(): string {
    switch (this.tier) {
      case 'BRONCE':
        return '1 punto equivale a S/ 0.50';
      case 'PLATA':
        return '2 puntos equivalen a S/ 0.50';
      case 'ORO':
        return '3 puntos equivalen a S/ 0.50';
      default:
        return '1 punto equivale a S/ 0.50';
    }
  }

  // Posición del marcador sobre el banner (compensa el ancho del marcador)
  get progressMarkerLeft(): string {
    return `calc(${this.progressToOro}% - 10px)`;
  }

  // Lingotes
  memberships = [
    { id: 'BRONCE' as const, label: 'Bronce', image: '/img/membresias/lingotes/bronce.jpg' },
    { id: 'PLATA'  as const, label: 'Plata',  image: '/img/membresias/lingotes/plata.jpg'  },
    { id: 'ORO'    as const, label: 'Oro',    image: '/img/membresias/lingotes/oro.jpg'    },
  ];

  // Subtítulo/rango por tier - actualizado con números reales
  tierRange: Record<Tier, string> = {
    BRONCE: 'de 0 a 30 entradas',
    PLATA:  'de 31 a 50 entradas',
    ORO:    'más de 50 entradas',
  };

  // Beneficios (mock)
  benefitsByTier: Record<Tier, string[]> = {
    BRONCE: [
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
    private historialComprasService: HistorialComprasService,
    private loginService: LoginService,
    private loadingService: LoadingService
  ) {
    // Deep-link opcional: ?tier=ORO
    const qpTier = (this.route.snapshot.queryParamMap.get('tier') as Tier) || null;
    if (qpTier && ['BRONCE','PLATA','ORO'].includes(qpTier)) {
      this.selectedTier = qpTier;
    }
  }

  ngOnInit(): void {
    // Cargar datos del usuario autenticado
    this.cargarDatosUsuario();
    // Cargar tier basado en historial de compras
    this.cargarTierPorHistorialCompras();
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
   * Carga el tier del usuario basado en su historial de compras
   */
  private cargarTierPorHistorialCompras(): void {
    console.log('🎯 Calculando tier basado en historial de compras...');

    this.historialComprasService.getTierPorHistorialCompras()
      .subscribe({
        next: (resultado) => {
          this.tier = resultado.tier;
          this.totalEntradas = resultado.totalEntradas;
          this.resumenCompras = resultado.resumen;

          console.log('✅ Tier calculado:', {
            tier: this.tier,
            totalEntradas: this.totalEntradas,
            resumen: this.resumenCompras
          });

          // Actualizar el progreso hacia el siguiente tier
          this.updateProgressToNextTier();
        },
        error: (error) => {
          console.error('❌ Error al calcular tier por historial de compras:', error);
          // Usar valores por defecto en caso de error
          this.tier = 'BRONCE';
          this.totalEntradas = 0;
          this.resumenCompras = {
            totalOrdenes: 0,
            totalEntradas: 0,
            montoTotal: 0
          };
        }
      });
  }

  /**
   * Actualiza el progreso hacia el siguiente tier basado en entradas compradas
   */
  private updateProgressToNextTier(): void {
    let currentTarget = 0;
    let nextTarget = 0;

    switch (this.tier) {
      case 'BRONCE':
        currentTarget = 0;
        nextTarget = 31; // Para alcanzar PLATA
        break;
      case 'PLATA':
        currentTarget = 31;
        nextTarget = 51; // Para alcanzar ORO
        break;
      case 'ORO':
        // Ya está en el tier máximo
        currentTarget = 51;
        nextTarget = 51;
        break;
    }

    // Calcular progreso
    if (this.tier === 'ORO') {
      this.progressToOro = 100; // Ya alcanzó el máximo
      this.targetNextTier = this.totalEntradas; // Mostrar su total actual
    } else {
      const progress = Math.min(((this.totalEntradas - currentTarget) / (nextTarget - currentTarget)) * 100, 100);
      this.progressToOro = Math.max(progress, 0);
      this.targetNextTier = nextTarget;
    }

    console.log('📈 Progreso actualizado:', {
      tier: this.tier,
      totalEntradas: this.totalEntradas,
      currentTarget,
      nextTarget,
      progress: this.progressToOro
    });
  }

  /**
   * Carga los puntos del cliente autenticado desde el servicio
   * El endpoint usa el token de autenticación para identificar automáticamente al cliente
   */
  private cargarPuntosCliente(): void {
    this.loadingService.show();
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
          this.loadingService.hide();
          this.isLoadingPoints = false;
        },
        error: (error) => {
          console.error('Error al cargar puntos del cliente autenticado:', error);
          this.handlePuntosError('Error de conexión al cargar puntos');
          this.loadingService.hide();
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
    if (points >= 200) return 'ORO'; // ORO es el tier máximo
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
      console.log('🔄 Refrescando puntos del cliente...');
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
