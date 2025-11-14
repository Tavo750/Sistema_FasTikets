import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GestionClientesService } from '../../../services/gestion-clientes.service';
import { EditarClienteBody } from '../../../interfaces/gestion-clientes/editar-cliente.interface';
import { RegistroUsuarioService } from '../../../../../../core/services/registro-usuario.service';
import { Departamento, Provincia, Distrito } from '../../../../../../core/interfaces/ubigeo.interface';

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

  // Opciones dinámicas para ubigeo
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  selectedDepartamentoId: number | null = null;
  selectedProvinciaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private gestionClientesService: GestionClientesService,
    private registroService: RegistroUsuarioService
  ) {
    this.editarForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      docIdentidad: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      direccion: ['', Validators.required],
      departamentoId: [''],
      provinciaId: [''],
      // Inicializar idDistrito en null para forzar la selección manual
      idDistrito: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartamentos();
    this.cargarCliente();
  }

  private loadDepartamentos(): void {
    this.registroService.getDepartamentos().subscribe({
      next: (res: any) => {
        if (res && res.ok) {
          this.departamentos = res.data || [];
        }
      },
      error: (err: any) => {
        console.error('Error cargando departamentos', err);
      }
    });
  }

  onDepartamentoChange(event: any): void {
    const deptId = event.value;
    this.selectedDepartamentoId = deptId;
    this.provincias = [];
    this.distritos = [];
    this.editarForm.patchValue({ provinciaId: '', idDistrito: null });

    if (!deptId) return;

    this.registroService.getProvincias(String(deptId)).subscribe({
      next: (res: any) => {
        if (res && res.ok) {
          this.provincias = res.data || [];
        }
      },
      error: (err: any) => {
        console.error('Error cargando provincias', err);
      }
    });
  }

  onProvinciaChange(event: any): void {
    const provId = event.value;
    this.selectedProvinciaId = provId;
    this.distritos = [];
    this.editarForm.patchValue({ idDistrito: null });

    if (!provId) return;

    this.registroService.getDistritos(String(provId)).subscribe({
      next: (res: any) => {
        if (res && res.ok) {
          this.distritos = res.data || [];
        }
      },
      error: (err: any) => {
        console.error('Error cargando distritos', err);
      }
    });
  }

  onDistritoChange(event: any): void {
    const distritoId = event.value;
    this.editarForm.patchValue({ idDistrito: distritoId });
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
            direccion: cliente.direccion,
            idDistrito: cliente.idDistrito || 1
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
      email: this.editarForm.get('email')?.value?.trim() || '',
      idDistrito: this.editarForm.get('idDistrito')?.value || 1
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
