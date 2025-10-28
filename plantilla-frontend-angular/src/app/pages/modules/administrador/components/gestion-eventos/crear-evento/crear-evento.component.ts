import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
import { ConfirmPopupService } from '../../../../../../core/services/confirm-popup.service';
import { LocalService } from '../../../services/local.service';
import { EventoService } from '../../../services/evento.service';
import { Data as LocalData } from '../../../interfaces/gestion-locales/local.interface';
import { Data as ZonaData } from '../../../interfaces/gestion-evento/zona-categoria.interface';
interface EstadoOption {
  label: string;
  value: string;
}

interface Evento {
  titulo: string;
  categoria: string;
  descripcion: string;
  dia: string;
  mes: string;
  anio: string;
  hora: string;
  minutos: string;
  horaFinal: string;
  minutosFinal: string;
  estado: string;
  videoPromocional: string;
  banner?: File | null;
  bannerUrl?: string;
  local: string;
  mapaUrl?: string;
  mapaFile?: File | null;
  moneda: string;
}

interface Categoria {
  idZona: number;
  nombre: string;
  aforoMaximo: string;
  aforoDisponible: string;
}
interface CategoriaEntrada {
  nombre: string;
  estado: string;
}

interface TipoEntrada {
  nombre: string;
  categorias: CategoriaEntrada[];
}

interface EntradaAgregada {
  id: number;
  nombre: string;
  precio: number;
  validoPara: string;
  validoParaLabel: string;
  moneda: string;
}

interface LimiteCompra {
  tipo: 'sinLimite' | 'conMaximo';
  maximo: number;
}


@Component({
  selector: 'app-crear-evento',
  standalone: false,
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.css'
})
export class CrearEventoComponent implements OnInit{
  date: Date | undefined;
  time: Date[] | undefined;
  timeFinal: Date[] | undefined;

  // Nuevas propiedades para la sección de publicación
  publicarInmediatamente: boolean = true;
  publicarAPartirDe: boolean = false;
  fechaPublicacion: Date | undefined;

  evento: Evento = {
    titulo: 'Electronic Festival',
    categoria: 'Electrónica',
    descripcion: 'Descripción genérica de concierto porque no ando creativo.',
     dia: '30',
    mes: 'Julio',
    anio: '2025',
    hora: '23',
    minutos: '00',
    horaFinal: '01',
    minutosFinal: '00',
    estado: 'publicado',
    videoPromocional: 'Link completamente normal...',
    banner: null,
    bannerUrl: '',
    local: 'Parque de la exposición',
    mapaUrl: '',
    mapaFile: null,
    moneda: 'Nuevo Sol'

  };

  estadoOptions: EstadoOption[] = [
    { label: 'PUBLICADO', value: 'publicado' },
    { label: 'FINALIZADO', value: 'finalizado' },
    { label: 'AGOTADO', value: 'agotado' }
  ];
  categorias = [
    { label: 'Electrónica', value: 'Electrónica' },
    { label: 'Rock', value: 'Rock' },
    { label: 'Pop', value: 'Pop' },
    { label: 'Jazz', value: 'Jazz' }
  ];
  categoriasLocal: Categoria[] = [];
  entradas: { regular: TipoEntrada; preventa: TipoEntrada } = {
    regular: {
      nombre: 'Regular',
      categorias: []
    },
    preventa: {
      nombre: 'Preventa',
      categorias: []
    }
  };

  limiteCompra: LimiteCompra = {
    tipo: 'sinLimite',
    maximo: 10
  };

  usarMapaDefault: boolean = false;
  usarBannerDefault: boolean = false;

  estadoOption: EstadoOption[] = [
    { label: 'PUBLICADO', value: 'publicado' },
    { label: 'FINALIZADO', value: 'finalizado' },
    { label: 'AGOTADO', value: 'agotado' }
  ];
    estadoEntradaOptions: EstadoOption[] = [
    { label: 'ACTIVO', value: 'activo' },
    { label: 'INACTIVO', value: 'inactivo' },
    { label: 'AGOTADO', value: 'agotado' }
  ];

