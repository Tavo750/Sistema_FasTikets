import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, Cotizacion, Producto, Vendedor } from '../../interfaces/modifica-items';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-modificar',
  standalone: false,
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css'] // Corregido: debe ser styleUrls (array)
})
export class ModificarComponent implements OnInit {
  cotizacionForm!: FormGroup;
  cotizacion: Cotizacion = {} as Cotizacion;
  cotizacionId: number = 0;

  clientes: Cliente[] = [];
  vendedores: Vendedor[] = [];
  productos: Producto[] = [];

  loading: boolean = false;
  guardando: boolean = false;

  displayItemDialog: boolean = false;
  itemForm!: FormGroup;
  editandoItem: boolean = false;
  itemIndex: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cotizacionId = +this.route.snapshot.params['id'];
    this.cargarDatosIniciales();
    this.cargarCotizacion();
  }

  private inicializarFormularios(): void {
    this.cotizacionForm = this.formBuilder.group({
      numero: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      fechaVencimiento: ['', Validators.required],
      clienteId: ['', Validators.required],
      vendedorId: ['', Validators.required],
      observaciones: [''],
      detalles: this.formBuilder.array([])
    });

    this.itemForm = this.formBuilder.group({
      productoId: ['', Validators.required],
      //producto: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  private async cargarDatosIniciales(): Promise<void> {
    try {
      this.loading = true;
      await Promise.all([
        this.cargarClientes(),
        this.cargarVendedores(),
        this.cargarProductos()
      ]);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los datos iniciales'
      });
    } finally {
      this.loading = false;
    }
  }

  private async cargarClientes(): Promise<void> {
    this.clientes = [
      { id: 1, nombre: 'Empresa ABC S.A.C.', contacto: 'Roberto Martínez', email: 'roberto@empresaabc.com', telefono: '+51 999 888 777' },
      { id: 2, nombre: 'Corporación XYZ', contacto: 'Ana Silva', email: 'ana@corpxyz.com', telefono: '+51 888 777 666' },
      { id: 3, nombre: 'Servicios Integrales', contacto: 'Pedro Ruiz', email: 'pedro@servicios.com', telefono: '+51 777 666 555' }
    ];
  }

  private async cargarVendedores(): Promise<void> {
    this.vendedores = [
      { id: 1, nombre: 'Juan Pérez' },
      { id: 2, nombre: 'María García' },
      { id: 3, nombre: 'Carlos López' }
    ];
  }

  private async cargarProductos(): Promise<void> {
    this.productos = [
      { id: 1, nombre: 'Laptop HP ProBook', descripcion: 'Laptop profesional 16GB RAM, 512GB SSD', precio: 2500 },
      { id: 2, nombre: 'Mouse Inalámbrico', descripcion: 'Mouse ergonómico inalámbrico', precio: 45 },
      { id: 3, nombre: 'Servicio de Instalación', descripcion: 'Instalación y configuración de equipos', precio: 300 },
      { id: 4, nombre: 'Teclado Mecánico', descripcion: 'Teclado mecánico retroiluminado', precio: 150 }
    ];
  }

  private async cargarCotizacion(): Promise<void> {
    try {
      this.loading = true;
      this.cotizacion = {
        id: this.cotizacionId,
        numero: 'COT-2024-001',
        fecha: new Date('2024-06-18'),
        fechaVencimiento: new Date('2024-07-18'),
        clienteId: 1,
        vendedorId: 1,
        observaciones: 'Entrega en 15 días hábiles. Garantía de 1 año en equipos.',
        subtotal: 12400,
        descuentoTotal: 625,
        igv: 2119.50,
        total: 13894.50,
        estado: 'PENDIENTE',
        detalles: [
          {
            id: 1,
            productoId: 1,
            producto: 'Laptop HP ProBook',
            descripcion: 'Laptop profesional 16GB RAM, 512GB SSD',
            cantidad: 5,
            precioUnitario: 2500,
            descuento: 5,
            total: 11875
          },
          {
            id: 2,
            productoId: 2,
            producto: 'Mouse Inalámbrico',
            descripcion: 'Mouse ergonómico inalámbrico',
            cantidad: 5,
            precioUnitario: 45,
            descuento: 0,
            total: 225
          },
          {
            id: 3,
            productoId: 3,
            producto: 'Servicio de Instalación',
            descripcion: 'Instalación y configuración de equipos',
            cantidad: 1,
            precioUnitario: 300,
            descuento: 0,
            total: 300
          }
        ]
      };
      this.llenarFormulario();
    } catch (error) {
      console.error('Error cargando cotización:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar la cotización'
      });
    } finally {
      this.loading = false;
    }
  }

  private llenarFormulario(): void {
    this.cotizacionForm.patchValue({
      numero: this.cotizacion.numero,
      fecha: this.cotizacion.fecha,
      fechaVencimiento: this.cotizacion.fechaVencimiento,
      clienteId: this.cotizacion.clienteId,
      vendedorId: this.cotizacion.vendedorId,
      observaciones: this.cotizacion.observaciones
    });

    const detallesArray = this.cotizacionForm.get('detalles') as FormArray;
    detallesArray.clear();

    this.cotizacion.detalles.forEach(detalle => {
      const detalleGroup = this.formBuilder.group({
        id: [detalle.id],
        productoId: [detalle.productoId],
        producto: [detalle.producto],
        descripcion: [detalle.descripcion],
        cantidad: [detalle.cantidad],
        precioUnitario: [detalle.precioUnitario],
        descuento: [detalle.descuento],
        total: [detalle.total]
      });
      detallesArray.push(detalleGroup);
    });
  }

  get detalles(): FormArray {
    return this.cotizacionForm.get('detalles') as FormArray;
  }

  get subtotal(): number {
    return this.detalles.controls.reduce((sum, control) => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precio = control.get('precioUnitario')?.value || 0;
      return sum + (cantidad * precio);
    }, 0);
  }

  get descuentoTotal(): number {
    return this.detalles.controls.reduce((sum, control) => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precio = control.get('precioUnitario')?.value || 0;
      const descuento = control.get('descuento')?.value || 0;
      return sum + ((cantidad * precio) * (descuento / 100));
    }, 0);
  }

  get igv(): number {
    return (this.subtotal - this.descuentoTotal) * 0.18;
  }

  get total(): number {
    return this.subtotal - this.descuentoTotal + this.igv;
  }

  onProductoChange(productoId: number): void {
    const producto = this.productos.find(p => p.id === productoId);
    if (producto) {
      this.itemForm.patchValue({
        producto: producto.nombre,
        descripcion: producto.descripcion,
        precioUnitario: producto.precio
      });
    }
  }

  calcularTotalItem(): number {
    const cantidad = this.itemForm.get('cantidad')?.value || 0;
    const precio = this.itemForm.get('precioUnitario')?.value || 0;
    const descuento = this.itemForm.get('descuento')?.value || 0;
    const subtotal = cantidad * precio;
    const descuentoMonto = subtotal * (descuento / 100);
    return subtotal - descuentoMonto;
  }

  mostrarDialogoItem(editar: boolean = false, index: number = -1): void {
    this.editandoItem = editar;
    this.itemIndex = index;

    if (editar && index >= 0) {
      const detalle = this.detalles.at(index);
      this.itemForm.patchValue(detalle.value);
    } else {
      this.itemForm.reset();
      this.itemForm.patchValue({
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0
      });
    }

    this.displayItemDialog = true;
  }

  guardarItem(): void {
    if (this.itemForm.valid) {
      const itemData = {
        ...this.itemForm.value,
        total: this.calcularTotalItem()
      };

      if (this.editandoItem && this.itemIndex >= 0) {
        this.detalles.at(this.itemIndex).patchValue(itemData);
      } else {
        const nuevoItem = this.formBuilder.group({
          id: [null],
          productoId: [itemData.productoId],
          producto: [itemData.producto],
          descripcion: [itemData.descripcion],
          cantidad: [itemData.cantidad],
          precioUnitario: [itemData.precioUnitario],
          descuento: [itemData.descuento],
          total: [itemData.total]
        });
        this.detalles.push(nuevoItem);
      }
      this.itemForm.reset({
      productoId: '',
      producto: '',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0
    });
    this.editandoItem = false;
    this.itemIndex = -1;

      this.displayItemDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'El item ha sido guardado correctamente.'
      });
    }
  }

  eliminarItem(index: number): void {
    this.detalles.removeAt(index);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'El item ha sido eliminado correctamente.'
    });
  }

  cancelar(): void {
    this.router.navigate(['/cotizaciones']);
  }

  guardarBorrador(): void {
    this.guardando = true;
    setTimeout(() => {
      this.guardando = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Guardado',
        detail: 'La cotización ha sido guardada como borrador.'
      });
    }, 1500);
  }

  onSubmit(): void {
    if (this.cotizacionForm.valid) {
      this.guardando = true;
      setTimeout(() => {
        this.guardando = false;
        this.router.navigate(['/cotizaciones']);
        this.messageService.add({
          severity: 'success',
          summary: 'Creación exitosa',
          detail: 'La cotización ha sido creada exitosamente.'
        });
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos.'
      });
    }
  }
   generarPDF(): void {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text('Cotización: ' + this.cotizacion.numero, 20, 20);

    // Información del cliente
    doc.setFontSize(12);
    doc.text('Cliente: ' + this.cotizacion.cliente?.nombre, 20, 30);
    doc.text('Contacto: ' + this.cotizacion.cliente?.contacto, 20, 40);

    // Detalles de la cotización
    let y = 50;
    this.cotizacion.detalles.forEach((detalle, index) => {
      doc.text(`Producto: ${detalle.producto}`, 20, y);
      doc.text(`Descripción: ${detalle.descripcion}`, 20, y + 10);
      doc.text(`Cantidad: ${detalle.cantidad}`, 20, y + 20);
      doc.text(`Precio: ${detalle.precioUnitario}`, 20, y + 30);
      doc.text(`Total: ${detalle.total}`, 20, y + 40);
      y += 50;
    });

    // Totales
    doc.text('Subtotal: ' + this.cotizacion.subtotal, 20, y);
    doc.text('Descuento: ' + this.cotizacion.descuentoTotal, 20, y + 10);
    doc.text('IGV: ' + this.cotizacion.igv, 20, y + 20);
    doc.text('Total: ' + this.cotizacion.total, 20, y + 30);

    // Guardar PDF
    doc.save('cotizacion_' + this.cotizacion.numero + '.pdf');
  }



}
