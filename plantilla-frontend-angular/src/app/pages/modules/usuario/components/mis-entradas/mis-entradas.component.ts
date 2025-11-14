import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../../../../../core/services/login.service';

@Component({
  selector: 'app-mis-entradas',
  standalone: false,
  templateUrl: './mis-entradas.component.html',
  styleUrls: ['./mis-entradas.component.css']
})
export class MisEntradasComponent implements OnInit {
  transferForm!: FormGroup;
  verifying = false;
  verified = false;
  userName = 'Usuario';
  isLoadingUserName = true;
  // Nueva lógica para lista de entradas
  myEntries: any[] = [];
  selectedEntry: any = null;
  progressValue = 0; // control de la barra de progreso (0,25,50...)
  showForm = false; // el formulario se muestra sólo después de confirmar selección

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      nombre: ['', [Validators.required]],
      documento: ['', [Validators.required]]
    });

    this.cargarDatosUsuario();
    // Datos de ejemplo; en integración real se deben obtener desde la API
    this.myEntries = [
      { id: 12345, seat: 'A12', remainingTransfers: 2, price: 120.00, eventName: 'Concierto Rock', eventDate: '15 Oct 2024' },
      { id: 67890, seat: 'B05', remainingTransfers: 1, price: 85.50, eventName: 'Teatro Clásico', eventDate: '20 Nov 2024' },
      { id: 11223, seat: 'C01', remainingTransfers: 0, price: 50.75, eventName: 'Festival Indie', eventDate: '05 Dic 2024' }
    ];
  }

  private cargarDatosUsuario(): void {
    try {
      const usuario = this.loginService.getCurrentUser();
      const persona = this.loginService.getCurrentPersona();

      if (persona && (persona as any).nombreCompleto) {
        this.userName = (persona as any).nombreCompleto;
      } else if (usuario && (usuario as any).nombPers) {
        this.userName = (usuario as any).nombPers;
      } else {
        this.userName = 'Usuario';
      }
    } catch (error) {
      console.error('Error al cargar nombre de usuario:', error);
      this.userName = 'Usuario';
    } finally {
      this.isLoadingUserName = false;
    }
  }

  // Simular verificación del destinatario
  verifyDestinatario() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      this.messageService.add({severity:'warn', summary:'Formulario incompleto', detail: 'Complete los campos requeridos.'});
      return;
    }

    this.verifying = true;
    this.verified = false;

    // Simular llamada asíncrona (ej. API) con timeout
    setTimeout(() => {
      this.verifying = false;
      this.verified = true;
      this.messageService.add({severity:'success', summary:'Destinatario verificado', detail: 'El destinatario es válido.'});
    }, 1200);
  }

  // Usuario selecciona una entrada de la lista
  onSelectEntry(entry: any) {
    this.selectedEntry = entry;
    this.progressValue = 25;
    this.showForm = false; // todavía no mostramos el formulario hasta que confirme
    this.messageService.add({severity:'info', summary:'Entrada seleccionada', detail: `Asiento ${entry.seat} — ${entry.eventName}`});
  }

  // Confirmar que se desea usar la entrada seleccionada y mostrar el formulario
  selectForTransfer() {
    if (!this.selectedEntry) {
      this.messageService.add({severity:'warn', summary:'Seleccione una entrada', detail: 'Debe elegir una entrada para transferir.'});
      return;
    }

    // Mostrar formulario y adelantar progreso
    this.showForm = true;
    this.progressValue = 50;

    // Opcional: rellenar campos del formulario si se desea (aquí los dejamos vacíos para que el usuario escriba destinatario)
    this.transferForm.reset();
    this.verified = false;
  }

  // Acciones de botones
  proceedToTransfer() {
    if (!this.verified) {
      // Mostrar aviso y impedir la transferencia si no está verificado
      this.messageService.add({severity:'warn', summary:'Verificación requerida', detail: 'Verifica al destinatario antes de transferir.'});
      return;
    }

    if (!this.selectedEntry) {
      this.messageService.add({severity:'warn', summary:'Entrada no seleccionada', detail: 'Seleccione primero la entrada que desea transferir.'});
      return;
    }

    // Navegar a la pantalla de confirmación pasando el estado mínimo necesario
    const transferData = {
      nombre: this.transferForm.value.nombre,
      email: this.transferForm.value.email,
      telefono: this.transferForm.value.telefono,
      documento: this.transferForm.value.documento,
      // Usar la entrada seleccionada para completar datos del evento
      idTick: this.selectedEntry.id,
      asiento: this.selectedEntry.seat,
      price: this.selectedEntry.price,
      entryTitle: this.selectedEntry.eventName,
      eventDate: this.selectedEntry.eventDate,
      remainingTransfers: this.selectedEntry.remainingTransfers
    };

    // Log transfer data (useful during development) and navigate to confirmation
    console.log('Proceeding to transfer, data:', transferData);
    // Uso navigateByUrl para evitar problemas con rutas relativas/hashes en algunos entornos
    this.router.navigateByUrl('/usuario/confirmarTransferencia', { state: { transferData } });
  }

  // Helpers para la plantilla
  get f() { return this.transferForm.controls; }
}
