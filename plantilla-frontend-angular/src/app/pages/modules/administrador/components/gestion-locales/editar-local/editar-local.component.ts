import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

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
export class EditarLocalComponent implements AfterViewInit {
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
    { label: 'Seleccionar...', value: '' },
    { label: 'Santiago de Surco', value: 'Santiago de Surco' },
    { label: 'San Juan de Miraflores', value: 'San Juan de Miraflores' },
    { label: 'Jesús María', value: 'Jesús María' }
  ];

  estados = [
    { label: 'HABILITADO', value: 'HABILITADO' },
    { label: 'DESHABILITADO', value: 'DESHABILITADO' }
  ];

  constructor(
      public router: Router,
      private messageService: MessageService,
      private fb: FormBuilder
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
      this.messageService.add({
        severity: 'error',
        summary: 'Error del mapa',
        detail: 'No se pudo cargar el mapa. Por favor, recarga la página.',
        life: 5000
      });
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
    this.messageService.add({
      severity: 'info',
      summary: 'Ubicación actualizada',
      detail: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      life: 2000
    });
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor complete todos los campos correctamente antes de continuar',
        life: 3000
      });
      this.localForm.markAllAsTouched();
      return;
    }

    const formData = this.localForm.value;

    // Incluir las coordenadas en los datos del formulario
    console.log('Datos del local:', {
      ...formData,
      ubicacion: {
        latitud: formData.latitud,
        longitud: formData.longitud
      }
    });

    // Mostrar mensaje de éxito
    this.messageService.add({
      severity: 'success',
      summary: 'Local creado',
      detail: `Local registrado exitosamente en las coordenadas: ${formData.latitud.toFixed(6)}, ${formData.longitud.toFixed(6)}`,
      life: 4000
    });

    // Redirigir después de 2 segundos
    setTimeout(() => {
      this.router.navigate(['/administrador/gestionLocales']);
    }, 2000);
  }
}
