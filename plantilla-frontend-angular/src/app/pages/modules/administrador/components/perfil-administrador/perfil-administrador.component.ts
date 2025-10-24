import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.tiposDocumento = [
      { nombre: 'Cédula de Ciudadanía', valor: 'CC' },
      { nombre: 'Cédula de Extranjería', valor: 'CE' },
      { nombre: 'Pasaporte', valor: 'PA' }
    ];
  }

  ngOnInit(): void {
    this.initForms();
    // Simular datos iniciales (reemplazar con llamada al servicio)
    const datosIniciales = {
      nombres: 'John',
      apellidos: 'Doe',
      correo: 'john.doe@example.com',
      telefono: '123456789',
      tipoDocumento: 'CC',
      numeroDocumento: '1234567890',
      departamento: 'Lima',
      distrito: 'Miraflores',
      direccion: 'Av. Principal 123'
    };

    this.perfilForm.patchValue(datosIniciales);
    this.editForm.patchValue(datosIniciales);
  }

  private initForms(): void {
    this.perfilForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required]]
    });

    this.editForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
  }

  toggleEditMode(): void {
    this.isEditing = true;
    this.editForm.patchValue({
      nombres: this.perfilForm.get('nombres')?.value,
      apellidos: this.perfilForm.get('apellidos')?.value,
      correo: this.perfilForm.get('correo')?.value,
      telefono: this.perfilForm.get('telefono')?.value
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

    // Aquí implementarías la lógica para guardar los cambios en el backend
    console.log('Datos a guardar:', this.editForm.value);

    // Actualizar el formulario de visualización con los nuevos datos
    this.perfilForm.patchValue({
      nombres: this.editForm.get('nombres')?.value,
      apellidos: this.editForm.get('apellidos')?.value,
      correo: this.editForm.get('correo')?.value,
      telefono: this.editForm.get('telefono')?.value
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Los datos del perfil han sido actualizados exitosamente',
      life: 3000
    });

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

