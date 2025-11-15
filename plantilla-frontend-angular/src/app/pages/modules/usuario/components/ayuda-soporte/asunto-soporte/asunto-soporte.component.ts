import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AyudaSoporteService } from '../../../services/ayuda-soporte.service';
import { SessionService } from '../../../../../../shared/services/session.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { AyudaSoporteRequest, AyudaSoporteResponse, AyudaSoporteData } from '../../../interfaces/ayuda-soporte/ayuda-soporte.interface';
import { AyudaSoporteListItem } from '../../../interfaces/ayuda-soporte/ayuda-soporte-listar.interface';

@Component({
  selector: 'app-asunto-soporte',
  standalone: false,
  templateUrl: './asunto-soporte.component.html',
  styleUrls: ['./asunto-soporte.component.css']
  // No providers here: use the root/shared MessageService so p-toast (en app.component) lo reciba
})
export class AsuntoSoporteComponent {
  @ViewChild('supportForm') supportForm!: NgForm;
  
  asunto: string = '';
  mensaje: string = '';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | string = 'MEDIA';
  canalOrigen: string = 'PORTAL_WEB';
  ipOrigen: string = '';
  metadataAdicional: string = '';
  // Dialogo de confirmación tras crear la solicitud
  mostrarDialogExito: boolean = false;
  ticketData?: AyudaSoporteData | null = null;
  isLoading: boolean = false;
  // listado de solicitudes
  mostrarListadoDialog: boolean = false;
  solicitudes: AyudaSoporteListItem[] = [];
  loadingSolicitudes: boolean = false;
  // observación seleccionada
  mostrarObservacionDialog: boolean = false;
  observacionSeleccionada: string | null = null;
  // Permitir letras (incluyendo tildes), números, espacios y signos de puntuación comunes
  readonly asuntoPattern: RegExp = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\,\?\!\.\'\"\:\(\)]+$/;

  validarAsunto(text: string): boolean {
    if (!text) return false;
    const trimmed = text.trim();
    if (trimmed.length < 3) return false;
    return this.asuntoPattern.test(trimmed);
  }

  constructor(
    private ayudaSoporteService: AyudaSoporteService,
    private sessionService: SessionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // intentar detectar la IP pública del cliente para enviarla al backend
    this.loadPublicIp();
  }

  private loadPublicIp(): void {
    try {
      // usar servicio público que devuelve { ip: 'x.x.x.x' }
      const ipService = 'https://api.ipify.org?format=json';
      // HttpClient no está inyectado aquí por defecto en todas las instancias, intentar usar fetch como fallback
      // primero intentar con fetch para no introducir dependencias adicionales
      fetch(ipService).then(res => res.json()).then((data: any) => {
        if (data && data.ip) {
          this.ipOrigen = data.ip;
        }
      }).catch(err => {
        // silenciar errores; en entornos offline o con bloqueo de CORS puede fallar
        console.warn('No se pudo obtener IP pública con fetch', err);
      });
    } catch (e) {
      console.warn('Error al intentar detectar IP pública', e);
    }
  }

