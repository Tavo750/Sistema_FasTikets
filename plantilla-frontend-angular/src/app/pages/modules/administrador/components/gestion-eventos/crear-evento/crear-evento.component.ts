import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
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
  categoriasLocal: Categoria[] = [
    {
      nombre: 'General',
      aforoMaximo: '25000',
      aforoDisponible: '914'
    },
    {
      nombre: 'Premium',
      aforoMaximo: '15000',
      aforoDisponible: 'VENDIDO'
    }
  ];
  entradas: { regular: TipoEntrada; preventa: TipoEntrada } = {
    regular: {
      nombre: 'Regular',
      categorias: [
        { nombre: 'General', estado: 'activo' },
        { nombre: 'Premium', estado: 'activo' }
      ]
    },
    preventa: {
      nombre: 'Preventa',
      categorias: [
        { nombre: 'General', estado: 'activo' }
      ]
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

  validoParaOptions: EstadoOption[] = [
    { label: 'Seleccionar', value: '' },
    { label: 'General', value: 'general' },
    { label: 'Premium', value: 'premium' },
    { label: 'VIP', value: 'vip' }
  ];

  entradaNombre: string = '';
  validoPara: string = '';

  // Nuevas propiedades para la sección de Local y asientos
  localesOptions: EstadoOption[] = [
    { label: 'Seleccionar', value: '' },
    { label: 'Estadio Nacional', value: 'estadio-nacional' },
    { label: 'Arena Lima', value: 'arena-lima' },
    { label: 'Parque de la Exposición', value: 'parque-exposicion' },
    { label: 'Club Nacional', value: 'club-nacional' }
  ];

  nuevaCategoria = {
    nombre: '',
    aforoMaximo: ''
  };

  constructor(
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Aquí puedes cargar datos del evento si estás editando

    this.cargarEvento();
  }

  cargarEvento(): void {
    // Simulación de carga de datos
    // En una aplicación real, aquí harías una llamada al servicio
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

  onEliminarBanner(): void {
    if (confirm('¿Estás seguro de que deseas eliminar el banner?')) {
      this.evento.bannerUrl = '';
      this.evento.banner = null;
      this.usarBannerDefault = false;
      this.messageService.success('Banner eliminado exitosamente', 'Operación Exitosa');
    }
  }

  onCancelarEvento(): void {
    if (confirm('¿Estás seguro de que deseas cancelar este evento?')) {
      this.messageService.info('Evento cancelado exitosamente', 'Operación Completada');
      // Redirigir a gestión de eventos
      this.router.navigate(['/administrador/gestionEventos']);
    }
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
      this.messageService.error('La hora completa es obligatoria', 'Campo Requerido');
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

  onEliminarMapa(): void {
    if (confirm('¿Estás seguro de que deseas eliminar la imagen del mapa?')) {
      this.evento.mapaUrl = '';
      this.evento.mapaFile = null;
      this.usarMapaDefault = false;
      this.messageService.success('Imagen del mapa eliminada exitosamente', 'Operación Exitosa');
    }
  }

  onAgregarEntrada(): void {
    if (!this.entradaNombre.trim()) {
      this.messageService.error('Por favor ingresa un nombre para la entrada', 'Campo Requerido');
      return;
    }

    if (!this.validoPara) {
      this.messageService.error('Por favor selecciona para qué categoría es válida la entrada', 'Campo Requerido');
      return;
    }

    // Aquí puedes implementar la lógica para agregar la entrada a una lista
    // Por ejemplo, agregar a un array de entradas

    // Limpiar los campos después de agregar
    this.entradaNombre = '';
    this.validoPara = '';

    this.messageService.success('Entrada agregada exitosamente', 'Operación Exitosa');
  }

  onAgregarCategoria(): void {
    if (!this.nuevaCategoria.nombre.trim()) {
      this.messageService.error('Por favor ingresa un nombre para la categoría', 'Campo Requerido');
      return;
    }

    if (!this.nuevaCategoria.aforoMaximo.trim()) {
      this.messageService.error('Por favor ingresa el aforo máximo', 'Campo Requerido');
      return;
    }

    // Verificar que el aforo sea un número válido
    const aforo = parseInt(this.nuevaCategoria.aforoMaximo);
    if (isNaN(aforo) || aforo <= 0) {
      this.messageService.error('El aforo máximo debe ser un número válido mayor a 0', 'Valor Inválido');
      return;
    }

    // Agregar la nueva categoría
    const nuevaCat: Categoria = {
      nombre: this.nuevaCategoria.nombre,
      aforoMaximo: this.nuevaCategoria.aforoMaximo,
      aforoDisponible: this.nuevaCategoria.aforoMaximo // Inicialmente todo disponible
    };

    this.categoriasLocal.push(nuevaCat);

    // Limpiar los campos
    this.nuevaCategoria = {
      nombre: '',
      aforoMaximo: ''
    };

    this.messageService.success('Categoría agregada exitosamente', 'Operación Exitosa');
  }

  onEliminarCategoria(index: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriasLocal.splice(index, 1);
      this.messageService.success('Categoría eliminada exitosamente', 'Operación Exitosa');
    }
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

}

