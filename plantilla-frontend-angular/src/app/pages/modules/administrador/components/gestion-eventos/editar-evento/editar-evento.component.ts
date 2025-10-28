import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
import { ConfirmPopupService } from '../../../../../../core/services/confirm-popup.service';
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
  selector: 'app-editar-evento',
  standalone: false,
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent implements OnInit{
evento: Evento = {
    titulo: 'Electronic Festival',
    categoria: 'ELECTRONICA',
    descripcion: 'Descripción genérica de concierto porque no ando creativo.',
     dia: '30',
    mes: 'Julio',
    anio: '2025',
    hora: '23',
    minutos: '00',
    estado: 'PUBLICADO',
    videoPromocional: 'Link completamente normal...',
    banner: null,
    bannerUrl: '',
    local: 'Parque de la exposición',
    mapaUrl: '',
    mapaFile: null,
    moneda: 'Nuevo Sol'

  };

  date: Date | undefined;
  time: Date[] | undefined;
  timeEnd: Date[] | undefined;


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
    { label: 'Reggaetón', value: 'REGGAETON' },
    //{ label: 'Cine', value: 'CINE' },
    //{ label: 'Otro', value: 'OTRO' },
    { label: 'Electrónica', value: 'ELECTRONICA' },
    { label: 'Rock Pop', value: 'ROCK_POP' },
    { label: 'Urbano', value: 'URBANO' },
    //{ label: 'Obra Teatral', value: 'OBRA_TEATRAL' }
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
    estadoEntradaOptions: EstadoOption[] = [
    { label: 'ACTIVO', value: 'activo' },
    { label: 'INACTIVO', value: 'inactivo' },
    { label: 'AGOTADO', value: 'agotado' }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmPopupService: ConfirmPopupService
  ) { }

  ngOnInit(): void {
    // Aquí puedes cargar datos del evento si estás editando

    this.cargarEvento();
  }

  cargarEvento(): void {
    // Simulación de carga de datos
    // En una aplicación real, aquí harías una llamada al servicio
  }

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
        this.evento.banner = null;
        this.evento.bannerUrl = '';
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
    // this.eventoService.actualizarEvento(this.evento).subscribe(...)

    this.messageService.success('Cambios guardados exitosamente', 'Evento Actualizado');
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

      this.messageService.success('Mapa seleccionado exitosamente', 'Archivo Cargado');
    }
  }

  onEliminarMapa(event: any): void {
    this.confirmPopupService.confirmDelete(
      event,
      '¿Estás seguro de que deseas eliminar la imagen del mapa?',
      () => {
        this.evento.mapaUrl = '';
        this.evento.mapaFile = null;
        this.messageService.success('Imagen del mapa eliminada exitosamente', 'Operación Exitosa');
      }
    );
  }


  // Métodos adicionales para manejar el mapa, categorías, etc. podrían ir aquí

}
