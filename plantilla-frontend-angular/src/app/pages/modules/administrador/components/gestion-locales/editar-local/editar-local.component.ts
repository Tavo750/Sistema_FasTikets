import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { LocalService } from '../../../services/local.service';
import { MessageService as CustomMessageService } from '../../../../../../core/services/message.service';
import { CrearLocalRequest } from '../../../interfaces/gestion-locales/crear-local.interface';
import { ListarLocalesResponse, Data } from '../../../interfaces/gestion-locales/local.interface';

const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-editar-local',
  standalone: false,
  templateUrl: './editar-local.component.html',
  styleUrls: ['./editar-local.component.css']
})
export class EditarLocalComponent implements AfterViewInit, OnInit, OnDestroy {
localForm: FormGroup;
  map!: L.Map;
  private marker!: L.Marker;
  mapLoading = true;
  localId!: number; // ID del local a editar
  isLoading = false; // Para mostrar estado de carga

  // Coordenadas por defecto (Lima, Perú)
  private defaultLat = -12.0464;
  private defaultLng = -77.0428;

  selectedCoordinates = {
    lat: this.defaultLat,
    lng: this.defaultLng
  };

  distritos = [
    { label: 'Seleccionar...', value: '' },
    { label: 'Santiago de Surco', value: 'Santiago de Surco' },
    { label: 'San Juan de Miraflores', value: 'San Juan de Miraflores' },
    { label: 'Jesús María', value: 'Jesús María' }
  ];

  estados = [
    { label: 'HABILITADO', value: 'HABILITADO' },
    { label: 'DESHABILITADO', value: 'DESHABILITADO' }
  ];

  // Mapeo de distritos a sus IDs (esto debería venir de un servicio en una implementación real)
  private distritosMap = new Map([
    ['Santiago de Surco', 1],
    ['San Juan de Miraflores', 2],
    ['Jesús María', 3]
  ]);

