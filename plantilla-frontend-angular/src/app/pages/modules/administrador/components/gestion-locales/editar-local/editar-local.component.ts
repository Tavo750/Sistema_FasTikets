import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '../../../services/local.service';
import { MessageService as CustomMessageService } from '../../../../../../core/services/message.service';
import { LoadingService } from '../../../../../../shared/services/loading.service';
import { CrearLocalRequest } from '../../../interfaces/gestion-locales/crear-local.interface';
import { ListarLocalesResponse, Data } from '../../../interfaces/gestion-locales/local.interface';
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
  selector: 'app-editar-local',
  standalone: false,
  templateUrl: './editar-local.component.html',
  styleUrls: ['./editar-local.component.css']
})
export class EditarLocalComponent implements AfterViewInit, OnInit, OnDestroy {
localForm: FormGroup;
  map!: any;
  private marker!: any;
  private geocoder!: any;
  private autocompleteService!: any;
  mapLoading = true;
  localId!: number; // ID del local a editar

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
      private route: ActivatedRoute,
      private messageService: MessageService,
      private fb: FormBuilder,
      private localService: LocalService,
      private customMessageService: CustomMessageService,
      private registroUsuarioService: RegistroUsuarioService,
      private loadingService: LoadingService
    ) {
      this.localForm = this.fb.group({
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        idDepartamento: [null, [Validators.required]],
        idProvincia: [null, [Validators.required]],
        idDistrito: [null, [Validators.required]],
        aforo: ['', [Validators.required, Validators.min(1)]],
        estado: ['HABILITADO', [Validators.required]],
        latitud: [this.defaultLat, [Validators.required]],
        longitud: [this.defaultLng, [Validators.required]]
      });
    }

  ngOnInit(): void {
    // Cargar departamentos primero
    this.cargarDepartamentos();

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
    this.loadingService.show();
    this.customMessageService.info('Cargando datos del local...', 'Cargando');

    // Primero necesitamos obtener la lista de locales y encontrar el que coincida con el ID
    // Ya que el servicio actual no tiene un método getLocalById
    this.localService.getlistarLocales().subscribe({
      next: (response: ListarLocalesResponse) => {
        if (response && response.ok && response.data) {
          const localEncontrado: Data | undefined = response.data.find((local: Data) => local.idLocal === this.localId);

          if (localEncontrado) {
            // Cargar ubigeo según el distrito del local
            this.cargarUbigeoPorDistrito(localEncontrado.idDistrito, localEncontrado);
          } else {
            this.customMessageService.error('No se encontró el local especificado', 'Error');
            this.router.navigate(['/administrador/gestionLocales']);
            this.loadingService.hide();
          }
        } else {
          this.customMessageService.error('No se pudieron cargar los locales', 'Error');
          this.router.navigate(['/administrador/gestionLocales']);
          this.loadingService.hide();
        }
      },
      error: (error: any) => {
        console.error('Error al cargar los datos del local:', error);
        this.customMessageService.error('Error al cargar los datos del local', 'Error');
        this.loadingService.hide();
      }
    });
  }

  /**
   * Carga el departamento y provincia según el distrito seleccionado
   * y llena el formulario con los datos del local
   */
  private cargarUbigeoPorDistrito(idDistrito: number, localData: Data): void {
    // Buscar el distrito en todas las provincias y departamentos
    // Como no tenemos un servicio directo, cargamos todos los departamentos
    // y buscamos el distrito correspondiente
    this.registroUsuarioService.getDepartamentos().subscribe({
      next: (deptResponse) => {
        if (deptResponse.ok && deptResponse.data) {
          this.departamentos = deptResponse.data;

          // Buscar en cada departamento sus provincias
          let encontrado = false;
          let currentDeptIndex = 0;

          const buscarEnDepartamentos = () => {
            if (currentDeptIndex >= this.departamentos.length || encontrado) {
              if (!encontrado) {
                // Si no se encontró, solo llenar los datos básicos
                this.localForm.patchValue({
                  nombre: localData.nombre,
                  direccion: localData.direccion,
                  idDistrito: idDistrito,
                  aforo: localData.aforoTotal,
                  estado: localData.activo ? 'HABILITADO' : 'DESHABILITADO'
                });
                this.customMessageService.success('Datos del local cargados correctamente', 'Éxito');
                this.loadingService.hide();
              }
              return;
            }

            const dept = this.departamentos[currentDeptIndex];
            this.registroUsuarioService.getProvincias(dept.idDepartamento.toString()).subscribe({
              next: (provResponse) => {
                if (provResponse.ok && provResponse.data && !encontrado) {
                  let currentProvIndex = 0;

                  const buscarEnProvincias = () => {
                    if (currentProvIndex >= provResponse.data.length || encontrado) {
                      currentDeptIndex++;
                      buscarEnDepartamentos();
                      return;
                    }

                    const prov = provResponse.data[currentProvIndex];
                    this.registroUsuarioService.getDistritos(prov.idProvincia.toString()).subscribe({
                      next: (distResponse) => {
                        if (distResponse.ok && distResponse.data && !encontrado) {
                          const distritoEncontrado = distResponse.data.find(d => d.idDistrito === idDistrito);

                          if (distritoEncontrado) {
                            encontrado = true;
                            // Cargar las provincias del departamento encontrado
                            this.cargarProvincias(dept.idDepartamento);
                            // Esperar a que se carguen las provincias
                            setTimeout(() => {
                              // Cargar los distritos de la provincia encontrada
                              this.cargarDistritos(prov.idProvincia);
                              // Esperar a que se carguen los distritos
                              setTimeout(() => {
                                // Llenar el formulario
                                this.localForm.patchValue({
                                  nombre: localData.nombre,
                                  direccion: localData.direccion,
                                  idDepartamento: dept.idDepartamento,
                                  idProvincia: prov.idProvincia,
                                  idDistrito: idDistrito,
                                  aforo: localData.aforoTotal,
                                  estado: localData.activo ? 'HABILITADO' : 'DESHABILITADO'
                                });
                                this.customMessageService.success('Datos del local cargados correctamente', 'Éxito');
                                this.loadingService.hide();
                              }, 300);
                            }, 300);
                          } else {
                            currentProvIndex++;
                            buscarEnProvincias();
                          }
                        }
                      },
                      error: () => {
                        currentProvIndex++;
                        buscarEnProvincias();
                      }
                    });
                  };

                  buscarEnProvincias();
                } else {
                  currentDeptIndex++;
                  buscarEnDepartamentos();
                }
              },
              error: () => {
                currentDeptIndex++;
                buscarEnDepartamentos();
              }
            });
          };

          buscarEnDepartamentos();
        }
      },
      error: (error) => {
        console.error('Error al cargar departamentos:', error);
        this.customMessageService.error('Error al cargar los datos de ubicación', 'Error');
        this.loadingService.hide();
      }
    });
  }

  ngAfterViewInit(): void {
    // Esperar a que Google Maps se cargue
    this.waitForGoogleMaps();
  }

  private waitForGoogleMaps(): void {
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo

    const checkGoogleMaps = () => {
      attempts++;

      if (typeof google !== 'undefined' && google.maps) {
        console.log('Google Maps cargado correctamente');
        setTimeout(() => {
          this.initMap();
        }, 100);
      } else if (attempts < maxAttempts) {
        setTimeout(checkGoogleMaps, 100);
      } else {
        console.error('Google Maps no se pudo cargar después de 5 segundos');
        this.showMapError();
        this.customMessageService.error(
          'No se pudo cargar Google Maps. Verifica la conexión a internet y la configuración de la API Key.',
          'Error de Google Maps'
        );
      }
    };

    checkGoogleMaps();
  }

  private showMapError(): void {
    this.mapLoading = false;
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #dc3545; padding: 20px; text-align: center;">
          <i class="pi pi-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
          <h4 style="margin-bottom: 10px;">Google Maps no disponible</h4>
          <p style="margin-bottom: 15px;">Necesitas configurar una API Key válida de Google Maps</p>
          <small style="color: #666;">
            <strong>Pasos:</strong><br>
            1. Ve a <a href="https://console.cloud.google.com" target="_blank">Google Cloud Console</a><br>
            2. Habilita Maps JavaScript API, Places API, Geocoding API<br>
            3. Crea una API Key<br>
            4. Actualiza el archivo src/index.html con tu API Key
          </small>
          <div style="margin-top: 15px;">
            <button onclick="window.location.reload()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              🔄 Recargar página
            </button>
          </div>
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

      // Mostrar mensaje de error al usuario usando customMessageService
      this.customMessageService.error(
        'No se pudo cargar el mapa. Por favor, recarga la página.',
        'Error del mapa'
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
        this.customMessageService.error('Error al cargar los departamentos', 'Error');
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
        this.customMessageService.error('Error al cargar las provincias', 'Error');
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
        this.customMessageService.error('Error al cargar los distritos', 'Error');
      }
    });
  }



  // Método para buscar dirección automáticamente
  buscarDireccion(): void {
    const direccion = this.localForm.get('direccion')?.value;

    if (!direccion || direccion.length < 5) {
      this.customMessageService.warn(
        'Ingresa una dirección más específica para buscar',
        'Dirección muy corta'
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

        this.customMessageService.success(
          `Dirección encontrada: ${results[0].formatted_address}`,
          'Ubicación encontrada'
        );
      } else {
        console.warn('Geocoding falló para:', direccionCompleta, status);
        this.customMessageService.warn(
          `No se pudo encontrar la dirección "${direccion}". Verifica que esté correcta o ajusta la ubicación manualmente.`,
          'Dirección no encontrada'
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
      urlMapa: formData.urlMapa,
      aforoTotal: formData.aforo,
      idDistrito: formData.idDistrito
    };

    this.loadingService.show();
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
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error al actualizar el local:', error);
        this.customMessageService.error(
          'Error al actualizar el local. Por favor, inténtelo de nuevo.',
          'Error de conexión'
        );
        this.loadingService.hide();
      }
    });
  }
}
