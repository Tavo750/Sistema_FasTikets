import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


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
    private router: Router
  ) {
    this.tiposDocumento = [
      { nombre: 'Documento Nacional de Identidad (DNI)', valor: 'DNI' },
      { nombre: 'Carné de Extranjería', valor: 'CE' },
      { nombre: 'Pasaporte', valor: 'PA' }
    ];
  }

  ngOnInit(): void {
    this.initForms();

    // Simular datos iniciales (luego reemplaza con servicio real)
    const datosIniciales = {
      nombres: 'Luis',
      apellidos: 'Ríos',
      correo: 'luis.rios@ejemplo.com',
      telefono: '999888777',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
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

    // Simular actualización
    console.log('Datos a guardar:', this.editForm.value);

    this.perfilForm.patchValue(this.editForm.value);

    this.messageService.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Los datos del perfil se han actualizado exitosamente',
      life: 3000
    });

    this.isEditing = false;
  }

  cambiarContrasena(): void {
    this.router.navigate(['/usuario/perfilPersonal/cambiarContra']);
  }

  getTipoDocumentoNombre(valor: string): string {
    const tipo = this.tiposDocumento.find(t => t.valor === valor);
    return tipo ? tipo.nombre : valor;
  }
}
