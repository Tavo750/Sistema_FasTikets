import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuditoriaRecord, AuditoriaResponse } from '../../interfaces/auditoria/auditoria.interface';
import { Subscription } from 'rxjs';
import { MessageService as CustomMessageService } from '../../../../../core/services/message.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Se usa la interfaz AuditoriaRecord del archivo de interfaces

@Component({
  selector: 'app-auditoria',
  standalone: false,
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css'],
  providers: [MessageService]
})
export class AuditoriaComponent implements OnInit, OnDestroy {

  auditorias: any[] = []; // Ahora se carga dinámicamente desde el backend
  auditoriasFiltered: any[] = [];
  isLoading: boolean = false;
  filtroUsuario: string | null = null;
  filtroTipoEvento: string | null = null;
  totalRecords: number = 0;
  private subscription: Subscription = new Subscription();

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

  constructor(
    private messageService: MessageService,
    private auditoriaService: AuditoriaService,
    private customMessageService: CustomMessageService
  ) { }

  ngOnInit(): void {
    this.cargarRegistrosAuditoria();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Método para refrescar la lista de auditoría
   */
  recargarDatos(): void {
    this.cargarRegistrosAuditoria();
  }

  /**
   * Carga los registros de auditoría desde el backend
   */
  cargarRegistrosAuditoria(): void {
    this.isLoading = true;
    this.customMessageService.info('Cargando auditoría...', 'Cargando');

    this.auditoriaService.getListarAuditoria().subscribe({
      next: (response: AuditoriaResponse) => {
        console.log('Respuesta del servicio:', response);

        // Verificar si la respuesta es exitosa y tiene datos
        if (response && response.ok && response.data) {
          this.auditorias = this.transformarDatosAuditoria(response.data);
          this.auditoriasFiltered = [...this.auditorias];
          this.totalRecords = this.auditorias.length;

          // Actualizar opciones de filtros dinámicamente
          this.actualizarOpcionesFiltros();

          if (this.auditorias.length > 0) {
            this.customMessageService.success(
              `Se cargaron ${this.auditorias.length} registros de auditoría correctamente`,
              'Carga completada'
            );
          } else {
            this.customMessageService.info('No se encontraron registros de auditoría', 'Sin resultados');
          }
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          this.customMessageService.info('No se encontraron registros de auditoría', 'Sin resultados');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar auditoría:', error);
        this.customMessageService.error(
          'Error al cargar los registros de auditoría. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.isLoading = false;
      }
    });
  }

  /**
   * Transforma los datos del backend al formato esperado por la vista
   */
  private transformarDatosAuditoria(data: AuditoriaRecord[]): any[] {
    return data.map(record => ({
      idAudit: record.idAudit,
      fechaHora: new Date(record.fechaHora), // Convertir a Date para ordenamiento
      fechaHoraString: this.formatearFecha(record.fechaHora), // String formateado para mostrar
      usuario: record.adminEmail || 'N/A',
      accion: record.accion || 'N/A',
      descripcion: record.detalle || 'Sin descripción',
      modulo: record.modulo || 'N/A'
    }));
  }

  /**
   * Formatea una fecha ISO string al formato local español
   */
  private formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Actualiza las opciones de filtros basándose en los datos cargados
   */
  private actualizarOpcionesFiltros(): void {
    // Extraer usuarios únicos
    const usuariosUnicos = [...new Set(this.auditorias.map(a => a.usuario))].filter(u => u && u !== 'N/A');
    this.usuarioOptions = [
      { label: 'Todos los usuarios', value: null },
      ...usuariosUnicos.map(usuario => ({ label: usuario, value: usuario }))
    ];

    // Extraer acciones únicas
    const accionesUnicas = [...new Set(this.auditorias.map(a => a.accion))].filter(a => a && a !== 'N/A');
    this.tipoEventoOptions = [
      { label: 'Todos los eventos', value: null },
      ...accionesUnicas.map(accion => ({ label: accion, value: accion }))
    ];
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
    
    // Actualizar el total de registros para la paginación
    this.totalRecords = this.auditoriasFiltered.length;
  }

  limpiarFiltros(): void {
    this.filtroUsuario = null;
    this.filtroTipoEvento = null;
    this.auditoriasFiltered = [...this.auditorias];
    this.totalRecords = this.auditorias.length;
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

  /**
   * Exporta los datos de auditoría filtrados a PDF - Versión simplificada
   */
  exportarPDF(): void {
    try {
      // Mostrar mensaje de inicio
      this.customMessageService.info('Generando reporte PDF...', 'Exportando');

      // Crear documento simple
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(16);
      doc.text('Reporte de Auditoría', 20, 20);
      
      // Fecha
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 35);
      
      // Total de registros
      doc.text(`Total de registros: ${this.auditoriasFiltered.length}`, 20, 45);
      
      // Información de filtros si existen
      let yPosition = 55;
      if (this.filtroUsuario || this.filtroTipoEvento) {
        doc.text('Filtros aplicados:', 20, yPosition);
        yPosition += 8;
        if (this.filtroUsuario) {
          doc.text(`- Usuario: ${this.filtroUsuario}`, 25, yPosition);
          yPosition += 6;
        }
        if (this.filtroTipoEvento) {
          doc.text(`- Tipo de evento: ${this.filtroTipoEvento}`, 25, yPosition);
          yPosition += 6;
        }
        yPosition += 5;
      }
      
      // Usar autoTable para crear la tabla
      autoTable(doc, {
        startY: yPosition,
        head: [['Fecha/Hora', 'Usuario', 'Acción', 'Descripción']],
        body: this.auditoriasFiltered.map(auditoria => [
          auditoria.fechaHoraString,
          auditoria.usuario,
          auditoria.accion,
          auditoria.descripcion.length > 50 ? 
            auditoria.descripcion.substring(0, 47) + '...' : 
            auditoria.descripcion
        ]),
        theme: 'striped',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 50 },
          2: { cellWidth: 30 },
          3: { cellWidth: 60 }
        }
      });
      
      // Guardar
      const timestamp = new Date().getTime();
      const filtroTexto = this.filtroUsuario || this.filtroTipoEvento ? '_filtrado' : '';
      doc.save(`auditoria_${timestamp}${filtroTexto}.pdf`);
      
      // Mensaje de éxito
      this.customMessageService.success(
        'PDF generado y descargado correctamente',
        'Exportación exitosa'
      );
      
    } catch (error) {
      console.error('Error detallado:', error);
      
      // Implementación de respaldo usando window.print()
      this.exportarAlternativo();
    }
  }

  /**
   * Método alternativo de exportación usando print
   */
  private exportarAlternativo(): void {
    try {
      // Crear ventana con los datos
      const contenido = this.generarContenidoHTML();
      const ventana = window.open('', '_blank');
      
      if (ventana) {
        ventana.document.write(contenido);
        ventana.document.close();
        
        // Esperar un momento y luego imprimir
        setTimeout(() => {
          ventana.print();
          ventana.close();
        }, 500);
        
        this.customMessageService.success(
          'Se abrirá el diálogo de impresión para generar el PDF',
          'Exportación alternativa'
        );
      } else {
        throw new Error('No se pudo abrir ventana de impresión');
      }
    } catch (error) {
      console.error('Error en exportación alternativa:', error);
      this.customMessageService.error(
        'No se pudo exportar el PDF. Verifique que no esté bloqueando ventanas emergentes.',
        'Error de exportación'
      );
    }
  }

  /**
   * Genera contenido HTML para impresión
   */
  private generarContenidoHTML(): string {
    const filtrosTexto = this.filtroUsuario || this.filtroTipoEvento ? 
      `<p><strong>Filtros aplicados:</strong> Usuario: ${this.filtroUsuario || 'Todos'}, Evento: ${this.filtroTipoEvento || 'Todos'}</p>` : '';
    
    const filasTabla = this.auditoriasFiltered.map(auditoria => 
      `<tr>
        <td>${auditoria.fechaHoraString}</td>
        <td>${auditoria.usuario}</td>
        <td>${auditoria.accion}</td>
        <td>${auditoria.descripcion}</td>
      </tr>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Auditoría</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>Reporte de Auditoría del Sistema</h1>
        <p><strong>Fecha de generación:</strong> ${new Date().toLocaleString('es-ES')}</p>
        ${filtrosTexto}
        <p><strong>Total de registros:</strong> ${this.auditoriasFiltered.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            ${filasTabla}
          </tbody>
        </table>
        
        <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #666;">
          FasTikets - Sistema de Gestión de Eventos
        </div>
      </body>
      </html>
    `;
  }
}
