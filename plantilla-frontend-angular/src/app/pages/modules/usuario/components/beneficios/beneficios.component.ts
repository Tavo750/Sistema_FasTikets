import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BeneficiosService } from '../../services/beneficios.service';
import { BeneficiosResponse } from '../../interfaces/beneficios/beneficios.interface';

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

  userName = 'PAPS';
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
      'Descuento del 10% en compras',
      'Acceso a preventas seleccionadas',
      'Soporte estándar',
      'Acumulación de puntos'
    ],
    PLATA: [
      'Descuento del 25% en todas las entradas',
      'Puntos dobles en compras',
      'Acceso exclusivo a pre-ventas',
      'Beneficios especiales en lanzamientos'
    ],
    ORO: [
      'Descuento del 40% en todas las entradas',
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

  // Historial (mock)
  showHistory = false;
  history: MovimientoPuntos[] = [
    { fechaAdquisicion: '15/09/2025', fechaVencimiento: '15/09/2026', estado: 'Vigentes',  fechaCanje: '-',           cantidad: 50 },
    { fechaAdquisicion: '16/09/2025', fechaVencimiento: '15/09/2026', estado: 'Vigentes',  fechaCanje: '-',           cantidad: 50 },
    { fechaAdquisicion: '17/09/2025', fechaVencimiento: '15/09/2026', estado: 'Vigentes',  fechaCanje: '-',           cantidad: 50 },
    { fechaAdquisicion: '15/09/2025', fechaVencimiento: '15/09/2026', estado: 'Canjeado',  fechaCanje: '19/09/2025',  cantidad: 50 },
    { fechaAdquisicion: '15/09/2025', fechaVencimiento: '05/05/2026', estado: 'Canjeado',  fechaCanje: '15/09/2025',  cantidad: 50 },
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private beneficiosService: BeneficiosService
  ) {
    // Deep-link opcional: ?tier=ORO
    const qpTier = (this.route.snapshot.queryParamMap.get('tier') as Tier) || null;
    if (qpTier && ['BRONCE','PLATA','ORO','BLACK'].includes(qpTier)) {
      this.selectedTier = qpTier;
    }
  }

  ngOnInit(): void {
    // Cargar puntos del cliente autenticado al inicializar el componente
    this.cargarPuntosCliente();
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

  viewPointsHistory() { this.showHistory = true; }
  closeHistory() { this.showHistory = false; }

  /**
   * Refresca los puntos del cliente (útil para botón de actualizar)
   */
  refreshPoints(): void {
    if (!this.isLoadingPoints) {
      this.cargarPuntosCliente();
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
}