  constructor(
      public router: Router,
      private route: ActivatedRoute,
      private messageService: MessageService,
      private fb: FormBuilder,
      private localService: LocalService,
      private customMessageService: CustomMessageService
    ) {
      this.localForm = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        distrito: ['', [Validators.required]],
        aforo: ['', [Validators.required, Validators.min(1)]],
        estado: ['HABILITADO', [Validators.required]],
        latitud: [this.defaultLat, [Validators.required]],
        longitud: [this.defaultLng, [Validators.required]]
      });
    }

  ngOnInit(): void {
    // Obtener el ID del local desde los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.localId = +params['id']; // El + convierte string a número
      if (this.localId) {
        this.cargarDatosLocal();
      }
    });
  }

  /**
   * Carga los datos del local existente para edición
   */
  private cargarDatosLocal(): void {
    this.isLoading = true;
    this.customMessageService.info('Cargando datos del local...', 'Cargando');

    // Primero necesitamos obtener la lista de locales y encontrar el que coincida con el ID
    // Ya que el servicio actual no tiene un método getLocalById
    this.localService.getlistarLocales().subscribe({
      next: (response: ListarLocalesResponse) => {
        if (response && response.ok && response.data) {
          const localEncontrado: Data | undefined = response.data.find((local: Data) => local.idLocal === this.localId);

          if (localEncontrado) {
            // Rellenar el formulario con los datos del local
            this.localForm.patchValue({
              nombre: localEncontrado.nombre,
              direccion: localEncontrado.direccion,
              distrito: localEncontrado.nombreDistrito,
              aforo: localEncontrado.aforoTotal,
              estado: localEncontrado.activo ? 'HABILITADO' : 'DESHABILITADO'
            });

            this.customMessageService.success('Datos del local cargados correctamente', 'Éxito');
          } else {
            this.customMessageService.error('No se encontró el local especificado', 'Error');
            this.router.navigate(['/administrador/gestionLocales']);
          }
        } else {
          this.customMessageService.error('No se pudieron cargar los locales', 'Error');
          this.router.navigate(['/administrador/gestionLocales']);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar los datos del local:', error);
        this.customMessageService.error('Error al cargar los datos del local', 'Error');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Verificar si Leaflet está disponible
    if (typeof L === 'undefined') {
      console.error('Leaflet no está disponible');
      this.showMapError();
      return;
    }

    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private showMapError(): void {
    this.mapLoading = false;
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #dc3545;">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
          <p>Error al cargar el mapa</p>
          <small>Por favor, recarga la página</small>
        </div>
      `;
    }
  }

  private initMap(): void {
    try {
      // Verificar si el elemento del mapa existe
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Elemento del mapa no encontrado');
        return;
      }

      // Configurar iconos por defecto de Leaflet antes de crear el mapa
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });

      // Crear el mapa
      this.map = L.map('map', {
        center: [this.defaultLat, this.defaultLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 5
      }).addTo(this.map);

      // Crear marker inicial con icono explícito
      this.marker = L.marker([this.defaultLat, this.defaultLng], {
        draggable: true,
        icon: iconDefault
      }).addTo(this.map);

      // Agregar un popup informativo al marker
      this.marker.bindPopup('📍 Ubicación del local<br><small>Arrastra para ajustar la posición</small>').openPopup();

      // Evento cuando se hace clic en el mapa
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.updateMarkerPosition(e.latlng.lat, e.latlng.lng);
      });

      // Evento cuando se arrastra el marker
      this.marker.on('dragend', (e: L.DragEndEvent) => {
        const position = (e.target as L.Marker).getLatLng();
        this.updateMarkerPosition(position.lat, position.lng);
      });

      // Invalidar el tamaño del mapa después de un momento para asegurar el renderizado correcto
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.mapLoading = false; // Ocultar indicador de carga
        }
      }, 500);

      console.log('Mapa inicializado correctamente');

    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      this.showMapError();

      // Mostrar mensaje de error al usuario usando customMessageService
      this.customMessageService.error(
        'No se pudo cargar el mapa. Por favor, recarga la página.',
        'Error del mapa'
      );
    }
  }

  private updateMarkerPosition(lat: number, lng: number): void {
    // Actualizar posición del marker
    this.marker.setLatLng([lat, lng]);

    // Actualizar el contenido del popup
    this.marker.setPopupContent(`📍 Ubicación del local<br><small>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</small>`);

    // Actualizar coordenadas seleccionadas
    this.selectedCoordinates = { lat, lng };

    // Actualizar formulario
    this.localForm.patchValue({
      latitud: lat,
      longitud: lng
    });

    // Mostrar mensaje informativo usando el customMessageService
    this.customMessageService.info(
      `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      'Ubicación actualizada'
    );
  }
  reloadMap(): void {
    this.mapLoading = true;

    // Limpiar el contenedor del mapa
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.innerHTML = '';
    }

    // Reintentar inicializar el mapa después de un momento
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  centerMapOnDistrict(): void {
    const distrito = this.localForm.get('distrito')?.value;

    // Coordenadas aproximadas de algunos distritos de Lima
    const distritosCoords: { [key: string]: [number, number] } = {
      'Santiago de Surco': [-12.1267, -76.9956],
      'San Juan de Miraflores': [-12.1586, -76.9733],
      'Jesús María': [-12.0722, -77.0461]
    };

    if (distrito && distritosCoords[distrito]) {
      const coords = distritosCoords[distrito];
      if (this.map) {
        this.map.setView(coords, 15);
        this.updateMarkerPosition(coords[0], coords[1]);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  guardarCambiosLocal(): void {
    if (this.localForm.invalid) {
      this.customMessageService.warn('Por favor complete todos los campos correctamente antes de continuar', 'Campos incompletos');
      this.localForm.markAllAsTouched();
      return;
    }

    const formData = this.localForm.value;

    // Preparar los datos para enviar al API según la interfaz CrearLocalRequest
    const localData: CrearLocalRequest = {
      nombre: formData.nombre,
      direccion: formData.direccion,
      aforoTotal: formData.aforo,
      idDistrito: this.distritosMap.get(formData.distrito) || 1 // Obtener el ID del distrito
    };

    this.isLoading = true;
    this.customMessageService.info('Actualizando datos del local...', 'Procesando');

    // Llamar al servicio para actualizar el local
    this.localService.putActualizarLocal(this.localId, localData).subscribe({
      next: (response) => {
        console.log('Local actualizado:', response);

        if (response.ok) {
          this.customMessageService.success(
            `Local "${localData.nombre}" actualizado exitosamente`,
            'Actualización completada'
          );

          // Redirigir después de mostrar el mensaje de éxito
          setTimeout(() => {
            this.router.navigate(['/administrador/gestionLocales']);
          }, 2000);
        } else {
          this.customMessageService.error(response.mensaje || 'Error al actualizar el local', 'Error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar el local:', error);
        this.customMessageService.error(
          'Error al actualizar el local. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.isLoading = false;
      }
    });
  }
}
