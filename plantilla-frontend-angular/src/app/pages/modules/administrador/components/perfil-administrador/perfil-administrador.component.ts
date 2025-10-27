import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilAdministradorService } from '../../services/perfil-administrador.service';
import { SessionService } from '../../../../../shared/services/session.service';
import { MessageService } from '../../../../../core/services/message.service';
import { Data as PerfilData } from '../../interfaces/perfil-administrador/perfilAdministradorResponse.interface';

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
export class PerfilAdministradorComponent implements OnInit {
  perfilForm!: FormGroup;
  editForm!: FormGroup;
  isEditing: boolean = false;
  tiposDocumento: TipoDocumento[];
  perfilData: PerfilData | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private perfilService: PerfilAdministradorService,
    private sessionService: SessionService
  ) {
    this.tiposDocumento = [
      { nombre: 'Cédula de Ciudadanía', valor: 'CC' },
      { nombre: 'Cédula de Extranjería', valor: 'CE' },
      { nombre: 'Pasaporte', valor: 'PA' }
    ];
  }

  ngOnInit(): void {
    this.initForms();
    this.cargarPerfilAdministrador();
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

    this.isLoading = true;
    this.perfilService.getPerfilAdministrador(currentUser.idUsuario).subscribe({
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.messageService.handleHttpError(error);
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

    // TODO: Aquí implementarías la lógica para guardar los cambios en el backend
    // Ejemplo de lo que se enviaría al servicio:
    console.log('Datos a guardar:', this.editForm.value);

    // Actualizar el formulario de visualización con los nuevos datos
    this.perfilForm.patchValue({
      nombres: this.editForm.get('nombres')?.value,
      apellidos: this.editForm.get('apellidos')?.value,
      correo: this.editForm.get('correo')?.value,
      telefono: this.editForm.get('telefono')?.value,
      direccion: this.editForm.get('direccion')?.value
    });

    // Actualizar también los datos locales
    if (this.perfilData) {
      this.perfilData.nombres = this.editForm.get('nombres')?.value;
      this.perfilData.apellidos = this.editForm.get('apellidos')?.value;
      this.perfilData.email = this.editForm.get('correo')?.value;
      this.perfilData.telefono = this.editForm.get('telefono')?.value;
      this.perfilData.direccion = this.editForm.get('direccion')?.value;
    }

    this.messageService.success(
      'Los datos del perfil han sido actualizados exitosamente',
      'Perfil actualizado'
    );

    this.isEditing = false;
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

