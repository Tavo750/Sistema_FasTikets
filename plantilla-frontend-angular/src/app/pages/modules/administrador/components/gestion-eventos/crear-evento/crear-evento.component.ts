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

          this.messageService.searchSuccess(
            `Se encontraron ${this.zonasDisponibles.length} zonas para el local seleccionado`
          );
        } else {
          this.messageService.searchNoResults(
            response.mensaje || 'No se pudieron cargar las zonas del local'
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

    // Validaciones adicionales específicas para crear evento
    if (!this.validarDatosCompletos()) {
      return;
    }

    // Mostrar resumen del evento
    this.mostrarResumenEvento();

    // Preparar datos para el servicio
    const datosEvento = this.prepararDatosEvento();

    // Mostrar mensaje de carga
    this.messageService.info('Creando evento...', 'Procesando');

    // Llamar al servicio para crear el evento
    this.eventoService.postCrearEvento(datosEvento).subscribe({
      next: (response) => {
        this.messageService.handleBackendResponse(response, false, 'Evento Creado');

        if (response.ok && response.data) {
          // Limpiar formulario después de crear exitosamente
          this.limpiarFormulario();

          // Redirigir a la gestión de eventos después de crear exitosamente
          setTimeout(() => {
            this.router.navigate(['/administrador/gestionEventos']);
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Error al crear evento:', error);
        this.messageService.handleHttpError(error);
      }
    });
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

  /**
   * Validaciones adicionales específicas para crear evento
   */
  validarDatosCompletos(): boolean {
    // Validar fecha del evento
    if (!this.evento.dia || !this.evento.mes || !this.evento.anio) {
      this.messageService.error('La fecha del evento es obligatoria', 'Campo Requerido');
      return false;
    }

    // Validar que el año sea válido
    const anioActual = new Date().getFullYear();
    const anioEvento = parseInt(this.evento.anio);
    if (anioEvento < anioActual) {
      this.messageService.error('El año del evento no puede ser anterior al año actual', 'Fecha Inválida');
      return false;
    }

    // Validar que se haya seleccionado un local válido
    if (!this.evento.local || this.evento.local === '') {
      this.messageService.error('Debe seleccionar un local válido', 'Local Requerido');
      return false;
    }

    // Validar que el local seleccionado exista en la lista
    const localValido = this.localesDisponibles.find(local =>
      local.idLocal.toString() === this.evento.local
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
    // Convertir la fecha a formato ISO
    const fechaEvento = this.construirFechaEvento();

    // Formatear horas
    const horaInicio = `${this.evento.hora.padStart(2, '0')}:${this.evento.minutos.padStart(2, '0')}:00`;
    const horaFin = `${this.evento.horaFinal.padStart(2, '0')}:${this.evento.minutosFinal.padStart(2, '0')}:00`;

    // Calcular aforo disponible total (suma de todas las categorías)
    const aforoTotal = this.categoriasLocal.reduce((total, categoria) => {
      return total + parseInt(categoria.aforoMaximo);
    }, 0);

    return {
      nombre: this.evento.titulo.trim(),
      descripcion: this.evento.descripcion.trim(),
      fechaEvento: fechaEvento,
      horaInicio: horaInicio,
      horaFin: horaFin,
      imagenUrl: this.evento.videoPromocional || '',
      tipoEvento: this.evento.categoria,
      estadoEvento: this.evento.estado,
      aforoDisponible: aforoTotal || 1000, // Valor por defecto si no hay categorías
      idLocal: parseInt(this.evento.local)
    };
  }

  /**
   * Construye la fecha del evento en formato ISO
   */
  private construirFechaEvento(): string {
    const meses: { [key: string]: string } = {
      'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
      'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
      'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
    };

    const mes = meses[this.evento.mes] || '01';
    const dia = this.evento.dia.padStart(2, '0');
    const anio = this.evento.anio;

    return `${anio}-${mes}-${dia}`;
  }

  /**
   * Limpia todos los campos del formulario
   */
  private limpiarFormulario(): void {
    // Resetear datos del evento
    this.evento = {
      titulo: '',
      categoria: '',
      descripcion: '',
      dia: '',
      mes: '',
      anio: '',
      hora: '',
      minutos: '',
      horaFinal: '',
      minutosFinal: '',
      estado: 'publicado',
      videoPromocional: '',
      banner: null,
      bannerUrl: '',
      local: '',
      mapaUrl: '',
      mapaFile: null,
      moneda: 'Nuevo Sol'
    };

    // Limpiar entradas agregadas
    this.entradasAgregadas = [];
    this.entradaNombre = '';
    this.entradaPrecio = null;
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

    this.messageService.info('Formulario limpiado', 'Información');
  }

  /**
   * Muestra un resumen del evento antes de crearlo
   */
  mostrarResumenEvento(): void {
    const resumen = `
      Título: ${this.evento.titulo}
      Categoría: ${this.evento.categoria}
      Fecha: ${this.evento.dia} de ${this.evento.mes} de ${this.evento.anio}
      Hora: ${this.evento.hora}:${this.evento.minutos} - ${this.evento.horaFinal}:${this.evento.minutosFinal}
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
    if (!this.evento.local) return 'No seleccionado';

    const local = this.localesDisponibles.find(l =>
      l.idLocal.toString() === this.evento.local
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

      // Validar que se haya seleccionado un local
      if (!this.evento.local || this.evento.local.trim() === '') {
        this.messageService.error('Primero debes seleccionar un local antes de subir la imagen del mapa', 'Local Requerido');
        return;
      }

      this.evento.mapaFile = file;

      // Convertir imagen a base64 y actualizar el local
      this.convertirImagenABase64YActualizarLocal(file);
    }
  }

  /**
   * Convierte la imagen del mapa a base64 y actualiza el local
   * @param file Archivo de imagen seleccionado
   */
  private convertirImagenABase64YActualizarLocal(file: File): void {
    // Comprimir y redimensionar la imagen antes de convertirla
    this.comprimirImagen(file)
      .then((imagenComprimida) => {
        // Verificar que la imagen comprimida no exceda 500 caracteres
        if (imagenComprimida.length > 500) {
          this.messageService.error(
            'La imagen es demasiado grande. Por favor, selecciona una imagen más pequeña o de menor resolución.',
            'Imagen Muy Grande'
          );
          return;
        }

        // Guardar para preview
        this.evento.mapaUrl = imagenComprimida;

        // Actualizar el local con la nueva imagen
        this.actualizarLocalConMapa(imagenComprimida);
      })
      .catch((error) => {
        console.error('Error al comprimir imagen:', error);
        this.messageService.error('Error al procesar la imagen. Por favor, intenta con otra imagen.', 'Error de Procesamiento');
      });
  }

  /**
   * Comprime y redimensiona una imagen para que sea lo más pequeña posible
   * @param file Archivo de imagen original
   * @returns Promise con la imagen comprimida en base64
   */
  private comprimirImagen(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones (máximo 100x100 px para mantener tamaño pequeño)
        const maxWidth = 100;
        const maxHeight = 100;
        let { width, height } = img;

        // Mantener proporción
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Intentar diferentes calidades de compresión hasta encontrar una que funcione
        let quality = 0.1; // Comenzar con calidad muy baja
        let imagenComprimida = '';

        const intentarCompresion = () => {
          imagenComprimida = canvas.toDataURL('image/jpeg', quality);

          // Si la imagen es menor a 500 caracteres, usarla
          if (imagenComprimida.length <= 500) {
            resolve(imagenComprimida);
            return;
          }

          // Si aún es muy grande y podemos reducir más la calidad
          if (quality > 0.05) {
            quality -= 0.02;
            setTimeout(intentarCompresion, 10);
          } else {
            // Intentar con PNG si JPEG no funciona
            imagenComprimida = canvas.toDataURL('image/png');
            if (imagenComprimida.length <= 500) {
              resolve(imagenComprimida);
            } else {
              reject(new Error('No se pudo comprimir la imagen lo suficiente'));
            }
          }
        };

        intentarCompresion();
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      // Crear URL de la imagen para cargarla
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }  /**
   * Actualiza el local con la nueva imagen del mapa
   * @param imagenBase64 String en base64 de la imagen
   */
  private actualizarLocalConMapa(imagenBase64: string): void {
    const idLocal = parseInt(this.evento.local);

    if (!idLocal || isNaN(idLocal)) {
      this.messageService.error('ID del local no válido', 'Error');
      return;
    }

    // Buscar los datos del local seleccionado
    const localSeleccionado = this.localesDisponibles.find(local =>
      local.idLocal === idLocal
    );

    if (!localSeleccionado) {
      this.messageService.error('No se encontraron los datos del local seleccionado', 'Error');
      return;
    }

    // Preparar datos para actualizar el local
    const datosLocal: CrearLocalRequest = {
      nombre: localSeleccionado.nombre,
      direccion: localSeleccionado.direccion,
      urlMapa: imagenBase64, // Aquí se guarda la imagen en base64
      aforoTotal: localSeleccionado.aforoTotal,
      idDistrito: localSeleccionado.idDistrito
    };

    // Mostrar mensaje de carga
    this.messageService.info('Actualizando imagen del mapa...', 'Procesando');

    // Llamar al servicio para actualizar el local
    this.localService.putActualizarLocal(idLocal, datosLocal).subscribe({
      next: (response) => {
        this.messageService.success(
          'Imagen del mapa actualizada exitosamente en el local',
          'Operación Exitosa'
        );
        console.log('Local actualizado con imagen del mapa:', response);
      },
      error: (error) => {
        this.messageService.error(
          'Error al actualizar la imagen del mapa en el local: ' + (error.message || 'Error desconocido'),
          'Error'
        );
        console.error('Error al actualizar local con mapa:', error);

        // Limpiar la imagen en caso de error
        this.evento.mapaUrl = '';
        this.evento.mapaFile = null;
      }
    });
  }

  onEliminarMapa(event: any): void {
    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas eliminar la imagen del mapa? Esto también eliminará la imagen del local.',
      () => {
        // Limpiar la imagen del local si hay un local seleccionado
        if (this.evento.local && this.evento.local.trim() !== '') {
          this.eliminarImagenMapaDelLocal();
        } else {
          // Solo limpiar localmente si no hay local seleccionado
          this.limpiarImagenMapaLocal();
        }
      }
    );
  }

  /**
   * Elimina la imagen del mapa del local en el servidor
   */
  private eliminarImagenMapaDelLocal(): void {
    const idLocal = parseInt(this.evento.local);

    if (!idLocal || isNaN(idLocal)) {
      this.messageService.error('ID del local no válido', 'Error');
      return;
    }

    // Buscar los datos del local seleccionado
    const localSeleccionado = this.localesDisponibles.find(local =>
      local.idLocal === idLocal
    );

    if (!localSeleccionado) {
      this.messageService.error('No se encontraron los datos del local seleccionado', 'Error');
      return;
    }

    // Preparar datos para actualizar el local (sin imagen del mapa)
    const datosLocal: CrearLocalRequest = {
      nombre: localSeleccionado.nombre,
      direccion: localSeleccionado.direccion,
      urlMapa: '', // Eliminar la imagen del mapa
      aforoTotal: localSeleccionado.aforoTotal,
      idDistrito: localSeleccionado.idDistrito
    };

    // Mostrar mensaje de carga
    this.messageService.info('Eliminando imagen del mapa...', 'Procesando');

    // Llamar al servicio para actualizar el local
    this.localService.putActualizarLocal(idLocal, datosLocal).subscribe({
      next: (response) => {
        this.limpiarImagenMapaLocal();
        this.messageService.success(
          'Imagen del mapa eliminada exitosamente del local',
          'Operación Exitosa'
        );
        console.log('Local actualizado - imagen del mapa eliminada:', response);
      },
      error: (error) => {
        this.messageService.error(
          'Error al eliminar la imagen del mapa del local: ' + (error.message || 'Error desconocido'),
          'Error'
        );
        console.error('Error al eliminar imagen del mapa del local:', error);
      }
    });
  }

  /**
   * Limpia la imagen del mapa solo localmente (en el componente)
   */
  private limpiarImagenMapaLocal(): void {
    this.evento.mapaUrl = '';
    this.evento.mapaFile = null;
    this.usarMapaDefault = false;
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

