import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
export class BeneficiosComponent {

  userName = 'PAPS';
  tier: Tier = 'PLATA';  // nivel real del usuario (solo para saludo)

  // Sin selección por defecto en "Nuestras Membresías"
  selectedTier: Tier | null = null;

  // Puntos
  points = 190;
  targetBlack = 500;

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

  constructor(private router: Router, private route: ActivatedRoute) {
    // Deep-link opcional: ?tier=ORO
    const qpTier = (this.route.snapshot.queryParamMap.get('tier') as Tier) || null;
    if (qpTier && ['BRONCE','PLATA','ORO','BLACK'].includes(qpTier)) {
      this.selectedTier = qpTier;
    }
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
}