  // Nuevas propiedades para la sección de entradas
  monedaOptions: EstadoOption[] = [
    { label: 'Nuevo Sol', value: 'PEN' },
    { label: 'Dólar Americano', value: 'USD' },
    { label: 'Euro', value: 'EUR' }
  ];


  entradaNombre: string = '';
  entradaPrecio: number | null = null;
  validoPara: string = '';

  // Array para almacenar las entradas agregadas
  entradasAgregadas: EntradaAgregada[] = [];
  proximoIdEntrada: number = 1;

  // Opciones dinámicas para el dropdown "Válido para" - se llena con datos de getListarZonas
  validoParaOptions: EstadoOption[] = [{ label: 'Seleccionar', value: '' }];

  // Nuevas propiedades para la sección de Local y asientos
  localesOptions: EstadoOption[] = [];
  localesDisponibles: LocalData[] = [];
  cargandoLocales: boolean = false;

  // Propiedades para el manejo de zonas/categorías
  zonasDisponibles: ZonaData[] = [];
  cargandoZonas: boolean = false;

  nuevaCategoria = {
    nombre: '',
    aforoMaximo: null as number | null
  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService,
    private localService: LocalService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    // Cargar locales disponibles
    this.cargarLocales();
    // Las zonas se cargarán cuando se seleccione un local
    // Aquí puedes cargar datos del evento si estás editando
    this.cargarEvento();
  }

  cargarEvento(): void {
    // Simulación de carga de datos
    // En una aplicación real, aquí harías una llamada al servicio
  }

