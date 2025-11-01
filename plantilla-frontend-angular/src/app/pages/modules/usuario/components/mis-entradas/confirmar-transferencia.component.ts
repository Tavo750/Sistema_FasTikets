import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-confirmar-transferencia',
  standalone: false,
  templateUrl: './confirmar-transferencia.component.html',
  styleUrls: ['./confirmar-transferencia.component.css']
})
export class ConfirmarTransferenciaComponent {
  data: any = {};
  transferCompleted = false;

  // fecha formateada para mostrar en pantalla de éxito
  fechaTransferencia: string | null = null;
  // controlar diálogo de confirmación al cancelar
  showCancelDialog = false;

  constructor(private router: Router, private messageService: MessageService) {
    // Leer datos enviados por navigation state (desde MisEntradas)
    this.data = history.state?.transferData || {};
  }

  confirmar() {
    // Aquí se llamaría al endpoint para confirmar la transferencia.
    // Para mostrar la pantalla de 'Transferencia exitosa' cambiamos el estado local
    this.transferCompleted = true;
    this.fechaTransferencia = new Date().toLocaleDateString();
    this.messageService.add({ severity: 'success', summary: 'Transferencia', detail: 'Transferencia confirmada' });
  }

  cancelar() {
    // mostrar diálogo de confirmación antes de salir
    this.showCancelDialog = true;
  }

  // usuario confirma que quiere cancelar la transferencia
  confirmCancel() {
    this.showCancelDialog = false;
    this.router.navigate(['/usuario/misEntradas']);
  }

  // usuario rechaza la cancelación y vuelve al flujo
  rejectCancel() {
    this.showCancelDialog = false;
  }

  // En la pantalla de éxito, este botón NO debe redirigir a ninguna parte.
  // Mostrar un mensaje informativo en su lugar.
  viewMyEntries() {
    this.messageService.add({ severity: 'info', summary: 'Ver Mis Entradas', detail: 'Puedes volver a Mis Entradas desde el menú lateral.' });
  }
}
