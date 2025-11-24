import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../../../../../../core/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '../../../services/local.service';
import { CrearLocalRequest } from '../../../interfaces/gestion-locales/crear-local.interface';
import { RegistroUsuarioService } from '../../../../../../core/services/registro-usuario.service';
import { Departamento, Distrito, Provincia } from '../../../../../../core/interfaces/ubigeo.interface';
import { GOOGLE_MAPS_CONFIG } from '../../../../../../config/google-maps.config';

// Declarar Google Maps para TypeScript
declare global {
  interface Window {
    google: any;
  }
}

declare var google: any;
@Component({
  selector: 'app-crear-local',
  standalone: false,
  templateUrl: './crear-local.component.html',
  styleUrls: ['./crear-local.component.css']
})


export class CrearLocalComponent implements OnInit, AfterViewInit, OnDestroy {
  localForm: FormGroup;
  map!: any;
  private marker!: any;
  private geocoder!: any;
  private autocompleteService!: any;
  mapLoading = true;

  // Coordenadas por defecto (Lima, Perú)
  private defaultLat = GOOGLE_MAPS_CONFIG.defaultCenter.lat;
  private defaultLng = GOOGLE_MAPS_CONFIG.defaultCenter.lng;

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
    // Verificar si Google Maps está disponible
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps no está disponible');
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

      // Inicializar servicios de Google Maps
      this.geocoder = new google.maps.Geocoder();
      this.autocompleteService = new google.maps.places.AutocompleteService();

      // Crear el mapa
      this.map = new google.maps.Map(mapElement, {
        center: { lat: this.defaultLat, lng: this.defaultLng },
        zoom: 13,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });

      // Crear marker inicial
      this.marker = new google.maps.Marker({
        position: { lat: this.defaultLat, lng: this.defaultLng },
        map: this.map,
        draggable: true,
        title: 'Ubicación del local'
      });

      // Crear InfoWindow para mostrar información
      const infoWindow = new google.maps.InfoWindow({
        content: '📍 Ubicación del local<br><small>Arrastra para ajustar la posición</small>'
      });

      // Mostrar InfoWindow inicial
      infoWindow.open(this.map, this.marker);

      // Evento cuando se hace clic en el mapa
      this.map.addListener('click', (e: any) => {
        if (e.latLng) {
          this.updateMarkerPosition(e.latLng.lat(), e.latLng.lng());
        }
      });

      // Evento cuando se arrastra el marker
      this.marker.addListener('dragend', () => {
        const position = this.marker.getPosition();
        if (position) {
          this.updateMarkerPosition(position.lat(), position.lng());
        }
      });

      // Ocultar indicador de carga
      setTimeout(() => {
        this.mapLoading = false;
      }, 500);

      console.log('Mapa de Google Maps inicializado correctamente');

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
    this.marker.setPosition({ lat, lng });

    // Crear nueva InfoWindow con coordenadas actualizadas
    const infoWindow = new google.maps.InfoWindow({
      content: `📍 Ubicación del local<br><small>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</small>`
    });

    // Mostrar InfoWindow actualizada
    infoWindow.open(this.map, this.marker);

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
        this.messageService.error('Error al cargar los departamentos', 'Error', 1000);
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
        this.messageService.error('Error al cargar las provincias', 'Error', 1000);
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
        this.messageService.error('Error al cargar los distritos', 'Error', 1000);
      }
    });
  }
  // Método para buscar dirección automáticamente
  buscarDireccion(): void {
    const direccion = this.localForm.get('direccion')?.value;

    if (!direccion || direccion.length < 5) {
      this.messageService.warn(
        'Ingresa una dirección más específica para buscar',
        'Dirección muy corta',
        1000
      );
      return;
    }

    // Construir dirección completa con ubigeo si está disponible
    let direccionCompleta = direccion;

    const distritoSeleccionado = this.distritos.find(d => d.idDistrito === this.localForm.get('idDistrito')?.value);
    const provinciaSeleccionada = this.provincias.find(p => p.idProvincia === this.localForm.get('idProvincia')?.value);
    const departamentoSeleccionado = this.departamentos.find(d => d.idDepartamento === this.localForm.get('idDepartamento')?.value);

    if (distritoSeleccionado && provinciaSeleccionada && departamentoSeleccionado) {
      direccionCompleta = `${direccion}, ${distritoSeleccionado.nombre}, ${provinciaSeleccionada.nombre}, ${departamentoSeleccionado.nombre}, Perú`;
    } else {
      direccionCompleta = `${direccion}, Perú`;
    }

    this.geocoder.geocode({ address: direccionCompleta }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        // Centrar el mapa en la dirección encontrada
        this.map.setCenter({ lat, lng });
        this.map.setZoom(17); // Zoom más cercano para direcciones específicas
        this.updateMarkerPosition(lat, lng);

        this.messageService.success(
          `Dirección encontrada: ${results[0].formatted_address}`,
          'Ubicación encontrada',
          4000
        );
      } else {
        console.warn('Geocoding falló para:', direccionCompleta, status);
        this.messageService.warn(
          `No se pudo encontrar la dirección "${direccion}". Verifica que esté correcta o ajusta la ubicación manualmente.`,
          'Dirección no encontrada',
          5000
        );
      }
    });
  }

  ngOnDestroy(): void {
    // Google Maps se limpia automáticamente cuando el componente se destruye
    if (this.map) {
      // Limpiar listeners si es necesario
      google.maps.event.clearInstanceListeners(this.map);
    }
  }

  crearLocal(): void {
    if (this.localForm.invalid) {
      this.messageService.warn(
        'Por favor complete todos los campos correctamente antes de continuar',
        'Campos incompletos',
        1000
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
