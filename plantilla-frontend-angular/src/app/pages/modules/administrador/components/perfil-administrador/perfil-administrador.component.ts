import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PerfilAdministradorService } from '../../services/perfil-administrador.service';
import { SessionService } from '../../../../../shared/services/session.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Data as PerfilData } from '../../interfaces/perfil-administrador/perfilAdministradorResponse.interface';
import { ActualizarPerfilRequest } from '../../interfaces/perfil-administrador/actualizar-perfil.interface';
import { LoadingService } from '../../../../../shared/services/loading.service';

interface TipoDocumento {
  nombre: string;
  valor: string;
}

@Component({
  selector: 'app-perfil-administrador',
  standalone: false,
  templateUrl: './perfil-administrador.component.html',
  styleUrls: ['./perfil-administrador.component.css']
})
export class PerfilAdministradorComponent implements OnInit, OnDestroy {
  perfilForm!: FormGroup;
  editForm!: FormGroup;
  isEditing: boolean = false;
  tiposDocumento: TipoDocumento[];
  perfilData: PerfilData | null = null;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private perfilService: PerfilAdministradorService,
    private sessionService: SessionService,
    private loadingService: LoadingService
  ) {
    this.tiposDocumento = [
      { nombre: 'Cédula de Ciudadanía', valor: 'CC' },
      { nombre: 'Cédula de Extranjería', valor: 'CE' },
      { nombre: 'Pasaporte', valor: 'PA' }
    ];
  }

  ngOnInit(): void {
    this.initForms();
    this.verificarAutenticacion();
    this.cargarPerfilAdministrador();
  }

  private verificarAutenticacion(): void {
    const currentUser = this.sessionService.getCurrentUser();

    console.log('🔐 Verificación de autenticación:', {
      userExists: !!currentUser,
      hasToken: !!currentUser?.token,
      userRole: currentUser?.rol,
      userId: currentUser?.idUsuario,
      isAdmin: currentUser?.rol === 'ADMINISTRADOR',
      tokenPreview: currentUser?.token?.substring(0, 50) + '...'
    });

    // Verificar si el usuario es administrador
    if (currentUser && currentUser.rol !== 'ADMINISTRADOR') {
      this.messageService.error(
        'No tiene permisos de administrador para acceder a esta sección.',
        'Acceso Denegado'
      );
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarPerfilAdministrador(): void {
    const currentUser = this.sessionService.getCurrentUser();

    if (!currentUser || !currentUser.idUsuario) {
      this.messageService.error(
        'No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.',
        'Error de sesión'
      );
      this.router.navigate(['/login']);
      return;
    }

    // Debug: Verificar información del usuario y token
    console.log('Usuario actual:', {
      id: currentUser.idUsuario,
      email: currentUser.email,
      rol: currentUser.rol,
      hasToken: !!currentUser.token,
      tokenLength: currentUser.token?.length
    });

    this.isLoading = true;
    this.perfilService.getPerfilAdministrador(currentUser.idUsuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.ok && response.data) {
            this.perfilData = response.data;
            this.populateFormsWithData(response.data);
          } else {
            this.messageService.error(
              response.mensaje || 'No se pudo cargar la información del perfil',
              'Error'
            );
          }
          this.loadingService.hide();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar perfil:', error);
          this.messageService.handleHttpError(error);
          this.loadingService.hide();
          this.isLoading = false;
        }
      });
  }

  private populateFormsWithData(data: PerfilData): void {
    const formData = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.email,
      telefono: data.telefono,
      tipoDocumento: data.tipoDocumento,
      numeroDocumento: data.docIdentidad,
      direccion: data.direccion
    };

    this.perfilForm.patchValue(formData);
    this.editForm.patchValue(formData);
  }

  private initForms(): void {
    this.perfilForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
      direccion: ['']
    });

    this.editForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
  }

  toggleEditMode(): void {
    this.isEditing = true;
    // Solo copiamos los campos editables al formulario de edición
    this.editForm.patchValue({
      nombres: this.perfilForm.get('nombres')?.value,
      apellidos: this.perfilForm.get('apellidos')?.value,
      correo: this.perfilForm.get('correo')?.value,
      telefono: this.perfilForm.get('telefono')?.value,
      direccion: this.perfilForm.get('direccion')?.value
    });
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.editForm.reset();
  }

  guardarCambios(): void {
    if (this.editForm.invalid) {
      this.messageService.warn(
        'Por favor complete todos los campos correctamente antes de continuar',
        'Campos incompletos'
      );
      this.editForm.markAllAsTouched();
      return;
    }

    const currentUser = this.sessionService.getCurrentUser();
    if (!currentUser || !currentUser.idUsuario) {
      this.messageService.error(
        'No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.',
        'Error de sesión'
      );
      this.router.navigate(['/login']);
      return;
    }

    // Preparar los datos para el servicio
    const actualizarData: ActualizarPerfilRequest = {
      nombres: this.editForm.get('nombres')?.value,
      apellidos: this.editForm.get('apellidos')?.value,
      telefono: this.editForm.get('telefono')?.value,
      direccion: this.editForm.get('direccion')?.value,
      email: this.editForm.get('correo')?.value
    };

    this.isLoading = true;

    this.perfilService.putActualizarPerfilAdministrador(currentUser.idUsuario, actualizarData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (response) => {
        if (response.ok) {
          // Actualizar el formulario de visualización con los nuevos datos
          this.perfilForm.patchValue({
            nombres: actualizarData.nombres,
            apellidos: actualizarData.apellidos,
            correo: actualizarData.email,
            telefono: actualizarData.telefono,
            direccion: actualizarData.direccion
          });

          // Actualizar también los datos locales
          if (this.perfilData) {
            this.perfilData.nombres = actualizarData.nombres;
            this.perfilData.apellidos = actualizarData.apellidos;
            this.perfilData.email = actualizarData.email;
            this.perfilData.telefono = actualizarData.telefono;
            this.perfilData.direccion = actualizarData.direccion;
          }

          this.messageService.success(
            response.mensaje || 'Los datos del perfil han sido actualizados exitosamente',
            'Perfil actualizado'
          );

          this.isEditing = false;
        } else {
          this.messageService.error(
            response.mensaje || 'No se pudo actualizar el perfil',
            'Error'
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.messageService.handleHttpError(error);
        this.isLoading = false;
      }
    });
  }

  cambiarContrasena(): void {
    // Navegar al componente de cambiar contraseña
    this.router.navigate(['/administrador/perfilAdministrador/cambiarContra']);
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }
}

