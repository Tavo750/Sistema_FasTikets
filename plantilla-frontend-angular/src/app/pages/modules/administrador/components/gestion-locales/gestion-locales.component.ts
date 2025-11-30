import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';
import { MessageService as CustomMessageService } from '../../../../../core/services/message.service';
import { ListarLocalesResponse } from '../../interfaces/gestion-locales/local.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';

interface Local {
  idLocal: number;
  nombre: string;
  direccion: string;
  nombreDistrito: string;
  aforoTotal: number;
  activo: boolean;
  fechaCreacion?: Date;
}

@Component({
  selector: 'app-gestion-locales',
  standalone: false,
  templateUrl: './gestion-locales.component.html',
  styleUrls: ['./gestion-locales.component.css']
})

export class GestionLocalesComponent implements OnInit {
  locales: Local[] = [];
  filteredLocales: Local[] = [];
  globalFilterValue: string = '';
  rows: number = 10;
  first: number = 0;
  isLoading = false;
  isUploading = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private localService: LocalService,
    private customMessageService: CustomMessageService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadLocales();
  }

  loadLocales(): void {
    this.loadingService.show();
    this.isLoading = true;
    this.customMessageService.info('Cargando locales...', 'Cargando');

    this.localService.getlistarLocales().subscribe({
      next: (response: ListarLocalesResponse) => {
        console.log('Respuesta del servicio:', response);

        // Verificar si la respuesta es exitosa y tiene datos
        if (response && response.ok && response.data) {
          this.locales = response.data;
          this.filteredLocales = [...this.locales];

          if (this.locales.length > 0) {
            this.customMessageService.success(
              `Se cargaron ${this.locales.length} locales correctamente`,
              'Carga completada'
            );
          } else {
            this.customMessageService.info('No se encontraron locales registrados', 'Sin resultados');
          }
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          this.customMessageService.info('No se encontraron locales registrados', 'Sin resultados');
        }

        this.loadingService.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar locales:', error);
        this.customMessageService.error(
          'Error al cargar la lista de locales. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.loadingService.hide();
        this.isLoading = false;

        // Mantener datos de ejemplo en caso de error para pruebas
        this.loadMockData();
      }
    });
  }

  private loadMockData(): void {
    // Datos de ejemplo con la nueva estructura
    this.locales = [
      {
        idLocal: 1,
        nombre: 'Jockey Plaza Centro de Exposiciones',
        direccion: 'Av. Javier Prado 42000',
        nombreDistrito: 'Santiago de Surco',
        aforoTotal: 5000,
        activo: true,
        fechaCreacion: new Date()
      },
      {
        idLocal: 2,
        nombre: 'Mall del Sur',
        direccion: 'Av. Los Lirios 15081',
        nombreDistrito: 'San Juan de Miraflores',
        aforoTotal: 1000,
        activo: true,
        fechaCreacion: new Date()
      },
      {
        idLocal: 3,
        nombre: 'Nombre Genérico',
        direccion: 'Av. Brasil 1450',
        nombreDistrito: 'Jesús María',
        aforoTotal: 200,
        activo: true,
        fechaCreacion: new Date()
      }
    ];
    this.filteredLocales = [...this.locales];
  }

  applyGlobalFilter(event: any): void {
    this.globalFilterValue = event.target.value;
    this.filteredLocales = this.locales.filter(local =>
      local.nombre.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      local.nombreDistrito.toLowerCase().includes(this.globalFilterValue.toLowerCase()) ||
      this.getEstadoLocal(local.activo).toLowerCase().includes(this.globalFilterValue.toLowerCase())
    );
  }

  editarLocal(id: number): void {
    this.router.navigate(['/administrador/gestionLocales/editarLocal', id]);
  }

  confirmarEliminacion(local: Local, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Está seguro que desea eliminar el local "${local.nombre}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.eliminarLocal(local.idLocal);
      }
    });
  }

  eliminarLocal(id: number): void {
    // Encontrar el local que se va a eliminar para mostrar su nombre en los mensajes
    const localAEliminar = this.locales.find(local => local.idLocal === id);
    const nombreLocal = localAEliminar?.nombre || 'el local';

    this.isLoading = true;
    this.customMessageService.info(`Eliminando ${nombreLocal}...`, 'Procesando');

    // Llamar al servicio para eliminar el local
    this.localService.deleteLocal(id).subscribe({
      next: (response) => {
        console.log('Local eliminado:', response);

        if (response.ok) {
          // Actualizar la lista local eliminando el local
          this.locales = this.locales.filter(local => local.idLocal !== id);
          this.filteredLocales = this.filteredLocales.filter(local => local.idLocal !== id);

          this.customMessageService.success(
            `${nombreLocal} ha sido eliminado correctamente`,
            'Local eliminado'
          );
        } else {
          this.customMessageService.error(
            response.mensaje || 'Error al eliminar el local',
            'Error'
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al eliminar el local:', error);
        this.customMessageService.error(
          'Error al eliminar el local. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.isLoading = false;
      }
    });
  }

  crearNuevoLocal(): void {
    this.router.navigate(['/administrador/gestionLocales/crearLocal']);
  }

  /**
   * Método para refrescar la lista de locales
   */
  refrescarLista(): void {
    this.loadLocales();
  }

  /**
   * Método getter para mostrar el estado del local en la vista
   */
  getEstadoLocal(activo: boolean): string {
    return activo ? 'HABILITADO' : 'DESHABILITADO';
  }

  /**
   * Método getter para obtener la clase CSS del estado
   */
  getEstadoClass(activo: boolean): string {
    return activo ? 'estado-habilitado' : 'estado-deshabilitado';
  }

  /**
   * Maneja la selección de archivo Excel para carga masiva
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    // Validar que sea un archivo Excel
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      this.customMessageService.error(
        'Por favor, seleccione un archivo Excel válido (.xlsx o .xls)',
        'Formato no válido'
      );
      event.target.value = ''; // Limpiar el input
      return;
    }

    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      this.customMessageService.error(
        'El archivo no debe superar los 10MB',
        'Archivo muy grande'
      );
      event.target.value = ''; // Limpiar el input
      return;
    }

    // Recargar la lista de locales para tener los datos más actualizados antes de validar
    this.loadingService.show();
    this.localService.getlistarLocales().subscribe({
      next: (response) => {
        if (response && response.ok && response.data) {
          this.locales = response.data;
          this.filteredLocales = [...this.locales];
        }
        this.loadingService.hide();

        // Validar el formato del archivo Excel después de actualizar la lista
        this.validarFormatoExcel(file, event);
      },
      error: (error) => {
        console.error('Error al actualizar locales:', error);
        this.loadingService.hide();

        // Continuar con la validación aunque falle la actualización
        this.validarFormatoExcel(file, event);
      }
    });
  }

  /**
   * Valida que no haya locales duplicados en el archivo ni con los existentes en el sistema
   */
  private validarLocalesDuplicados(jsonData: any[], headers: string[]): {
    hayDuplicadosEnArchivo: boolean;
    hayDuplicadosEnSistema: boolean;
    duplicadosEnArchivo: string[];
    duplicadosEnSistema: string[];
    localesNuevos: number;
  } {
    // Obtener el índice de la columna "Nombre"
    const nombreIndex = headers.indexOf('Nombre');

    if (nombreIndex === -1) {
      return {
        hayDuplicadosEnArchivo: false,
        hayDuplicadosEnSistema: false,
        duplicadosEnArchivo: [],
        duplicadosEnSistema: [],
        localesNuevos: jsonData.length - 1
      };
    }

    // Extraer los nombres del archivo (saltando la primera fila de cabeceras)
    const nombresEnArchivo: string[] = [];
    const duplicadosEnArchivo: string[] = [];
    const nombresCounts = new Map<string, number>();
    const nombresVistosSet = new Set<string>();

    for (let i = 1; i < jsonData.length; i++) {
      const fila = jsonData[i] as any[];
      const nombre = fila[nombreIndex];

      if (nombre && typeof nombre === 'string' && nombre.trim() !== '') {
        const nombreOriginal = nombre.trim();
        const nombreNormalizado = nombreOriginal.toLowerCase();

        // Verificar duplicados dentro del archivo
        const count = nombresCounts.get(nombreNormalizado) || 0;
        nombresCounts.set(nombreNormalizado, count + 1);

        if (count > 0) {
          // Ya existe en el archivo, es duplicado
          if (!nombresVistosSet.has(nombreNormalizado)) {
            duplicadosEnArchivo.push(nombreOriginal);
            nombresVistosSet.add(nombreNormalizado);
          }
        }

        nombresEnArchivo.push(nombreOriginal);
      }
    }

    // Verificar duplicados con los locales existentes en el sistema
    const localesExistentes = this.locales.map(local => local.nombre.trim().toLowerCase());
    const duplicadosEnSistema: string[] = [];

    nombresEnArchivo.forEach(nombre => {
      const nombreNormalizado = nombre.toLowerCase();
      if (localesExistentes.includes(nombreNormalizado)) {
        if (!duplicadosEnSistema.includes(nombre)) {
          duplicadosEnSistema.push(nombre);
        }
      }
    });

    const localesNuevos = nombresEnArchivo.length - duplicadosEnSistema.length;

    return {
      hayDuplicadosEnArchivo: duplicadosEnArchivo.length > 0,
      hayDuplicadosEnSistema: duplicadosEnSistema.length > 0,
      duplicadosEnArchivo,
      duplicadosEnSistema,
      localesNuevos
    };
  }

  /**
   * Valida que el archivo Excel tenga el formato correcto (columnas requeridas)
   */
  private validarFormatoExcel(file: File, event: any): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        // Importar dinámicamente la librería XLSX
        import('xlsx').then((XLSX) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Obtener la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convertir a JSON para obtener las cabeceras
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length === 0) {
            this.customMessageService.error(
              'El archivo Excel está vacío',
              'Archivo inválido'
            );
            event.target.value = '';
            return;
          }

          // Obtener las cabeceras (primera fila)
          const headers = jsonData[0] as string[];

          // Columnas requeridas según el formato
          const columnasRequeridas = [
            'Nombre',
            'Direccion',
            'Aforo Total',
            'Departamento',
            'Provincia',
            'Distrito'
          ];

          // Validar que todas las columnas requeridas estén presentes
          const columnasFaltantes = columnasRequeridas.filter(
            columna => !headers.includes(columna)
          );

          if (columnasFaltantes.length > 0) {
            this.customMessageService.error(
              `El archivo no tiene el formato correcto. Faltan las siguientes columnas: ${columnasFaltantes.join(', ')}`,
              'Formato inválido'
            );
            event.target.value = '';
            return;
          }

          // Validar que haya al menos una fila de datos
          if (jsonData.length < 2) {
            this.customMessageService.error(
              'El archivo no contiene datos de locales para cargar',
              'Sin datos'
            );
            event.target.value = '';
            return;
          }

          // Validar duplicados
          const validacionDuplicados = this.validarLocalesDuplicados(jsonData, headers);

          if (validacionDuplicados.hayDuplicadosEnArchivo) {
            this.customMessageService.error(
              `El archivo contiene nombres de locales duplicados: ${validacionDuplicados.duplicadosEnArchivo.join(', ')}. Por favor, elimine los duplicados del archivo e intente nuevamente.`,
              'Duplicados en archivo'
            );
            event.target.value = '';
            return;
          }

          if (validacionDuplicados.hayDuplicadosEnSistema) {
            // Mostrar error y no permitir continuar
            const mensajeDuplicados = validacionDuplicados.duplicadosEnSistema.length > 5
              ? `${validacionDuplicados.duplicadosEnSistema.slice(0, 5).join(', ')} y ${validacionDuplicados.duplicadosEnSistema.length - 5} más`
              : validacionDuplicados.duplicadosEnSistema.join(', ');

            this.customMessageService.error(
              `Los siguientes locales ya existen en el sistema: ${mensajeDuplicados}. Por favor, elimínelos del archivo Excel e intente nuevamente.`,
              'Locales duplicados'
            );
            event.target.value = '';
            return;
          }

          // Si todo está correcto, mostrar confirmación
          this.confirmationService.confirm({
            message: `¿Desea cargar el archivo "${file.name}" con ${jsonData.length - 1} local(es)?`,
            header: 'Confirmar carga masiva',
            icon: 'pi pi-upload',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
              this.cargarExcelMasivo(file);
            },
            reject: () => {
              event.target.value = '';
            }
          });

        }).catch((error) => {
          console.error('Error al cargar la librería XLSX:', error);
          this.customMessageService.error(
            'Error al validar el archivo. Por favor, intente nuevamente.',
            'Error de validación'
          );
          event.target.value = '';
        });

      } catch (error) {
        console.error('Error al leer el archivo:', error);
        this.customMessageService.error(
          'Error al leer el archivo Excel. Verifique que el archivo no esté corrupto.',
          'Error de lectura'
        );
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      this.customMessageService.error(
        'Error al leer el archivo. Por favor, intente nuevamente.',
        'Error de lectura'
      );
      event.target.value = '';
    };

    reader.readAsArrayBuffer(file);
  }

  /**
   * Realiza la carga masiva de locales desde un archivo Excel
   */
  private cargarExcelMasivo(file: File): void {
    this.isUploading = true;
    this.loadingService.show();
    this.customMessageService.info('Procesando archivo Excel...', 'Cargando');

    this.localService.postCargaMasivaLocales(file).subscribe({
      next: (response) => {
        console.log('Respuesta de carga masiva:', response);

        if (response.ok) {
          this.customMessageService.success(
            response.mensaje || 'Locales cargados correctamente',
            'Carga exitosa'
          );

          // Recargar la lista de locales
          this.loadLocales();
        } else {
          this.customMessageService.error(
            response.mensaje || 'Error al procesar el archivo',
            'Error'
          );
        }

        this.isUploading = false;
        this.loadingService.hide();

        // Limpiar el input file
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (error) => {
        console.error('Error en carga masiva:', error);
        this.customMessageService.error(
          'Error al cargar el archivo. Por favor, verifique el formato y los datos.',
          'Error de carga'
        );

        this.isUploading = false;
        this.loadingService.hide();

        // Limpiar el input file
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    });
  }
}
