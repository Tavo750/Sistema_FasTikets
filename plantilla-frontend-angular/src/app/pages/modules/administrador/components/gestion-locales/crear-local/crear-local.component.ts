import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '../../../services/local.service';
import { CrearLocalRequest } from '../../../interfaces/gestion-locales/crear-local.interface';
import * as L from 'leaflet';

// Configuración para corregir los iconos de Leaflet usando CDN
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
  selector: 'app-crear-local',
  standalone: false,
  templateUrl: './crear-local.component.html',
  styleUrls: ['./crear-local.component.css']
})


export class CrearLocalComponent implements AfterViewInit, OnDestroy {
  localForm: FormGroup;
  map!: L.Map;
  private marker!: L.Marker;
  mapLoading = true;

  // Coordenadas por defecto (Lima, Perú)
  private defaultLat = -12.0464;
  private defaultLng = -77.0428;

  selectedCoordinates = {
    lat: this.defaultLat,
    lng: this.defaultLng
  };

  distritos = [
    { label: 'Seleccionar...', value: null },
    { label: 'Santiago de Surco', value: 1 },
    { label: 'San Juan de Miraflores', value: 2 },
    { label: 'Jesús María', value: 3 }
  ];

  estados = [
    { label: 'HABILITADO', value: 'HABILITADO' },
    { label: 'DESHABILITADO', value: 'DESHABILITADO' }
  ];

  constructor(
      public router: Router,
      private messageService: MessageService,
      private fb: FormBuilder,
      private localService: LocalService
    ) {
      this.localForm = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        idDistrito: [null, [Validators.required]],
        aforoTotal: ['', [Validators.required, Validators.min(1)]],
        estado: ['HABILITADO', [Validators.required]],
        latitud: [this.defaultLat, [Validators.required]],
        longitud: [this.defaultLng, [Validators.required]]
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

      // Mostrar mensaje de error al usuario
      this.messageService.error(
        'No se pudo cargar el mapa. Por favor, recarga la página.',
        'Error del mapa',
        5000
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

    // Mostrar mensaje informativo
    this.messageService.info(
      `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      'Ubicación actualizada',
      2000
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
    const distritoId = this.localForm.get('idDistrito')?.value;

    // Coordenadas aproximadas de algunos distritos de Lima
    const distritosCoords: { [key: number]: [number, number] } = {
      1: [-12.1267, -76.9956], // Santiago de Surco
      2: [-12.1586, -76.9733], // San Juan de Miraflores
      3: [-12.0722, -77.0461]  // Jesús María
    };

    if (distritoId && distritosCoords[distritoId]) {
      const coords = distritosCoords[distritoId];
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

  crearLocal(): void {
    if (this.localForm.invalid) {
      this.messageService.warn(
        'Por favor complete todos los campos correctamente antes de continuar',
        'Campos incompletos',
        3000
      );
      this.localForm.markAllAsTouched();
      return;
    }

    const formData = this.localForm.value;

    // Crear el objeto de datos según la interfaz CrearLocalRequest
    const localData: CrearLocalRequest = {
      nombre: formData.nombre,
      direccion: formData.direccion,
      aforoTotal: formData.aforoTotal,
      idDistrito: formData.idDistrito
    };

    // Llamar al servicio para crear el local
    this.localService.postCrearLocal(localData).subscribe({
      next: (response) => {
        console.log('Local creado exitosamente:', response);

        // Mostrar mensaje de éxito
        this.messageService.success(
          `Local "${localData.nombre}" registrado exitosamente en las coordenadas: ${formData.latitud.toFixed(6)}, ${formData.longitud.toFixed(6)}`,
          'Local creado',
          4000
        );

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/administrador/gestionLocales']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al crear el local:', error);

        // Mostrar mensaje de error
        this.messageService.error(
          'No se pudo crear el local. Por favor, inténtelo de nuevo.',
          'Error al crear local',
          5000
        );
      }
    });
  }
}
