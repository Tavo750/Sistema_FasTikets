import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transferir-entrada',
  standalone: false,
  templateUrl: './transferir-entrada.component.html',
  styleUrls: ['./transferir-entrada.component.css']
})
export class TransferirEntradaComponent implements OnInit {
  // Campos controlados por la vista (sin lógica compleja, control por formulario puede añadirse luego)
  email = '';
  telefono = '';
  nombre = '';
  documento = '';

  verifying = false;
  verified = false;
  // Nombre del evento que se llenará desde el estado si viene desde MisEntradas
  eventName: string = '';

  // Datos de la entrada seleccionada (si se pasan por state)
  selectedEntry: any = null;
  // Mostrar nota de campos requeridos cuando faltan y el usuario intenta verificar
  showMissingFieldsWarning = false;

  constructor(private router: Router) {}

  verifyDestinatario() {
    if (!this.email || !this.telefono || !this.nombre || !this.documento) {
      // Mostrar la nota en el formulario en lugar de alert
      this.showMissingFieldsWarning = true;
      return;
    }

    this.verifying = true;
    this.verified = false;
    setTimeout(() => {
      this.verifying = false;
      this.verified = true;
      this.showMissingFieldsWarning = false;

      // Construir los datos de transferencia y navegar al componente de confirmación
      const transferData: any = {
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        documento: this.documento,
        idTick: this.selectedEntry?.id,
        asiento: this.selectedEntry?.seat,
        price: this.selectedEntry?.price,
        entryTitle: this.selectedEntry?.eventName || this.eventName,
        eventDate: this.selectedEntry?.eventDate || null,
        remainingTransfers: this.selectedEntry?.remainingTransfers ?? null
      };

      this.router.navigateByUrl('/usuario/confirmarTransferencia', { state: { transferData } });
    }, 900);
  }

  ngOnInit(): void {
    try {
      const st: any = (history && (history as any).state) || {};
      if (st && st.selectedEntry) {
        this.selectedEntry = st.selectedEntry;
        // Si existe eventName en la entrada, asignarlo
        this.eventName = this.selectedEntry.eventName || this.selectedEntry.entryTitle || '';
        // Opcional: podríamos prellenar algún campo con datos del selectedEntry si se desea
      }
    } catch (err) {
      console.warn('No hay entrada seleccionada en el state', err);
    }
  }
}
