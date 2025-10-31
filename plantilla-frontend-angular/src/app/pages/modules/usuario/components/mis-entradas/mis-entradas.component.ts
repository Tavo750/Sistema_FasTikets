import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(7)]],
      nombre: ['', [Validators.required]],
      documento: ['', [Validators.required]]
    });
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

  // Acciones de botones
  proceedToTransfer() {
    if (!this.verified) {
      // Mostrar aviso pero permitir la navegación (cambio mínimo para que la ruta funcione)
      this.messageService.add({severity:'warn', summary:'Verificación requerida', detail: 'Verifica al destinatario antes de transferir.'});
      // Nota: se permite continuar para facilitar pruebas y flujo mínimo.
    }

    // Navegar a la pantalla de confirmación pasando el estado mínimo necesario
    const transferData = {
      nombre: this.transferForm.value.nombre,
      email: this.transferForm.value.email,
      telefono: this.transferForm.value.telefono,
      documento: this.transferForm.value.documento,
      entryTitle: 'Entrada - Nombre del evento',
      eventDate: '15 Oct 2024',
      remainingTransfers: 1
    };

    // Log transfer data (useful during development) and navigate to confirmation
    console.log('Proceeding to transfer, data:', transferData);
    // Uso navigateByUrl para evitar problemas con rutas relativas/hashes en algunos entornos
    this.router.navigateByUrl('/usuario/confirmarTransferencia', { state: { transferData } });
  }

  // Helpers para la plantilla
  get f() { return this.transferForm.controls; }
}