  cargarLocales(): void {
    this.cargandoLocales = true;

    this.localService.getlistarLocales().subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.localesDisponibles = response.data;

          // Transformar los datos para el dropdown
          this.localesOptions = [
            { label: 'Seleccionar local', value: '' },
            ...response.data
              .filter(local => local.activo) // Solo locales activos
              .map(local => ({
                label: `${local.nombre} - ${local.nombreDistrito}`,
                value: local.idLocal.toString()
              }))
          ];
        } else {
          this.messageService.error('No se pudieron cargar los locales', 'Error de Carga');
        }
      },
      error: (error) => {
        this.messageService.error('Error al conectar con el servidor', 'Error de Conexión');

        // Cargar opciones por defecto en caso de error
        this.localesOptions = [
          { label: 'Seleccionar local', value: '' },
          { label: 'No hay locales disponibles', value: '' }
        ];
      },
      complete: () => {
        this.cargandoLocales = false;
      }
    });
  }

  cargarZonas(idLocal?: number): void {
    if (!idLocal) {
      // Si no hay local seleccionado, limpiar las zonas
      this.zonasDisponibles = [];
      this.categoriasLocal = [];
      // Limpiar también las opciones del dropdown "Válido para"
      this.validoParaOptions = [{ label: 'Seleccionar', value: '' }];
      this.entradas.regular.categorias = [];
      this.entradas.preventa.categorias = [];
      this.cargandoZonas = false;
      return;
    }

    this.cargandoZonas = true;

    this.eventoService.getListarZonas(idLocal).subscribe({
      next: (response) => {
        if (response.ok) {
          // Verificar si response.data es un array o un objeto
          if (Array.isArray(response.data)) {
            this.zonasDisponibles = response.data;
          } else if (response.data) {
            // Si es un objeto único, convertirlo a array
            this.zonasDisponibles = [response.data];
          } else {
            this.zonasDisponibles = [];
          }

          // Actualizar categorías locales con las zonas cargadas
          this.categoriasLocal = this.zonasDisponibles.map(zona => ({
            idZona: zona.idZona,
            nombre: zona.nombre,
            aforoMaximo: zona.aforoMax.toString(),
            aforoDisponible: zona.aforoMax.toString()
          }));

          // Actualizar entradas con las categorías cargadas
          this.actualizarEntradasConCategorias(this.zonasDisponibles);

          this.messageService.success(
            `Se encontraron ${this.zonasDisponibles.length} zonas para el local seleccionado`,
            'Zonas Cargadas'
          );
        } else {
          this.messageService.error(
            response.mensaje || 'No se pudieron cargar las zonas del local',
            'Error de Carga'
          );
          this.zonasDisponibles = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar zonas:', error);
        this.messageService.handleHttpError(error);
        this.zonasDisponibles = [];
      },
      complete: () => {
        this.cargandoZonas = false;
      }
    });
  }

  /**
   * Actualiza las entradas con las categorías disponibles
   * @param zonas Array de zonas del local
   */
  actualizarEntradasConCategorias(zonas: ZonaData[]): void {
    const categoriasEntrada = zonas.map(zona => ({
      nombre: zona.nombre,
      estado: 'activo'
    }));

    // Actualizar entradas regular y preventa
    this.entradas.regular.categorias = [...categoriasEntrada];
    this.entradas.preventa.categorias = [...categoriasEntrada];

    // Actualizar las opciones del dropdown de validoPara
    this.validoParaOptions = [
      { label: 'Seleccionar', value: '' },
      ...zonas.map(zona => ({
        label: zona.nombre,
        value: zona.nombre.toLowerCase()
      }))
    ];
  }

  /**
   * Obtiene los datos completos del local seleccionado
   * @param idLocal ID del local seleccionado
   * @returns Datos del local o null si no se encuentra
   */
  obtenerDatosLocal(idLocal: string): LocalData | null {
    if (!idLocal || !this.localesDisponibles) return null;

    const local = this.localesDisponibles.find(l => l.idLocal.toString() === idLocal);
    return local || null;
  }

  /**
   * Maneja el cambio de selección del local
   * @param event Evento del dropdown
   */
  onLocalSeleccionado(event: any): void {
    const idLocal = event.value;
    if (idLocal) {
      const localSeleccionado = this.obtenerDatosLocal(idLocal);
      if (localSeleccionado) {
        // Actualizar información adicional del local
        this.messageService.info(`Local seleccionado: ${localSeleccionado.nombre}`, 'Selección');

        // Cargar las zonas específicas del local seleccionado
        this.cargarZonas(parseInt(idLocal));

        // Limpiar entradas agregadas cuando se cambia el local
        if (this.entradasAgregadas.length > 0) {
          this.entradasAgregadas = [];
          this.messageService.info('Se limpiaron las entradas debido al cambio de local', 'Información');
        }
      }
    } else {
      // Si no hay local seleccionado, limpiar las categorías y entradas
      this.cargarZonas(); // Esto limpiará las zonas ya que no se pasa parámetro
      this.entradasAgregadas = [];
    }
  }

  /**
   * Refresca la lista de zonas manualmente
   */
  refrescarZonas(): void {
    if (this.evento.local && this.evento.local.trim() !== '') {
      this.messageService.info('Actualizando lista de zonas...', 'Cargando');
      this.cargarZonas(parseInt(this.evento.local));
    } else {
      this.messageService.warn('Debe seleccionar un local para cargar las zonas', 'Local Requerido');
    }
  }

  /**
   * Obtiene información detallada de una zona específica
   * @param idZona ID de la zona
   * @returns Datos de la zona o null si no se encuentra
   */
  obtenerDetalleZona(idZona: number): ZonaData | null {
    if (!this.zonasDisponibles) return null;

    return this.zonasDisponibles.find(zona => zona.idZona === idZona) || null;
  }

  /**
   * Obtiene todas las zonas disponibles (sin filtrar por local)
   * @returns Array de todas las zonas activas
   */
  obtenerTodasLasZonas(): ZonaData[] {
    return this.zonasDisponibles.filter(zona => zona.activo);
  }

  /**
   * Obtiene la cantidad de zonas por local
   * @returns Objeto con idLocal como key y cantidad como value
   */
  obtenerConteoZonasPorLocal(): { [idLocal: string]: number } {
    const conteo: { [idLocal: string]: number } = {};

    this.zonasDisponibles
      .filter(zona => zona.activo)
      .forEach(zona => {
        const idLocal = zona.idLocal.toString();
        conteo[idLocal] = (conteo[idLocal] || 0) + 1;
      });

    return conteo;
  }

  // Manejo de banner subida de imagenes
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.messageService.error('Por favor selecciona un archivo de imagen válido', 'Archivo Inválido');
        return;
      }

      // Validar tamaño (por ejemplo, máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.messageService.error('La imagen no debe superar los 5MB', 'Archivo Muy Grande');
        return;
      }

      this.evento.banner = file;

      // Crear URL para mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.evento.bannerUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.messageService.success('Banner cargado exitosamente', 'Archivo Cargado');
    }
  }

  mostrarPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Aquí podrías actualizar una variable para mostrar el preview en el HTML
    };
    reader.readAsDataURL(file);
  }

  onEliminarBanner(event: any): void {
    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas eliminar el banner?',
      () => {
        this.evento.bannerUrl = '';
        this.evento.banner = null;
        this.usarBannerDefault = false;
        this.messageService.success('Banner eliminado exitosamente', 'Operación Exitosa');
      }
    );
  }

  onCancelarEvento(event: any): void {
    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas cancelar este evento?',
      () => {
        this.messageService.info('Evento cancelado exitosamente', 'Operación Completada');
        // Redirigir a gestión de eventos
        this.router.navigate(['/administrador/gestionEventos']);
      }
    );
  }

  onGuardarCambios(): void {
    // Validaciones básicas
    if (!this.validarFormulario()) {
      return;
    }

    // Aquí implementarías la lógica para guardar
    // Por ejemplo, llamar a un servicio:
    // this.eventoService.crearEvento(this.evento).subscribe(...)

    this.messageService.success('Evento creado exitosamente', 'Evento Guardado');
  }

  validarFormulario(): boolean {
    if (!this.evento.titulo || this.evento.titulo.trim() === '') {
      this.messageService.error('El título es obligatorio', 'Campo Requerido');
      return false;
    }

    if (!this.evento.categoria || this.evento.categoria.trim() === '') {
      this.messageService.error('La categoría es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.evento.descripcion || this.evento.descripcion.trim() === '') {
      this.messageService.error('La descripción es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.evento.hora || !this.evento.minutos) {
      this.messageService.error('La hora de inicio es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.evento.horaFinal || !this.evento.minutosFinal) {
      this.messageService.error('La hora de finalización es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar que la hora final sea posterior a la hora de inicio
    const horaInicio = parseInt(this.evento.hora) * 60 + parseInt(this.evento.minutos);
    const horaFin = parseInt(this.evento.horaFinal) * 60 + parseInt(this.evento.minutosFinal);

    if (horaFin <= horaInicio) {
      this.messageService.error('La hora de finalización debe ser posterior a la hora de inicio', 'Horarios Inválidos');
      return false;
    }

    if (!this.evento.local || this.evento.local.trim() === '') {
      this.messageService.error('Debe seleccionar un local para el evento', 'Campo Requerido');
      return false;
    }

    return true;
  }
  onMapaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.messageService.error('Por favor selecciona un archivo de imagen válido', 'Archivo Inválido');
        return;
      }

      // Validar tamaño (por ejemplo, máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.messageService.error('La imagen no debe superar los 5MB', 'Archivo Muy Grande');
        return;
      }

      this.evento.mapaFile = file;

      // Crear URL para mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.evento.mapaUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.messageService.success('Imagen del mapa cargada exitosamente', 'Archivo Cargado');
    }
  }

  onEliminarMapa(event: any): void {
    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas eliminar la imagen del mapa?',
      () => {
        this.evento.mapaUrl = '';
        this.evento.mapaFile = null;
        this.usarMapaDefault = false;
        this.messageService.success('Imagen del mapa eliminada exitosamente', 'Operación Exitosa');
      }
    );
  }

  onAgregarEntrada(): void {
    if (!this.entradaNombre.trim()) {
      this.messageService.error('Por favor ingresa un nombre para la entrada', 'Campo Requerido');
      return;
    }

    if (!this.entradaPrecio || this.entradaPrecio <= 0) {
      this.messageService.error('Por favor ingresa un precio válido mayor a 0', 'Campo Requerido');
      return;
    }

    if (!this.validoPara) {
      this.messageService.error('Por favor selecciona para qué categoría es válida la entrada', 'Campo Requerido');
      return;
    }

    // Buscar el label de la categoría seleccionada
    const categoriaSeleccionada = this.validoParaOptions.find(option => option.value === this.validoPara);
    const validoParaLabel = categoriaSeleccionada ? categoriaSeleccionada.label : this.validoPara;

    // Crear la nueva entrada
    const nuevaEntrada: EntradaAgregada = {
      id: this.proximoIdEntrada++,
      nombre: this.entradaNombre.trim(),
      precio: this.entradaPrecio,
      validoPara: this.validoPara,
      validoParaLabel: validoParaLabel,
      moneda: this.evento.moneda || 'PEN'
    };

    // Agregar la entrada al array
    this.entradasAgregadas.push(nuevaEntrada);

    // Limpiar los campos después de agregar
    this.entradaNombre = '';
    this.entradaPrecio = null;
    this.validoPara = '';

    this.messageService.success('Entrada agregada exitosamente', 'Operación Exitosa');
  }

  onEliminarEntrada(entradaId: number, event: Event): void {
    event.stopPropagation();

    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas eliminar esta entrada?',
      () => {
        // Filtrar el array para eliminar la entrada con el ID especificado
        this.entradasAgregadas = this.entradasAgregadas.filter(entrada => entrada.id !== entradaId);
        this.messageService.success('Entrada eliminada exitosamente', 'Operación Exitosa');
      }
    );
  }

  onAgregarCategoria(): void {
    if (!this.nuevaCategoria.nombre.trim()) {
      this.messageService.error('Por favor ingresa un nombre para la categoría', 'Campo Requerido');
      return;
    }

    if (!this.nuevaCategoria.aforoMaximo || this.nuevaCategoria.aforoMaximo <= 0) {
      this.messageService.error('Por favor ingresa un aforo máximo válido mayor a 0', 'Campo Requerido');
      return;
    }

    if (!this.evento.local || this.evento.local.trim() === '') {
      this.messageService.error('Debe seleccionar un local antes de agregar categorías', 'Local Requerido');
      return;
    }

    // Preparar datos para el servicio
    const datosZona = {
      nombre: this.nuevaCategoria.nombre,
      aforoMax: this.nuevaCategoria.aforoMaximo,
      idLocal: parseInt(this.evento.local)
    };

    // Llamar al servicio para crear la zona
    this.eventoService.postCrearZona(datosZona).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          // Para postCrearZona, response.data debería ser un objeto único, no un array
          const zonaCreada = Array.isArray(response.data) ? response.data[0] : response.data;

          if (zonaCreada) {
            // Agregar la nueva categoría a la lista local
            const aforoMaximo = this.nuevaCategoria.aforoMaximo!.toString();
            const nuevaCat: Categoria = {
              idZona: zonaCreada.idZona,
              nombre: this.nuevaCategoria.nombre,
              aforoMaximo: aforoMaximo,
              aforoDisponible: aforoMaximo // Inicialmente todo disponible
            };

            this.categoriasLocal.push(nuevaCat);

            // Limpiar los campos
            this.nuevaCategoria = {
              nombre: '',
              aforoMaximo: null
            };

            this.messageService.success(
              response.mensaje || 'Categoría creada exitosamente',
              'Operación Exitosa'
            );
          } else {
            this.messageService.error(
              'No se recibieron datos de la zona creada',
              'Error en la Operación'
            );
          }
        } else {
          this.messageService.error(
            response.mensaje || 'Error al crear la categoría',
            'Error en la Operación'
          );
        }
      },
      error: (error) => {
        console.error('Error al crear zona:', error);
        this.messageService.handleHttpError(error);
      }
    });
  }

  onEliminarCategoria(index: number, event: any): void {
    const categoria = this.categoriasLocal[index];

    if (!categoria || !categoria.idZona) {
      this.messageService.error('No se puede eliminar la categoría: datos inválidos', 'Error de Datos');
      return;
    }

    this.confirmPopupService.confirmDelete(
      event,
      `¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`,
      () => {
        // Llamar al servicio para eliminar la zona del backend
        this.eventoService.deleteZona(categoria.idZona).subscribe({
          next: (response) => {
            if (response.ok) {
              // Eliminar de la lista local solo si la eliminación en el backend fue exitosa
              this.categoriasLocal.splice(index, 1);

              // Actualizar las entradas para reflejar la eliminación
              this.actualizarEntradasTrasEliminacion(categoria.nombre);

              this.messageService.success(
                response.mensaje || `Categoría "${categoria.nombre}" eliminada exitosamente`,
                'Operación Exitosa'
              );
            } else {
              this.messageService.error(
                response.mensaje || 'Error al eliminar la categoría',
                'Error en la Operación'
              );
            }
          },
          error: (error) => {
            console.error('Error al eliminar zona:', error);
            this.messageService.handleHttpError(error);
          }
        });
      }
    );
  }

  /**
   * Actualiza las entradas tras eliminar una categoría
   * @param nombreCategoria Nombre de la categoría eliminada
   */
  actualizarEntradasTrasEliminacion(nombreCategoria: string): void {
    // Filtrar la categoría eliminada de las entradas regular y preventa
    this.entradas.regular.categorias = this.entradas.regular.categorias
      .filter(cat => cat.nombre !== nombreCategoria);

    this.entradas.preventa.categorias = this.entradas.preventa.categorias
      .filter(cat => cat.nombre !== nombreCategoria);

    // Filtrar las entradas agregadas que correspondan a la categoría eliminada
    const entradasEliminadas = this.entradasAgregadas.filter(entrada => entrada.validoParaLabel === nombreCategoria);
    this.entradasAgregadas = this.entradasAgregadas.filter(entrada => entrada.validoParaLabel !== nombreCategoria);

    // Actualizar las opciones del dropdown validoPara
    this.validoParaOptions = this.validoParaOptions
      .filter(option => option.label !== nombreCategoria);

    // Mostrar mensaje si se eliminaron entradas
    if (entradasEliminadas.length > 0) {
      this.messageService.info(
        `Se eliminaron ${entradasEliminadas.length} entrada(s) asociada(s) a la categoría "${nombreCategoria}"`,
        'Entradas Actualizadas'
      );
    }
  }

  /**
   * Elimina una categoría por su ID de zona directamente
   * @param idZona ID de la zona a eliminar
   */
  eliminarCategoriaPorId(idZona: number): void {
    const index = this.categoriasLocal.findIndex(cat => cat.idZona === idZona);

    if (index !== -1) {
      // Simular el evento para usar el método existente
      const fakeEvent = { target: null };
      this.onEliminarCategoria(index, fakeEvent);
    } else {
      this.messageService.warn('No se encontró la categoría a eliminar', 'Categoría No Encontrada');
    }
  }

  /**
   * Refresca las categorías del local actual después de cambios
   */
  refrescarCategoriasLocal(): void {
    if (this.evento.local && this.evento.local.trim() !== '') {
      this.messageService.info('Actualizando categorías...', 'Cargando');

      // Volver a cargar las zonas desde el servidor para el local actual
      this.cargarZonas(parseInt(this.evento.local));
    } else {
      this.messageService.warn('Debe seleccionar un local para actualizar las categorías', 'Local Requerido');
    }
  }

  /**
   * Elimina todas las categorías del local actual (solo del frontend)
   * Útil cuando se cambia de local
   */
  limpiarCategoriasLocal(): void {
    this.categoriasLocal = [];
    this.entradas.regular.categorias = [];
    this.entradas.preventa.categorias = [];
    this.validoParaOptions = [{ label: 'Seleccionar', value: '' }];
  }

  /**
   * Verifica si una categoría existe antes de realizar operaciones
   * @param idZona ID de la zona a verificar
   * @returns true si existe, false si no
   */
  verificarExistenciaCategoria(idZona: number): boolean {
    return this.categoriasLocal.some(cat => cat.idZona === idZona);
  }

  onPublicarInmediatamente(): void {
    if (this.publicarInmediatamente) {
      this.publicarAPartirDe = false;
      this.fechaPublicacion = undefined;
    }
  }

  onPublicarAPartirDe(): void {
    if (this.publicarAPartirDe) {
      this.publicarInmediatamente = false;
    }
  }

  /**
   * Obtiene el símbolo de la moneda basado en el código
   * @param monedaCodigo Código de la moneda (PEN, USD, EUR)
   * @returns Símbolo de la moneda
   */
  obtenerSimboloMoneda(monedaCodigo: string): string {
    const simbolos: { [key: string]: string } = {
      'PEN': 'S/.',
      'USD': '$',
      'EUR': '€'
    };
    return simbolos[monedaCodigo] || monedaCodigo;
  }

}

