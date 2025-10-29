import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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
    private messageService: MessageService
  ) {
    this.editarForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      docIdentidad: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      departamento: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.loading = true;
    
    // Simulación de datos - Reemplazar con servicio real
    setTimeout(() => {
      const clienteSimulado: Cliente = {
        id: this.clienteId,
        nombres: 'Pedro Carlos',
        apellidos: 'Rodriguez Pérez',
        email: 'pedro@example.com',
        docIdentidad: '78364573',
        edad: 35,
        telefono: '983953765',
        departamento: 'lima',
        distrito: 'miraflores',
        direccion: 'Av. Larco 1234, Miraflores'
      };
      
      this.editarForm.patchValue(clienteSimulado);
      this.loading = false;
    }, 500);
    
    // TODO: Implementar llamada real al servicio
    // this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
    //   next: (cliente) => {
    //     this.editarForm.patchValue(cliente);
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'No se pudo cargar el cliente'
    //     });
    //     this.volver();
    //   }
    // });
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

    this.loading = true;
    const datosActualizados = {
      id: this.clienteId,
      ...this.editarForm.value
    };

    // TODO: Reemplazar con servicio real
    setTimeout(() => {
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Cliente actualizado',
        detail: 'Los datos del cliente se actualizaron correctamente'
      });
      
      setTimeout(() => {
        this.volver();
      }, 1500);
    }, 1000);

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
