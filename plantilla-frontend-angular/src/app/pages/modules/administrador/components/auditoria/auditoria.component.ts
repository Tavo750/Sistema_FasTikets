import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

interface AuditoriaRecord {
  fechaHora: string;
  usuario: string;
  accion: string;
  descripcion: string;
  ip: string;
  navegador: string;
  sistemaOperativo: string;
}

@Component({
  selector: 'app-auditoria',
  standalone: false,
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css'],
  providers: [MessageService]
})
export class AuditoriaComponent implements OnInit {

  auditorias: AuditoriaRecord[] = [
    {
      fechaHora: '2025-09-16 14:28:43',
      usuario: 'luisenrique@alonso.pe',
      accion: 'Crear Evento',
      descripcion: 'Evento: Orquesta Rock Lima - Fecha: 16 Sep 2025 19:30:000 - Local: Arenas Norte',
      ip: '190.12.24.16',
      navegador: 'Chrome',
      sistemaOperativo: 'Windows 11'
    },
    {
      fechaHora: '2025-09-16 15:42:02',
      usuario: 'ana@empresa.com',
      accion: 'Comprar Entrada',
      descripcion: 'Evento: Orquesta Rock Lima - 2 eventos del  día 16 Sep 2025 19:30:000',
      ip: '190.12.23.05',
      navegador: 'Chrome',
      sistemaOperativo: 'Windows 11'
    },
    {
      fechaHora: '2025-09-16 14:28:43',
      usuario: 'luisenrique@alonso.pe',
      accion: 'Crear Evento',
      descripcion: 'Evento: Orquesta Rock Lima - Fecha: 16 Sep 2025 19:30:000 - Local: Arenas Norte',
      ip: '190.12.24.16',
      navegador: 'Chrome',
      sistemaOperativo: 'Windows 11'
    },
    {
      fechaHora: '2025-09-16 15:55:20',
      usuario: 'jose@empresa.com',
      accion: 'Comprar Entrada',
      descripcion: 'Evento: Orquesta Rock Lima - 3 eventos del día 16 Sep 2025 19:30:000',
      ip: '190.12.29.20',
      navegador: 'Chrome',
      sistemaOperativo: 'Windows 11'
    },
    {
      fechaHora: '2025-09-16 14:28:43',
      usuario: 'fredy@empresa.com',
      accion: 'Crear Evento',
      descripcion: 'Evento: Orquesta Rock Lima - Fecha: 16 Sep 2025 19:30:000 - Local: Arenas Norte',
      ip: '190.12.24.16',
      navegador: 'Chrome',
      sistemaOperativo: 'Windows 11'
    }
  ];

  auditoriasFiltered: AuditoriaRecord[] = [];
  filtroUsuario: string | null = null;
  filtroTipoEvento: string | null = null;

  usuarioOptions = [
    { label: 'Todos los usuarios', value: null },
    { label: 'luisenrique@alonso.pe', value: 'luisenrique@alonso.pe' },
    { label: 'ana@empresa.com', value: 'ana@empresa.com' },
    { label: 'jose@empresa.com', value: 'jose@empresa.com' },
    { label: 'fredy@empresa.com', value: 'fredy@empresa.com' }
  ];

  tipoEventoOptions = [
    { label: 'Todos los eventos', value: null },
    { label: 'Crear Evento', value: 'Crear Evento' },
    { label: 'Comprar Entrada', value: 'Comprar Entrada' },
    { label: 'Editar Evento', value: 'Editar Evento' },
    { label: 'Eliminar Evento', value: 'Eliminar Evento' },
    { label: 'Login', value: 'Login' },
    { label: 'Logout', value: 'Logout' }
  ];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.auditoriasFiltered = [...this.auditorias];
  }

  filtrar(): void {
    this.auditoriasFiltered = this.auditorias.filter(auditoria => {
      let matches = true;

      // Filtro por usuario
      if (this.filtroUsuario && auditoria.usuario !== this.filtroUsuario) {
        matches = false;
      }

      // Filtro por tipo de evento
      if (this.filtroTipoEvento && auditoria.accion !== this.filtroTipoEvento) {
        matches = false;
      }

      return matches;
    });
  }

  limpiarFiltros(): void {
    this.filtroUsuario = null;
    this.filtroTipoEvento = null;
    this.auditoriasFiltered = [...this.auditorias];
  }

  getAccionSeverity(accion: string): 'success' | 'info' | 'warning' | 'danger' {
    const accionMap: { [key: string]: 'success' | 'info' | 'warning' | 'danger' } = {
      'Crear Evento': 'success',
      'Comprar Entrada': 'info',
      'Editar Evento': 'warning',
      'Eliminar Evento': 'danger',
      'Login': 'info',
      'Logout': 'info'
    };
    return accionMap[accion] || 'info';
  }

  exportarPDF(): void {
    // Simular proceso de exportación
    this.messageService.add({
      severity: 'success',
      summary: 'Descarga exitosa',
      detail: 'Archivo con los registros de auditoría descargado correctamente',
      life: 4000
    });
    
    // Aquí se conectará con el backend para la exportación real
    console.log('Datos para exportar:', this.auditoriasFiltered);
  }
}
