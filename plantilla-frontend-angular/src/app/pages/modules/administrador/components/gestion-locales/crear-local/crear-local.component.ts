import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '../../../services/local.service';
import { CrearLocalRequest } from '../../../interfaces/gestion-locales/crear-local.interface';
import { RegistroUsuarioService } from '../../../../../../core/services/registro-usuario.service';
import { Departamento, Distrito, Provincia } from '../../../../../../core/interfaces/ubigeo.interface';
import * as L from 'leaflet';
import { getCoordenadasPorUbigeo, tieneCoordenadasEspecificas } from './distritos-coordenadas';

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


export class CrearLocalComponent implements OnInit, AfterViewInit, OnDestroy {
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

  // Listas para los dropdowns de ubigeo
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];

  estados = [
    { label: 'HABILITADO', value: 'HABILITADO' },
    { label: 'DESHABILITADO', value: 'DESHABILITADO' }
  ];

  constructor(
      public router: Router,
      private messageService: MessageService,
      private fb: FormBuilder,
      private localService: LocalService,
      private registroUsuarioService: RegistroUsuarioService
    ) {
      this.localForm = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        idDepartamento: [null, [Validators.required]],
        idProvincia: [null, [Validators.required]],
        idDistrito: [null, [Validators.required]],
        aforoTotal: ['', [Validators.required, Validators.min(1)]],
        estado: ['HABILITADO', [Validators.required]],
        latitud: [this.defaultLat, [Validators.required]],
        longitud: [this.defaultLng, [Validators.required]]
      });
    }

  ngOnInit(): void {
    this.cargarDepartamentos();
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

  // Métodos para cargar ubigeo en cascada
  cargarDepartamentos(): void {
    this.registroUsuarioService.getDepartamentos().subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.departamentos = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar departamentos:', error);
        this.messageService.error('Error al cargar los departamentos', 'Error', 3000);
      }
    });
  }

  onDepartamentoChange(event: any): void {
    const departamentoId = event.value;

    // Reiniciar provincia y distrito
    this.localForm.patchValue({
      idProvincia: null,
      idDistrito: null
    });
    this.provincias = [];
    this.distritos = [];

    if (departamentoId) {
      this.cargarProvincias(departamentoId);
    }
  }

  cargarProvincias(departamentoId: number): void {
    this.registroUsuarioService.getProvincias(departamentoId.toString()).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.provincias = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar provincias:', error);
        this.messageService.error('Error al cargar las provincias', 'Error', 3000);
      }
    });
  }

  onProvinciaChange(event: any): void {
    const provinciaId = event.value;

    // Reiniciar distrito
    this.localForm.patchValue({
      idDistrito: null
    });
    this.distritos = [];

    if (provinciaId) {
      this.cargarDistritos(provinciaId);
    }
  }

  cargarDistritos(provinciaId: number): void {
    this.registroUsuarioService.getDistritos(provinciaId.toString()).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.distritos = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar distritos:', error);
        this.messageService.error('Error al cargar los distritos', 'Error', 3000);
      }
    });
  }

  onDistritoChange(event: any): void {
    const distritoId = event.value;
    if (distritoId) {
      // Centrar el mapa automáticamente cuando se selecciona un distrito
      this.centerMapOnDistrict();
    }
  }

  centerMapOnDistrict(): void {
    const distritoId = this.localForm.get('idDistrito')?.value;

    if (!distritoId) {
      this.messageService.warn(
        'Por favor seleccione un distrito',
        'Distrito no seleccionado',
        3000
      );
      return;
    }

    // Buscar el distrito seleccionado en la lista para obtener su nombre
    const distritoSeleccionado = this.distritos.find(d => d.idDistrito === distritoId);

    if (!distritoSeleccionado) {
      console.warn('Distrito no encontrado en la lista:', distritoId);
      return;
    }

    // Convertir el idDistrito a string con formato de 6 dígitos (ubigeo)
    // El idDistrito del backend corresponde al código de ubigeo
    const ubigeoId = distritoId.toString().padStart(6, '0');

    // Obtener las coordenadas usando el archivo de coordenadas
    const coords = getCoordenadasPorUbigeo(ubigeoId);

    if (this.map && coords) {
      // Centrar el mapa en las coordenadas del distrito
      this.map.setView(coords, 15);
      this.updateMarkerPosition(coords[0], coords[1]);

      // Verificar si son coordenadas específicas o por defecto
      if (tieneCoordenadasEspecificas(ubigeoId)) {
        this.messageService.success(
          `Mapa centrado en ${distritoSeleccionado.nombre}`,
          'Ubicación encontrada',
          3000
        );
      } else {
        this.messageService.info(
          `Coordenadas aproximadas para ${distritoSeleccionado.nombre}. Ajusta la ubicación manualmente.`,
          'Ubicación aproximada',
          4000
        );
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
      urlMapa:formData.urlMapa,
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
