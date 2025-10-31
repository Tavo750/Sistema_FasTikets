import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PerfilPersonalService } from '../../services/perfil-personal.service';
import { SessionService } from '../../../../../shared/services/session.service';


interface TipoDocumento {
  nombre: string;
  valor: string;
}

@Component({
  selector: 'app-perfil-personal',
  standalone: false,
  templateUrl: './perfil-personal.component.html',
  styleUrls: ['./perfil-personal.component.css']
})
export class PerfilPersonalComponent implements OnInit {
  perfilForm!: FormGroup;
  editForm!: FormGroup;
  isEditing: boolean = false;
  tiposDocumento: TipoDocumento[];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private perfilPersonalService: PerfilPersonalService,
    private sessionService: SessionService
  ) {
    this.tiposDocumento = [
      { nombre: 'Documento Nacional de Identidad (DNI)', valor: 'DNI' },
      { nombre: 'Carné de Extranjería', valor: 'CE' },
      { nombre: 'Pasaporte', valor: 'PA' }
    ];
  }

  ngOnInit(): void {
    this.initForms();
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const currentUser = this.sessionService.getCurrentUser();
    
    if (!currentUser || !currentUser.idUsuario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de sesión',
        detail: 'No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.',
        life: 3000
      });
      this.router.navigate(['/login']);
      return;
    }

    this.perfilPersonalService.getobtenerPerfilPorId(currentUser.idUsuario).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          const datosUsuario = {
            nombres: response.data.nombres,
            apellidos: response.data.apellidos,
            correo: response.data.email,
            telefono: response.data.telefono,
            tipoDocumento: response.data.tipoDocumento,
            numeroDocumento: response.data.docIdentidad,
            direccion: response.data.direccion
          };

          this.perfilForm.patchValue(datosUsuario);
          this.editForm.patchValue(datosUsuario);
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Datos no encontrados',
            detail: response.mensaje || 'No se pudieron cargar los datos del perfil',
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar datos',
          detail: 'Ocurrió un error al cargar los datos del perfil. Intente nuevamente.',
          life: 3000
        });
      }
    });
  }

  private initForms(): void {
    this.perfilForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor complete todos los campos correctamente antes de continuar',
        life: 3000
      });
      this.editForm.markAllAsTouched();
      return;
    }

    const currentUser = this.sessionService.getCurrentUser();
    
    if (!currentUser || !currentUser.idUsuario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de sesión',
        detail: 'No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.',
        life: 3000
      });
      return;
    }

    const datosActualizados = {
      nombres: this.editForm.get('nombres')?.value,
      apellidos: this.editForm.get('apellidos')?.value,
      telefono: this.editForm.get('telefono')?.value,
      direccion: this.editForm.get('direccion')?.value,
      email: this.editForm.get('correo')?.value
    };

    this.perfilPersonalService.putActualizarPerfilPorId(currentUser.idUsuario, datosActualizados).subscribe({
      next: (response) => {
        if (response.ok) {
          this.perfilForm.patchValue({
            nombres: datosActualizados.nombres,
            apellidos: datosActualizados.apellidos,
            correo: datosActualizados.email,
            telefono: datosActualizados.telefono,
            direccion: datosActualizados.direccion
          });

          this.messageService.add({
            severity: 'success',
            summary: 'Perfil actualizado',
            detail: 'Los datos del perfil se han actualizado exitosamente',
            life: 3000
          });

          this.isEditing = false;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Error al actualizar',
            detail: response.mensaje || 'No se pudieron actualizar los datos del perfil',
            life: 3000
          });
        }
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error al actualizar',
          detail: 'Ocurrió un error al actualizar los datos del perfil. Intente nuevamente.',
          life: 3000
        });
      }
    });
  }

  cambiarContrasena(): void {
    this.router.navigate(['/usuario/perfilPersonal/cambiarContra']);
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }
}
