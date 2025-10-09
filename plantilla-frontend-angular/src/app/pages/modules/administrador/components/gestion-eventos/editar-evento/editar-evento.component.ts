import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  styleUrl: './editar-evento.component.scss'
})
export class EditarEventoComponent implements OnInit{
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Aquí puedes cargar datos del evento si estás editando

    this.cargarEvento();
  }

  cargarEvento(): void {
    // Simulación de carga de datos
    // En una aplicación real, aquí harías una llamada al servicio
    console.log('Cargando evento...');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (por ejemplo, máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      this.evento.banner = file;
      console.log('Banner seleccionado:', file.name);

      // Aquí podrías mostrar una preview de la imagen
      this.mostrarPreview(file);
    }
  }

  mostrarPreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log('Preview cargado:', e.target.result);
      // Aquí podrías actualizar una variable para mostrar el preview en el HTML
    };
    reader.readAsDataURL(file);
  }

  onCancelarEvento(): void {
    if (confirm('¿Estás seguro de que deseas cancelar este evento?')) {
      console.log('Evento cancelado');

      // Redirigir a gestión de eventos
      this.router.navigate(['/administrador/gestionEventos']);
    }
  }

  onGuardarCambios(): void {
    // Validaciones básicas
    if (!this.validarFormulario()) {
      return;
    }

    console.log('Guardando cambios del evento:', this.evento);

    // Aquí implementarías la lógica para guardar
    // Por ejemplo, llamar a un servicio:
    // this.eventoService.actualizarEvento(this.evento).subscribe(...)

    alert('Cambios guardados exitosamente');
  }

  validarFormulario(): boolean {
    if (!this.evento.titulo || this.evento.titulo.trim() === '') {
      alert('El título es obligatorio');
      return false;
    }

    if (!this.evento.categoria || this.evento.categoria.trim() === '') {
      alert('La categoría es obligatoria');
      return false;
    }

    if (!this.evento.descripcion || this.evento.descripcion.trim() === '') {
      alert('La descripción es obligatoria');
      return false;
    }



    if (!this.evento.hora || !this.evento.minutos) {
      alert('La hora completa es obligatoria');
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
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (por ejemplo, máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      this.evento.mapaFile = file;

      // Crear URL para mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.evento.mapaUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('Mapa seleccionado:', file.name);
    }
  }


  // Métodos adicionales para manejar el mapa, categorías, etc. podrían ir aquí

}
