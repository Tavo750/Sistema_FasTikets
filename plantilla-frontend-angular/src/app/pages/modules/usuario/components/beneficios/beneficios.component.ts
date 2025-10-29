import { Component } from '@angular/core';
import { Router } from '@angular/router';

type Tier = 'BRONCE' | 'PLATA' | 'ORO' | 'BLACK';
type EstadoPuntos = 'Vigentes' | 'Canjeado';
interface Membership {
  id: Tier;
  label: string;
  image: string;   // ruta a tu asset (svg/png)
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
  // ✅ usa styleUrls (plural)
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})







export class BeneficiosComponent {
  userName = 'PAPS';
  tier: Tier = 'PLATA';

  // Datos de puntos (mockeado por ahora)
  points = 190;
  targetBlack = 500; // meta para llegar a BLACK
row: any;

  get progressToBlack(): number {
    return Math.min(Math.round((this.points / this.targetBlack) * 100), 100);
  }

  memberships= [
    { id: 'BRONCE', label: 'Bronce', image: '/img/membresias/lingotes/bronce.jpg' },
    { id: 'PLATA',  label: 'Plata',  image: '/img/membresias/lingotes/plata.jpg'  },
    { id: 'ORO',    label: 'Oro',    image: '/img/membresias/lingotes/oro.jpg'    },
  ];

  constructor(private router: Router) {}


  showHistory = false;

  history: MovimientoPuntos[] = [
    { fechaAdquisicion: '15/09/2025', fechaVencimiento: '15/09/2026', estado: 'Vigentes',  fechaCanje: '-',           cantidad: 50 },
    { fechaAdquisicion: '16/09/2025', fechaVencimiento: '15/09/2026', estado: 'Vigentes',  fechaCanje: '-',           cantidad: 50 },
    { fechaAdquisicion: '17/09/2025', fechaVencimiento: '15/09/2026', estado: 'Vigentes',  fechaCanje: '-',           cantidad: 50 },
    { fechaAdquisicion: '15/09/2025', fechaVencimiento: '15/09/2026', estado: 'Canjeado',  fechaCanje: '19/09/2025',  cantidad: 50 },
    { fechaAdquisicion: '15/09/2025', fechaVencimiento: '05/05/2026', estado: 'Canjeado',  fechaCanje: '15/09/2025',  cantidad: 50 },
  ];

  viewPointsHistory() {
    this.showHistory = true;
  }
  closeHistory() {
    this.showHistory = false;
  }
}

