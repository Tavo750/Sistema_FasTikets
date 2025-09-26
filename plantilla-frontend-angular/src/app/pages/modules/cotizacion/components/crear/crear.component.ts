import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Cliente, Cotizacion, ItemCotizacion, Producto } from '../../interfaces/cotizacion-inter';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-crear',
  standalone: false,
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit{
  cotizacionForm: FormGroup;
  items: ItemCotizacion[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];

   // Totales
  subtotal: number = 0;
  igv: number = 0;
  total: number = 0;

  // Dialog
  mostrarDialogConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionConfirmacion: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.cotizacionForm = this.fb.group({
      clienteId: [null, Validators.required],
      fechaVencimiento: [null, Validators.required],
      observaciones: ['']
    });
  }
    ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductos();
    this.agregarItem(); // Agregar un item inicial
  }

  cargarClientes(): void {
    // Simular datos de clientes - reemplazar con servicio real
    this.clientes = [
      { id: 1, nombre: 'Empresa ABC S.A.C.', email: 'contacto@abc.com', telefono: '123456789' },
      { id: 2, nombre: 'Corporación XYZ', email: 'info@xyz.com', telefono: '987654321' },
      { id: 3, nombre: 'Comercial 123', email: 'ventas@123.com', telefono: '456789123' }
    ];
  }
  cargarProductos(): void {
    // Simular datos de productos - reemplazar con servicio real
    this.productos = [
      { id: 1, nombre: 'Producto A', descripcion: 'Descripción del producto A', precio: 100.00 },
      { id: 2, nombre: 'Producto B', descripcion: 'Descripción del producto B', precio: 250.00 },
      { id: 3, nombre: 'Servicio C', descripcion: 'Descripción del servicio C', precio: 500.00 },
      { id: 4, nombre: 'Producto D', descripcion: 'Descripción del producto D', precio: 75.00 }
    ];
  }

  agregarItem(): void {
    this.items.push({
      productoId: null,
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      total: 0
    });
  }
  eliminarItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
      this.calcularTotales();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe mantener al menos un item en la cotización'
      });
    }
  }

  onProductoChange(index: number, event: any): void {
    const productoId = event.value;
    const producto = this.productos.find(p => p.id === productoId);

    if (producto) {
      this.items[index].descripcion = producto.descripcion;
      this.items[index].precioUnitario = producto.precio;
      this.calcularTotal(index);
    }
  }

  calcularTotal(index: number): void {
    const item = this.items[index];
    item.total = item.cantidad * item.precioUnitario;
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.igv = this.subtotal * 0.18; // IGV del 18%
    this.total = this.subtotal + this.igv;
  }

  onSubmit(): void {
    if (this.cotizacionForm.valid && this.items.length > 0) {
      this.mensajeConfirmacion = '¿Está seguro de crear esta cotización?';
      this.accionConfirmacion = 'crear';
      this.mostrarDialogConfirmacion = true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos y agregue al menos un item'
      });
    }
  }

  guardarBorrador(): void {
    if (this.cotizacionForm.get('clienteId')?.value) {
      this.mensajeConfirmacion = '¿Desea guardar esta cotización como borrador?';
      this.accionConfirmacion = 'borrador';
      this.mostrarDialogConfirmacion = true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un cliente para poder guardar el borrador'
      });
    }
  }

  cancelar(): void {
    this.mensajeConfirmacion = '¿Está seguro de cancelar? Se perderán todos los cambios.';
    this.accionConfirmacion = 'cancelar';
    this.mostrarDialogConfirmacion = true;
  }

  confirmarAccion(): void {
    this.mostrarDialogConfirmacion = false;

    switch (this.accionConfirmacion) {
      case 'crear':
        this.crearCotizacion();
        break;
      case 'borrador':
        this.guardarCotizacionBorrador();
        break;
      case 'cancelar':
        this.router.navigate(['/cotizaciones']);
        break;
    }
  }
  private crearCotizacion(): void {
    const cotizacion: Cotizacion = {
      clienteId: this.cotizacionForm.get('clienteId')?.value,
      fechaCreacion: new Date(),
      fechaVencimiento: this.cotizacionForm.get('fechaVencimiento')?.value,
      observaciones: this.cotizacionForm.get('observaciones')?.value || '',
      items: [...this.items],
      subtotal: this.subtotal,
      igv: this.igv,
      total: this.total,
      estado: 'enviada'
    };

    // Aquí llamarías a tu servicio para guardar la cotización
    console.log('Cotización creada:', cotizacion);

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Cotización creada exitosamente'
    });

    // Redirigir después de un breve delay
    setTimeout(() => {
      this.router.navigate(['/cotizaciones']);
    }, 2000);
  }

  private guardarCotizacionBorrador(): void {
    const cotizacion: Cotizacion = {
      clienteId: this.cotizacionForm.get('clienteId')?.value,
      fechaCreacion: new Date(),
      fechaVencimiento: this.cotizacionForm.get('fechaVencimiento')?.value,
      observaciones: this.cotizacionForm.get('observaciones')?.value || '',
      items: [...this.items],
      subtotal: this.subtotal,
      igv: this.igv,
      total: this.total,
      estado: 'borrador'
    };

    console.log('Borrador guardado:', cotizacion);

    this.messageService.add({
      severity: 'info',
      summary: 'Borrador Guardado',
      detail: 'La cotización se ha guardado como borrador'
    });

  }

}
