import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
import { ConfirmPopupService } from '../../../../../../core/services/confirm-popup.service';
import { LocalService } from '../../../services/local.service';
import { EventoService } from '../../../services/evento.service';
import { Data as LocalData } from '../../../interfaces/gestion-locales/local.interface';
import { Data as ZonaData } from '../../../interfaces/gestion-evento/zona-categoria.interface';
import { CrearEventoRequest } from '../../../interfaces/gestion-evento/evento.interface';
import { CrearLocalRequest } from '../../../interfaces/gestion-locales/crear-local.interface';

interface EstadoOption {
  label: string;
  value: string;
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
  time: Date | undefined; // Cambiar de array a Date único para timeOnly
  timeFinal: Date | undefined; // Cambiar de array a Date único para timeOnly

  // Nuevas propiedades para la sección de publicación
  publicarInmediatamente: boolean = true;
  publicarAPartirDe: boolean = false;
  fechaPublicacion: Date | undefined;

  // Evento principal usando la interfaz del backend
  evento: CrearEventoRequest = {
    nombre: '',
    tipoEvento: '',
    descripcion: '',
    fechaEvento: '',
    horaInicio: '',
    horaFin: '',
    estadoEvento: 'PUBLICADO',
    imagenUrl: null as any, // Se llenará con el archivo del banner
    aforoDisponible: 1000,
    idLocal: 1
  };

  // Campos auxiliares para el formulario (solo los necesarios)
  formulario = {
    localString: '', // Para el dropdown (string)
    banner: null as File | null,
    bannerUrl: '',
    mapaUrl: '',
    mapaFile: null as File | null,
    mapaZonasFile: null as File | null, // Nueva imagen de zonas
    moneda: 'Nuevo Sol'
  };

  estadoOptions: EstadoOption[] = [
    { label: 'PUBLICADO', value: 'PUBLICADO' },
    { label: 'ACTIVO', value: 'ACTIVO' },
    { label: 'CANCELADO', value: 'CANCELADO' },
    { label: 'AGOTADO', value: 'AGOTADO' },
    { label: 'FINALIZADO', value: 'FINALIZADO' },
  ];
  categorias = [
    //{ label: 'Conferencia', value: 'CONFERENCIA' },
    { label: 'Punk', value: 'PUNK' },
    //{ label: 'Deporte', value: 'DEPORTE' },
    { label: 'Rock', value: 'ROCK' },
    { label: 'Metal', value: 'METAL' },
    //{ label: 'Feria', value: 'FERIA' },
    //{ label: 'Exposición', value: 'EXPOSICION' },
    //{ label: 'Concierto', value: 'CONCIERTO' },
    { label: 'Pop', value: 'POP' },
    { label: 'Reggae', value: 'REGGAE' },
    //{ label: 'Festival', value: 'FESTIVAL' },
    //{ label: 'Taller', value: 'TALLER' },
    //{ label: 'Reggaetón', value: 'REGGAETON' },
    //{ label: 'Cine', value: 'CINE' },
    //{ label: 'Otro', value: 'OTRO' },
    { label: 'Electrónica', value: 'ELECTRONICA' },
    { label: 'Rock Pop', value: 'ROCK_POP' },
    { label: 'Urbano', value: 'URBANO' },
    //{ label: 'Obra Teatral', value: 'OBRA_TEATRAL' }
  ];
  categoriasLocal: ZonaData[] = [];
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
    { label: 'PUBLICADO', value: 'PUBLICADO' },
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
  entradaDescripcion: string = '';
  entradaPrecio: number | null = null;
  entradaStock: number | null = null;
  validoPara: string = '';

  // Array para almacenar las entradas agregadas
  entradasAgregadas: EntradaAgregada[] = [];
  proximoIdEntrada: number = 1;

  // Array para almacenar todas las entradas disponibles del sistema
  entradasDisponibles: any[] = [];
  cargandoEntradas: boolean = false;

  // Opciones dinámicas para el dropdown "Válido para" - se llena con datos de getListarZonas
  validoParaOptions: EstadoOption[] = [{ label: 'Seleccionar', value: '' }];

  // Nuevas propiedades para la sección de Local y asientos
  localesOptions: EstadoOption[] = [{ label: 'Seleccionar local', value: '' }];
  localesDisponibles: LocalData[] = [];
  cargandoLocales: boolean = false;

  // Propiedades para el manejo de zonas/categorías
  zonasDisponibles: ZonaData[] = [];
  cargandoZonas: boolean = false;