  enviarCorreo(form?: NgForm): void {
    console.log('enviarCorreo called', { asunto: this.asunto, mensaje: this.mensaje });
    // Debug rápido: mostrar toast informativo para confirmar que el handler se ejecutó
    this.messageService.add({ severity: 'info', summary: 'Envío', detail: 'Procesando solicitud...' });

    // Si se pasa el formulario, validar su estado
    if (form && !form.valid) {
      // marcar controles como tocados para mostrar errores inline
      Object.values(form.controls).forEach(control => control.markAsTouched());
      // Mostrar un toast general para campos obligatorios vacíos
      this.messageService.add({ severity: 'warn', summary: 'Formulario incompleto', detail: 'Por favor completa los campos obligatorios.' });
      return;
    }

    // Validación extra por si se llama programáticamente
    if (!this.validarAsunto(this.asunto)) {
      // Usar MessageService para mostrar el aviso en el p-toast global en lugar de alert()
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El asunto no es válido. Usa al menos 3 caracteres y evita símbolos raros.' });
      return;
    }

    // Construir el body según la API observada en Postman
    const currentUser = this.sessionService.getCurrentUser();
    console.log('Usuario actual (sessionService.getCurrentUser):', currentUser);

    // Si no hay usuario en sesión, usar datos de prueba para facilitar testing desde el front
    const testUserFallback = { idUsuario: 3, nombreUsuario: 'miguel', emailUsuario: 'prueba@gmail.com' };
    const effectiveUser: any = (currentUser && currentUser.idUsuario) ? currentUser : testUserFallback;
    if (!currentUser || !currentUser.idUsuario) {
      // informar que se están usando datos de prueba para la petición
      this.messageService.add({ severity: 'info', summary: 'Modo prueba', detail: 'Se usarán datos de prueba para idUsuario (frontend).' });
      console.warn('No se detectó sesión: usando user fallback para pruebas:', testUserFallback);
    }
    const idUsuario = effectiveUser.idUsuario || 0;

    // Rellenar campos opcionales con valores por defecto para pruebas si están vacíos
    const ipOrigenToSend = (this.ipOrigen && this.ipOrigen.trim().length > 0) ? this.ipOrigen.trim() : '127.0.0.1';
    const metadataToSend = (this.metadataAdicional && this.metadataAdicional.trim().length > 0) ? this.metadataAdicional.trim() : 'prueba_frontend';

    const payload: AyudaSoporteRequest = {
      idUsuario,
      asunto: this.asunto.trim(),
      mensaje: this.mensaje.trim(),
      prioridad: this.prioridad,
      canalOrigen: this.canalOrigen,
      ipOrigen: ipOrigenToSend,
      metadataAdicional: metadataToSend
    };

    this.isLoading = true;

    this.ayudaSoporteService.crearSolicitudSoporte(payload).subscribe({
      next: (res: AyudaSoporteResponse) => {
        this.isLoading = false;
        if (res && res.ok) {
          // mostrar toast
          console.log('soporte creado, mostrando toast:', res);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: res.mensaje || 'Solicitud creada' });
          // guardar datos para el diálogo y abrirlo
          this.ticketData = res.data || null;
          this.mostrarDialogExito = true;
          // limpiar formulario (pero mantener ip/origen visible)
          this.asunto = '';
          this.mensaje = '';
          this.prioridad = 'MEDIA';
          this.metadataAdicional = '';
          if (form) form.resetForm();
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res?.mensaje || 'No se pudo crear la solicitud' });
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error creando solicitud de soporte:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la solicitud de soporte' });
      }
    });
  }

  abrirListado(): void {
    this.mostrarListadoDialog = true;
    this.cargarSolicitudes();
  }

  private cargarSolicitudes(): void {
    this.loadingSolicitudes = true;
    this.solicitudes = [];
    this.ayudaSoporteService.listarSolicitudes().subscribe({
      next: (res) => {
        this.loadingSolicitudes = false;
        if (res && res.ok) {
          // Filtrar por el usuario actual: mostrar solo las solicitudes del usuario logeado
          const currentUser = this.sessionService.getCurrentUser();
          const myId = currentUser?.idUsuario;
          const all = res.data || [];
          if (myId) {
            this.solicitudes = all.filter(s => s.idUsuario === myId);
            if (this.solicitudes.length === 0) {
              this.messageService.add({ severity: 'info', summary: 'Sin solicitudes', detail: 'No tienes solicitudes registradas.' });
            }
          } else {
            // Si no hay sesión, mostramos todo (modo prueba) y avisamos
            this.solicitudes = all;
            this.messageService.add({ severity: 'info', summary: 'Modo prueba', detail: 'No se detectó sesión: mostrando todas las solicitudes.' });
          }
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: res?.mensaje || 'No se pudo obtener el listado' });
        }
      },
      error: (err) => {
        this.loadingSolicitudes = false;
        console.error('Error cargando solicitudes:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las solicitudes' });
      }
    });
  }

  verObservacion(item: AyudaSoporteListItem): void {
    if (item.observaciones) {
      this.observacionSeleccionada = item.observaciones;
      this.mostrarObservacionDialog = true;
      return;
    }

    // Si no hay observaciones pero el estado indica resuelto/cerrado, abrir igualmente un diálogo con nota
    if (item.estado === 'RESUELTO' || item.estado === 'CERRADO') {
      this.observacionSeleccionada = `El ticket está marcado como ${item.estado}. No hay texto de observación disponible.`;
      this.mostrarObservacionDialog = true;
      return;
    }

    // Si está ABIERTO y no hay observaciones
    this.messageService.add({ severity: 'info', summary: 'Pendiente', detail: 'Aún no hay respuesta (observaciones vacías).' });
  }
}
