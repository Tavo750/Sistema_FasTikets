import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GestionClientesService } from '../../../services/gestion-clientes.service';
import { EditarClienteBody } from '../../../interfaces/gestion-clientes/editar-cliente.interface';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  docIdentidad: string;
  edad: number;
  telefono: string;
  departamento: string;
  distrito: string;
  direccion: string;
}

@Component({
  selector: 'app-editar-cliente-admi',
  standalone: false,
  templateUrl: './editar-cliente-admi.component.html',
  styleUrls: ['./editar-cliente-admi.component.css'],
  providers: [MessageService]
})
export class EditarClienteAdmiComponent  implements OnInit{
  editarForm: FormGroup;
  clienteId: number = 0;
  loading: boolean = false;

  // Opciones para los selects
  departamentos = [
    { label: 'Selecciona', value: '' },
    { label: 'Lima', value: 'lima' },
    { label: 'Arequipa', value: 'arequipa' },
    { label: 'Cusco', value: 'cusco' },
    { label: 'Piura', value: 'piura' },
    { label: 'La Libertad', value: 'la-libertad' }
  ];

  distritos = [
    { label: 'Selecciona', value: '' },
    { label: 'Miraflores', value: 'miraflores' },
    { label: 'San Isidro', value: 'san-isidro' },
    { label: 'Barranco', value: 'barranco' },
    { label: 'Surco', value: 'surco' },
    { label: 'San Borja', value: 'san-borja' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private gestionClientesService: GestionClientesService
  ) {
    this.editarForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      docIdentidad: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.loading = true;
    
    this.gestionClientesService.getListarGestionClientesPorId(this.clienteId).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          const cliente = response.data;
          this.editarForm.patchValue({
            nombres: cliente.nombres,
            apellidos: cliente.apellidos,
            email: cliente.email,
            docIdentidad: cliente.docIdentidad,
            telefono: cliente.telefono,
            direccion: cliente.direccion
          });
          this.loading = false;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.mensaje || 'No se pudo cargar el cliente'
          });
          this.volver();
        }
      },
      error: (error) => {
        console.error('Error al cargar el cliente:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el cliente'
        });
        this.volver();
      }
    });
  }

  onSubmit(): void {
    if (this.editarForm.invalid) {
      this.editarForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    if (!this.clienteId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'ID de cliente no válido'
      });
      return;
    }

    this.loading = true;
    const datosActualizados: EditarClienteBody = {
      nombres: this.editarForm.get('nombres')?.value?.trim() || '',
      docIdentidad: this.editarForm.get('docIdentidad')?.value?.trim() || '',
      apellidos: this.editarForm.get('apellidos')?.value?.trim() || '',
      telefono: this.editarForm.get('telefono')?.value?.trim() || '',
      direccion: this.editarForm.get('direccion')?.value?.trim() || '',
      email: this.editarForm.get('email')?.value?.trim() || ''
    };

    // Validar que ningún campo esté vacío
    if (Object.values(datosActualizados).some(val => !val)) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios'
      });
      return;
    }

    console.log('ID del cliente a actualizar:', this.clienteId);
    console.log('Datos a enviar:', datosActualizados);

    try {
      console.log('Iniciando actualización del cliente...');
      console.log('ID del cliente:', this.clienteId);
      console.log('Datos a actualizar:', datosActualizados);

      this.gestionClientesService.putListarClientesPorId(this.clienteId, datosActualizados)
        .subscribe({
          next: (response) => {
            console.log('Respuesta del servidor:', response);
            this.loading = false;
            
            if (response && response.ok) {
              console.log('Actualización exitosa');
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Cliente actualizado correctamente'
              });
              setTimeout(() => {
                console.log('Redirigiendo...');
                this.volver();
              }, 1500);
            } else {
              console.error('Respuesta sin éxito:', response);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response?.mensaje || 'No se pudo actualizar el cliente'
              });
            }
          },
          error: (error) => {
            console.error('Error en la actualización:', error);
            this.loading = false;
            
            let errorMessage = 'No se pudo actualizar el cliente';
            
            if (error.error) {
              console.error('Detalles del error:', {
                status: error.status,
                statusText: error.statusText,
                error: error.error
              });
              
              if (typeof error.error === 'object') {
                errorMessage = error.error.mensaje || error.error.message || errorMessage;
              } else if (typeof error.error === 'string') {
                try {
                  const errorObj = JSON.parse(error.error);
                  errorMessage = errorObj.mensaje || errorObj.message || errorMessage;
                } catch (e) {
                  errorMessage = error.error;
                }
              }
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMessage
            });
          }
        });
    } catch (e) {
      console.error('Error inesperado:', e);
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error inesperado al actualizar el cliente'
      });
    }

    // TODO: Implementar llamada real al servicio
    // this.clienteService.actualizarCliente(datosActualizados).subscribe({
    //   next: (response) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Cliente actualizado',
    //       detail: 'Los datos del cliente se actualizaron correctamente'
    //     });
    //     setTimeout(() => this.volver(), 1500);
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'No se pudo actualizar el cliente'
    //     });
    //   }
    // });
  }

  volver(): void {
    this.router.navigate(['/administrador/gestionClientes']);
  }

  cancelar(): void {
    this.volver();
  }
}