  // ID del evento (para identificar si estamos editando)
  idEvento: number | null = null;

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

    // Cargar entradas disponibles del sistema
    this.cargarEntradas();

    // Inicializar horas por defecto para ayudar con la interacción
    this.inicializarHorasPorDefecto();

    // Las zonas se cargarán cuando se seleccione un local
    // Aquí puedes cargar datos del evento si estás editando
    this.cargarEvento();
  }

  /**
   * Inicializa horas por defecto para mejorar la experiencia de usuario
   */
  private inicializarHorasPorDefecto(): void {
    const ahora = new Date();

    // Hora de inicio: próxima hora en punto
    const horaInicio = new Date();
    horaInicio.setHours(ahora.getHours() + 1, 0, 0, 0);
    this.time = horaInicio;

    // Hora final: 2 horas después de la hora de inicio
    const horaFinal = new Date();
    horaFinal.setHours(ahora.getHours() + 3, 0, 0, 0);
    this.timeFinal = horaFinal;
  }

  cargarEvento(): void {
    // Simulación de carga de datos
    // En una aplicación real, aquí harías una llamada al servicio
    // Inicializar formulario con datos del evento
    this.inicializarFormularioDesdeEvento();
  }

  /**
   * Inicializa los campos del formulario extrayendo los datos del evento
   */
  private inicializarFormularioDesdeEvento(): void {
    // Extraer fecha de fechaEvento (formato: YYYY-MM-DD) y establecer en el datepicker
    if (this.evento.fechaEvento) {
      this.date = new Date(this.evento.fechaEvento);
    }

    // Extraer hora de horaInicio (formato: HH:MM:SS) y establecer en el datepicker
    if (this.evento.horaInicio) {
      const [hora, minutos] = this.evento.horaInicio.split(':');
      const fechaInicio = new Date();
      fechaInicio.setHours(parseInt(hora), parseInt(minutos), 0, 0);
      this.time = fechaInicio;
    }

    // Extraer hora de horaFin (formato: HH:MM:SS) y establecer en el datepicker
    if (this.evento.horaFin) {
      const [horaFinal, minutosFinal] = this.evento.horaFin.split(':');
      const fechaFinal = new Date();
      fechaFinal.setHours(parseInt(horaFinal), parseInt(minutosFinal), 0, 0);
      this.timeFinal = fechaFinal;
    }

    // Extraer banner de imagenUrl (ahora es un File, no string)
    if (this.evento.imagenUrl) {
      // Si estamos editando un evento existente y hay una imagen File
      // Crear un preview para mostrar en la UI
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formulario.bannerUrl = e.target.result;
      };
      reader.readAsDataURL(this.evento.imagenUrl);
      this.formulario.banner = this.evento.imagenUrl;
    }

    // Inicializar localString con idLocal solo si estamos editando un evento existente
    // Para eventos nuevos, mantener vacío para mostrar "Seleccionar local"
    if (this.idEvento && this.evento.idLocal && this.evento.idLocal !== 1) {
      this.formulario.localString = this.evento.idLocal.toString();
    }
  }

  /**
   * Sincroniza los datos del formulario hacia el evento
   * Se debe llamar antes de enviar datos al backend
   */
  private sincronizarFormularioAEvento(): void {
    // Construir fechaEvento desde el datepicker
    this.evento.fechaEvento = this.date ? this.date.toISOString().split('T')[0] : '';

    // Construir horaInicio y horaFin desde los datepickers
    this.evento.horaInicio = this.time ?
      `${this.time.getHours().toString().padStart(2, '0')}:${this.time.getMinutes().toString().padStart(2, '0')}:00` : '';

    this.evento.horaFin = this.timeFinal ?
      `${this.timeFinal.getHours().toString().padStart(2, '0')}:${this.timeFinal.getMinutes().toString().padStart(2, '0')}:00` : '';

    // Sincronizar idLocal desde localString
    if (this.formulario.localString) {
      this.evento.idLocal = parseInt(this.formulario.localString);
    }

    // imagenUrl ya se sincroniza automáticamente cuando se carga el banner
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
          this.messageService.searchNoResults('No se pudieron cargar los locales');
        }
      },
      error: (error) => {
        this.messageService.handleHttpError(error);

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

  cargarZonas(idEvento?: number): void {
    // Si no se proporciona un idEvento, intentar obtenerlo del componente
    if (!idEvento && this.idEvento) {
      idEvento = this.idEvento;
    }

    if (!idEvento) {
      // Si no hay evento creado, limpiar las zonas
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

    this.eventoService.getListarZonas(idEvento).subscribe({
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
          this.categoriasLocal = this.zonasDisponibles;

          // Actualizar entradas con las categorías cargadas
          this.actualizarEntradasConCategorias(this.zonasDisponibles);

          this.messageService.searchSuccess(
            `Se encontraron ${this.zonasDisponibles.length} zonas para el evento`
          );
        } else {
          this.messageService.searchNoResults(
            response.mensaje || 'No se pudieron cargar las zonas del evento'
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
   * Carga todas las entradas disponibles del sistema
   */
  cargarEntradas(): void {
    this.cargandoEntradas = true;

    this.eventoService.getListarEntradas().subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          // Verificar si response.data es un array o un objeto
          if (Array.isArray(response.data)) {
            this.entradasDisponibles = response.data;
          } else {
            // Si es un objeto único, convertirlo a array
            this.entradasDisponibles = [response.data];
          }

          this.messageService.searchSuccess(
            `Se encontraron ${this.entradasDisponibles.length} entrada(s) en el sistema`
          );
        } else {
          this.messageService.searchNoResults(
            response.mensaje || 'No se pudieron cargar las entradas disponibles'
          );
          this.entradasDisponibles = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar entradas:', error);
        this.messageService.handleHttpError(error);
        this.entradasDisponibles = [];
      },
      complete: () => {
        this.cargandoEntradas = false;
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
    // Usar idZona como value para evitar problemas con nombres y mayúsculas/minúsculas
    this.validoParaOptions = [
      { label: 'Seleccionar', value: '' },
      ...zonas.map(zona => ({
        label: zona.nombre,
        value: zona.idZona.toString()
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

        // Nota: Las zonas se cargarán después de guardar los datos generales del evento
        // ya que ahora se requiere el idEvento en lugar del idLocal

        // Limpiar categorías y entradas al cambiar de local
        if (this.categoriasLocal.length > 0 || this.entradasAgregadas.length > 0) {
          this.categoriasLocal = [];
          this.entradasAgregadas = [];
          this.messageService.info('Se limpiaron las categorías y entradas debido al cambio de local', 'Información');
        }
      }
    } else {
      // Si no hay local seleccionado, limpiar las categorías y entradas
      this.categoriasLocal = [];
      this.entradasAgregadas = [];
    }
  }

  /**
   * Refresca la lista de zonas manualmente
   */
  refrescarZonas(): void {
    if (this.idEvento) {
      this.messageService.info('Actualizando lista de zonas...', 'Cargando');
      this.cargarZonas(this.idEvento);
    } else {
      this.messageService.warn('Debe guardar los datos generales del evento antes de cargar las zonas', 'Evento Requerido');
    }
  }

  /**
   * Refresca la lista de entradas manualmente
   */
  refrescarEntradas(): void {
    this.messageService.info('Actualizando lista de entradas...', 'Cargando');
    this.cargarEntradas();
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
   * Obtiene la cantidad de zonas del evento actual
   * @returns Cantidad de zonas activas
   */
  obtenerConteoZonas(): number {
    return this.zonasDisponibles.filter(zona => zona.activo).length;
  }

  // ==================== MÉTODOS PARA ENTRADAS ====================

  /**
   * Obtiene todas las entradas disponibles activas
   * @returns Array de todas las entradas activas
   */
  obtenerTodasLasEntradas(): any[] {
    return this.entradasDisponibles.filter(entrada => entrada.activo);
  }

  /**
   * Obtiene información detallada de una entrada específica
   * @param idEntrada ID de la entrada
   * @returns Datos de la entrada o null si no se encuentra
   */
  obtenerDetalleEntrada(idEntrada: number): any | null {
    if (!this.entradasDisponibles) return null;

    return this.entradasDisponibles.find(entrada => entrada.idTipoTicket === idEntrada) || null;
  }

  /**
   * Obtiene las entradas filtradas por zona
   * @param idZona ID de la zona para filtrar
   * @returns Array de entradas para la zona especificada
   */
  obtenerEntradasPorZona(idZona: number): any[] {
    return this.entradasDisponibles.filter(entrada =>
      entrada.idZona === idZona && entrada.activo
    );
  }

  /**
   * Obtiene el conteo de entradas por zona
   * @returns Objeto con idZona como key y cantidad como value
   */
  obtenerConteoEntradasPorZona(): { [idZona: string]: number } {
    const conteo: { [idZona: string]: number } = {};

    this.entradasDisponibles
      .filter(entrada => entrada.activo)
      .forEach(entrada => {
        const idZona = entrada.idZona.toString();
        conteo[idZona] = (conteo[idZona] || 0) + 1;
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

      this.formulario.banner = file;

      // Convertir imagen a base64 solo para mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;

        // Guardar la imagen en base64 solo para mostrar preview
        this.formulario.bannerUrl = base64String;

        this.messageService.success('Banner cargado exitosamente', 'Archivo Procesado');
      };

      reader.onerror = () => {
        this.messageService.error('Error al procesar la imagen', 'Error de Archivo');
      };

      reader.readAsDataURL(file);
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
        this.formulario.bannerUrl = '';
        this.formulario.banner = null;
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



  /**
   * Guarda los datos generales del evento (Sección 1)
   * Valida solo los campos de la sección 1 antes de crear el evento
   */
  onGuardarDatosGenerales(): void {
    // Validar solo los datos generales
    if (!this.validarDatosGenerales()) {
      return;
    }

    // Verificar que se haya seleccionado un local
    if (!this.formulario.localString || this.formulario.localString.trim() === '') {
      this.messageService.error('Debe seleccionar un local para el evento', 'Campo Requerido');
      return;
    }
    // // Verificar que se haya seleccionado un banner
    // if (!this.formulario.banner) {
    //   this.messageService.error('Debe seleccionar una imagen banner para el evento', 'Campo Requerido');
    //   return;
    // }
    // Asignar el idLocal del local seleccionado al evento
    this.evento.idLocal = parseInt(this.formulario.localString);

    // Preparar datos básicos del evento
    const datosEvento = this.prepararDatosEventoBasicos();

    // Mostrar mensaje de carga
    this.messageService.info('Guardando datos del evento...', 'Procesando');

    // Llamar al servicio para crear el evento con datos básicos
    this.eventoService.postCrearEvento(datosEvento).subscribe({
      next: (response) => {
        this.messageService.handleBackendResponse(response, false, 'Datos Guardados');

        if (response.ok && response.data) {
          this.messageService.success('Datos generales del evento guardados exitosamente', 'Éxito');

          // Guardar el ID del evento creado para futuras actualizaciones
          if (response.data.idEvento) {
            this.idEvento = response.data.idEvento;
            this.messageService.info(`Evento creado con ID: ${this.idEvento}`, 'Información');

            // Cargar las zonas asociadas al evento recién creado
            this.cargarZonas(this.idEvento);
          }
        }
      },
      error: (error) => {
        console.error('Error al guardar datos del evento:', error);
        this.messageService.handleHttpError(error);
      }
    });
  }

  /**
   * Método para crear el evento
   * Asigna el idLocal del local seleccionado y llama a postCrearEvento
   */


  validarFormulario(): boolean {
    if (!this.evento.nombre || this.evento.nombre.trim() === '') {
      this.messageService.error('El título es obligatorio', 'Campo Requerido');
      return false;
    }

    if (!this.evento.tipoEvento || this.evento.tipoEvento.trim() === '') {
      this.messageService.error('La categoría es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.evento.descripcion || this.evento.descripcion.trim() === '') {
      this.messageService.error('La descripción es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.time) {
      this.messageService.error('La hora de inicio es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.timeFinal) {
      this.messageService.error('La hora de finalización es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar que la hora final sea posterior a la hora de inicio
    if (this.timeFinal && this.time && this.timeFinal <= this.time) {
      this.messageService.error('La hora de finalización debe ser posterior a la hora de inicio', 'Horarios Inválidos');
      return false;
    }

    // Validar que se haya seleccionado un banner
    // if (!this.formulario.banner) {
    //   this.messageService.error('Debe seleccionar una imagen banner para el evento', 'Campo Requerido');
    //   return false;
    // }

    if (!this.formulario.localString || this.formulario.localString.trim() === '') {
      this.messageService.error('Debe seleccionar un local para el evento', 'Campo Requerido');
      return false;
    }

    return true;
  }

  /**
   * Validaciones específicas para los datos generales (sección 1)
   */
  validarDatosGenerales(): boolean {
    if (!this.evento.nombre || this.evento.nombre.trim() === '') {
      this.messageService.error('El título es obligatorio', 'Campo Requerido');
      return false;
    }

    if (!this.evento.tipoEvento || this.evento.tipoEvento.trim() === '') {
      this.messageService.error('La categoría es obligatoria', 'Campo Requerido');
      return false;
    }

    if (!this.evento.descripcion || this.evento.descripcion.trim() === '') {
      this.messageService.error('La descripción es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar fecha del evento usando directamente el datepicker
    if (!this.date) {
      this.messageService.error('La fecha del evento es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar hora de inicio usando directamente el datepicker
    if (!this.time) {
      this.messageService.error('La hora de inicio es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar hora final usando directamente el datepicker
    if (!this.timeFinal) {
      this.messageService.error('La hora de finalización es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar que la hora final sea posterior a la hora de inicio
    if (this.timeFinal && this.time && this.timeFinal <= this.time) {
      this.messageService.error('La hora de finalización debe ser posterior a la hora de inicio', 'Horarios Inválidos');
      return false;
    }    return true;
  }

  /**
   * Prepara los datos básicos del evento para la creación inicial
   */
  prepararDatosEventoBasicos(): CrearEventoRequest {
    // Sincronizar datos del formulario al evento antes de preparar
    this.sincronizarFormularioAEvento();

    // Convertir la fecha del datepicker a formato ISO
    const fechaEvento = this.date ? this.date.toISOString().split('T')[0] : '';

    // Formatear horas desde los datepickers con validación mejorada
    const horaInicio = this.time ?
      `${this.time.getHours().toString().padStart(2, '0')}:${this.time.getMinutes().toString().padStart(2, '0')}:00` : '00:00:00';

    const horaFin = this.timeFinal ?
      `${this.timeFinal.getHours().toString().padStart(2, '0')}:${this.timeFinal.getMinutes().toString().padStart(2, '0')}:00` : '00:00:00';

    const datosEvento: CrearEventoRequest = {
      nombre: this.evento.nombre.trim(),
      descripcion: this.evento.descripcion.trim(),
      fechaEvento: fechaEvento,
      horaInicio: horaInicio,
      horaFin: horaFin,
      imagenUrl: this.formulario.banner!,
      imagenZonasUrl: this.formulario.mapaZonasFile || undefined,
      tipoEvento: this.evento.tipoEvento,
      estadoEvento: this.evento.estadoEvento,
      aforoDisponible: this.evento.aforoDisponible || 1000, // Usar el valor del input del usuario
      idLocal: parseInt(this.formulario.localString) || 1 // Usar el local seleccionado
    };

    return datosEvento;
  }

  /**
   * Validaciones adicionales específicas para crear evento
   */
  validarDatosCompletos(): boolean {
    // Validar fecha del evento usando directamente el datepicker
    if (!this.date) {
      this.messageService.error('La fecha del evento es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar que el año sea válido (no sea en el pasado)
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Normalizar a medianoche para comparar solo fechas

    const fechaEvento = new Date(this.date);
    fechaEvento.setHours(0, 0, 0, 0);

    if (fechaEvento < fechaActual) {
      this.messageService.error('La fecha del evento no puede ser anterior a hoy', 'Fecha Inválida');
      return false;
    }

    // Validar que se haya seleccionado un local válido
    if (!this.formulario.localString || this.formulario.localString === '') {
      this.messageService.error('Debe seleccionar un local válido', 'Local Requerido');
      return false;
    }

    // Validar que el local seleccionado exista en la lista
    const localValido = this.localesDisponibles.find(local =>
      local.idLocal.toString() === this.formulario.localString
    );
    if (!localValido) {
      this.messageService.error('El local seleccionado no es válido', 'Local Inválido');
      return false;
    }

    // Validar que existan categorías/zonas para el evento
    if (this.categoriasLocal.length === 0) {
      this.messageService.warn(
        'Debe crear al menos una categoría/zona para el evento',
        'Categorías Requeridas'
      );
      return false;
    }

    // Validar que existan entradas para el evento
    if (this.entradasAgregadas.length === 0) {
      this.messageService.warn(
        'Debe agregar al menos un tipo de entrada para el evento',
        'Entradas Requeridas'
      );
      return false;
    }

    return true;
  }

  /**
   * Prepara los datos del evento en el formato requerido por la API
   */
  prepararDatosEvento(): CrearEventoRequest {
    // Sincronizar datos del formulario al evento antes de preparar
    this.sincronizarFormularioAEvento();

    // Convertir la fecha del datepicker a formato ISO
    const fechaEvento = this.date ? this.date.toISOString().split('T')[0] : '';

    // Formatear horas desde los datepickers con validación mejorada
    const horaInicio = this.time ?
      `${this.time.getHours().toString().padStart(2, '0')}:${this.time.getMinutes().toString().padStart(2, '0')}:00` : '00:00:00';

    const horaFin = this.timeFinal ?
      `${this.timeFinal.getHours().toString().padStart(2, '0')}:${this.timeFinal.getMinutes().toString().padStart(2, '0')}:00` : '00:00:00';

    const datosEvento: CrearEventoRequest = {
      nombre: this.evento.nombre.trim(),
      descripcion: this.evento.descripcion.trim(),
      fechaEvento: fechaEvento,
      horaInicio: horaInicio,
      horaFin: horaFin,
      imagenUrl: this.formulario.banner!,
      imagenZonasUrl: this.formulario.mapaZonasFile || undefined,
      tipoEvento: this.evento.tipoEvento,
      estadoEvento: this.evento.estadoEvento,
      aforoDisponible: this.evento.aforoDisponible || 1000, // Usar el valor del input del usuario
      idLocal: parseInt(this.formulario.localString)
    };

    return datosEvento;
  }

  /**
   * Limpia todos los campos del formulario
   */
  private limpiarFormulario(): void {
    // Resetear datos del evento (backend)
    this.evento = {
      nombre: '',
      tipoEvento: '',
      descripcion: '',
      fechaEvento: '',
      horaInicio: '',
      horaFin: '',
      imagenUrl: null as any,
      estadoEvento: 'PUBLICADO',
      aforoDisponible: 1000,
      idLocal: 1
    };

    // Resetear datos del formulario (UI) - solo campos necesarios
    this.formulario = {
      localString: '',
      banner: null,
      bannerUrl: '',
      mapaUrl: '',
      mapaFile: null,
      mapaZonasFile: null,
      moneda: 'Nuevo Sol'
    };

    // Limpiar datepickers
    this.date = undefined;
    this.time = undefined;
    this.timeFinal = undefined;

    // Limpiar entradas agregadas
    this.entradasAgregadas = [];
    this.entradaNombre = '';
    this.entradaDescripcion = '';
    this.entradaPrecio = null;
    this.entradaStock = null;
    this.validoPara = '';

    // Limpiar categorías
    this.categoriasLocal = [];
    this.nuevaCategoria = {
      nombre: '',
      aforoMaximo: null
    };

    // Resetear opciones de publicación
    this.publicarInmediatamente = true;
    this.publicarAPartirDe = false;
    this.fechaPublicacion = undefined;

    // Resetear configuraciones de archivos
    this.usarMapaDefault = false;
    this.usarBannerDefault = false;

    // Resetear ID del evento (vuelve a modo creación)
    this.idEvento = null;

    this.messageService.info('Formulario limpiado', 'Información');
  }

  /**
   * Muestra un resumen del evento antes de crearlo
   */
  mostrarResumenEvento(): void {
    // Formatear fecha desde el datepicker
    const fechaFormateada = this.date ?
      this.date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : 'No seleccionada';

    // Formatear horas desde los datepickers
    const horaInicio = this.time ?
      this.time.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }) : 'No seleccionada';

    const horaFinal = this.timeFinal ?
      this.timeFinal.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }) : 'No seleccionada';

    const resumen = `
      Título: ${this.evento.nombre}
      Categoría: ${this.evento.tipoEvento}
      Fecha: ${fechaFormateada}
      Hora: ${horaInicio} - ${horaFinal}
      Local: ${this.obtenerNombreLocal()}
      Categorías: ${this.categoriasLocal.length}
      Entradas: ${this.entradasAgregadas.length}
    `;

    this.messageService.info(resumen, 'Resumen del Evento');
  }

  /**
   * Obtiene el nombre del local seleccionado
   */
  private obtenerNombreLocal(): string {
    if (!this.formulario.localString) return 'No seleccionado';

    const local = this.localesDisponibles.find(l =>
      l.idLocal.toString() === this.formulario.localString
    );

    return local ? `${local.nombre} - ${local.nombreDistrito}` : 'Local no encontrado';
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

      // Validar que se haya creado el evento primero
      if (!this.idEvento) {
        this.messageService.error('Primero debes guardar los datos generales del evento antes de subir la imagen de zonas', 'Evento Requerido');
        return;
      }

      this.formulario.mapaZonasFile = file;

      // Mostrar preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formulario.mapaUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Actualizar el evento con la nueva imagen de zonas
      this.actualizarEventoMapa(file);

      this.messageService.success('Imagen de zonas seleccionada correctamente', 'Imagen Agregada');
    }
  }



  /**
   * Actualiza el evento con la nueva imagen de zonas
   * @param file Archivo de imagen seleccionado
   */
  private actualizarEventoMapa(file: File): void {
    if (!this.idEvento) {
      this.messageService.error('No hay un evento creado para actualizar', 'Error');
      return;
    }

    // Preparar los datos del evento solo con la imagen de zonas
    // NO incluir imagenUrl para que el backend mantenga el banner existente
    const datosEvento: CrearEventoRequest = {
      nombre: this.evento.nombre,
      descripcion: this.evento.descripcion,
      fechaEvento: this.evento.fechaEvento,
      horaInicio: this.evento.horaInicio,
      horaFin: this.evento.horaFin,
      // imagenUrl: NO enviamos este campo para mantener el banner existente
      imagenZonasUrl: file, // Solo actualizar la imagen de zonas
      tipoEvento: this.evento.tipoEvento,
      estadoEvento: this.evento.estadoEvento,
      aforoDisponible: this.evento.aforoDisponible,
      idLocal: this.evento.idLocal
    };

    // Mostrar mensaje de carga
    this.messageService.info('Actualizando imagen de zonas...', 'Procesando');

    // Llamar al servicio para actualizar el evento
    this.eventoService.putActualizarEvento(this.idEvento, datosEvento).subscribe({
      next: (response) => {
        this.messageService.success(
          'Imagen de zonas actualizada exitosamente',
          'Operación Exitosa'
        );
      },
      error: (error) => {
        this.messageService.error(
          'Error al actualizar la imagen de zonas: ' + (error.message || 'Error desconocido'),
          'Error'
        );
        console.error('Error al actualizar imagen de zonas:', error);

        // Limpiar la imagen en caso de error
        this.formulario.mapaUrl = '';
        this.formulario.mapaZonasFile = null;
      }
    });
  }

  onEliminarMapa(event: any): void {
    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas eliminar la imagen de zonas?',
      () => {
        // Solo limpiar localmente
        this.limpiarImagenMapaLocal();
        this.messageService.success('Imagen de zonas eliminada', 'Operación Exitosa');
      }
    );
  }

  /**
   * Limpia la imagen del mapa solo localmente (en el componente)
   */
  private limpiarImagenMapaLocal(): void {
    this.formulario.mapaUrl = '';
    this.formulario.mapaZonasFile = null;
    this.usarMapaDefault = false;
  }

  onAgregarEntrada(): void {
    // Validaciones esenciales únicamente
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

    // Buscar la zona seleccionada usando el idZona (que ahora viene como value del dropdown)
    const idZonaSeleccionada = parseInt(this.validoPara);
    const zonaSeleccionada = this.zonasDisponibles.find(zona =>
      zona.idZona === idZonaSeleccionada
    );

    if (!zonaSeleccionada) {
      this.messageService.error('No se pudo encontrar la zona seleccionada', 'Error de Validación');
      console.error('Zona no encontrada. ID buscado:', idZonaSeleccionada, 'Zonas disponibles:', this.zonasDisponibles);
      return;
    }

    // Preparar datos para la API (usando valores por defecto para campos omitidos)
    const datosEntrada = {
      nombre: this.entradaNombre.trim(),
      descripcion: this.entradaDescripcion?.trim() || 'Sin descripción',
      precio: this.entradaPrecio,
      stock: this.entradaStock || 100, // Valor por defecto si no se especifica
      activo: true,
      idZona: zonaSeleccionada.idZona,
      limitePorPersona: this.limiteCompra.tipo === 'conMaximo' ? this.limiteCompra.maximo : 10
    };

    // Mostrar mensaje de procesamiento
    this.messageService.info('Creando entrada...', 'Procesando');

    // Llamar al servicio para crear la entrada
    this.eventoService.postCrearEntrada(datosEntrada).subscribe({
      next: (response) => {
        if (response.ok) {
          // Buscar el label de la categoría seleccionada para mostrar
          const categoriaSeleccionada = this.validoParaOptions.find(option => option.value === this.validoPara);
          const validoParaLabel = categoriaSeleccionada ? categoriaSeleccionada.label : this.validoPara;

          // Crear la nueva entrada para el array local
          const nuevaEntrada: EntradaAgregada = {
            id: response.data.idTipoTicket,
            nombre: response.data.nombre,
            precio: response.data.precio,
            validoPara: this.validoPara,
            validoParaLabel: validoParaLabel,
            moneda: this.formulario.moneda || 'PEN'
          };

          // Agregar la entrada al array local
          this.entradasAgregadas.push(nuevaEntrada);

          // Limpiar los campos después de agregar
          this.limpiarCamposEntrada();

          // Mostrar mensaje de éxito
          this.messageService.success(
            `Entrada "${response.data.nombre}" creada exitosamente`,
            'Entrada Creada'
          );

          // Mostrar mensaje adicional si existe
          if (response.mensaje) {
            this.messageService.info(response.mensaje, 'Información');
          }
        } else {
          this.messageService.error(
            response.mensaje || 'No se pudo crear la entrada',
            'Error al Crear Entrada'
          );
        }
      },
      error: (error) => {
        console.error('Error al crear entrada:', error);
        this.messageService.handleHttpError(error);
      }
    });
  }  /**
   * Limpia todos los campos del formulario de entrada
   */
  private limpiarCamposEntrada(): void {
    this.entradaNombre = '';
    this.entradaDescripcion = '';
    this.entradaPrecio = null;
    this.entradaStock = null;
    this.validoPara = '';
  }

  onEliminarEntrada(entradaId: number, event: Event): void {
    event.stopPropagation();

    // Buscar la entrada en el array local para obtener información
    const entradaAEliminar = this.entradasAgregadas.find(entrada => entrada.id === entradaId);

    if (!entradaAEliminar) {
      this.messageService.error('No se encontró la entrada a eliminar', 'Error de Datos');
      return;
    }

    this.confirmPopupService.confirmDelete(
      event,
      `¿Estás seguro de que deseas eliminar la entrada "${entradaAEliminar.nombre}"?`,
      () => {
        // Mostrar mensaje de procesamiento
        this.messageService.info('Eliminando entrada...', 'Procesando');

        // Llamar al servicio para eliminar la entrada del backend
        this.eventoService.deleteEntrada(entradaId).subscribe({
          next: (response) => {
            if (response.ok) {
              // Eliminar de la lista local solo si la eliminación en el backend fue exitosa
              this.entradasAgregadas = this.entradasAgregadas.filter(entrada => entrada.id !== entradaId);

              // Mostrar mensaje de éxito
              this.messageService.success(
                response.mensaje || `Entrada "${entradaAEliminar.nombre}" eliminada exitosamente`,
                'Entrada Eliminada'
              );

              // Mostrar mensaje adicional si existe
              if (response.mensaje) {
                this.messageService.info(response.mensaje, 'Información');
              }
            } else {
              this.messageService.error(
                response.mensaje || 'No se pudo eliminar la entrada',
                'Error al Eliminar Entrada'
              );
            }
          },
          error: (error) => {
            console.error('Error al eliminar entrada:', error);
            this.messageService.handleHttpError(error);
          }
        });
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

    if (!this.idEvento) {
      this.messageService.error('Debe guardar los datos generales del evento antes de agregar categorías', 'Evento Requerido');
      return;
    }

    // Preparar datos para el servicio
    const datosZona = {
      nombre: this.nuevaCategoria.nombre,
      aforoMax: this.nuevaCategoria.aforoMaximo,
      idEvento: this.idEvento
    };

    // Llamar al servicio para crear la zona
    this.eventoService.postCrearZona(datosZona).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          // Para postCrearZona, response.data debería ser un objeto único, no un array
          const zonaCreada = Array.isArray(response.data) ? response.data[0] : response.data;

          if (zonaCreada) {
            // Agregar la nueva categoría a la lista local
            const nuevaCat: ZonaData = {
              idZona: zonaCreada.idZona,
              nombre: this.nuevaCategoria.nombre,
              aforoMax: this.nuevaCategoria.aforoMaximo!,
              usuarioCreacion: null,
              usuarioActualizacion: null,
              activo: true,
              fechaCreacion: null,
              fechaActualizacion: null,
              idEvento: this.idEvento!
            };

            this.categoriasLocal.push(nuevaCat);

            // Actualizar las opciones del dropdown "Válido para"
            this.actualizarValidoParaOptions();

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

              // Actualizar las opciones del dropdown "Válido para"
              this.actualizarValidoParaOptions();

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
   * Actualiza las opciones del dropdown "Válido para" con las categorías locales actuales
   */
  private actualizarValidoParaOptions(): void {
    this.validoParaOptions = [
      { label: 'Seleccionar', value: '' },
      ...this.categoriasLocal.map(categoria => ({
        label: categoria.nombre,
        value: categoria.idZona.toString()
      }))
    ];
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
    if (this.idEvento) {
      this.messageService.info('Actualizando categorías...', 'Cargando');

      // Volver a cargar las zonas desde el servidor para el evento actual
      this.cargarZonas(this.idEvento);
    } else {
      this.messageService.warn('Debe guardar los datos generales del evento antes de actualizar las categorías', 'Evento Requerido');
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

